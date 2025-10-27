/**
 * 视频录制管理器
 * 负责分段录制视频并上传到后端
 */
class VideoRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.stream = null;
    this.sessionId = null;
    this.recordingStartTime = null;
    this.minRecordingTime = 3000; // 最少录制3秒（防抖）
    this.shouldSkipUpload = false; // 是否跳过上传
  }

  /**
   * 初始化摄像头流
   */
  async initStream() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1280,
          height: 720,
          frameRate: 30,
        },
        audio: true,
      });
      return true;
    } catch (error) {
      console.error('初始化摄像头失败:', error);
      return false;
    }
  }

  /**
   * 开始录制第一段
   */
  async startFirstSegment(sessionId, questionId, questionIndex) {
    this.sessionId = sessionId;

    // 初始化摄像头
    const success = await this.initStream();
    if (!success) {
      console.error('摄像头初始化失败');
      return false;
    }

    // 开始录制
    return this.startRecording(questionId, questionIndex);
  }

  /**
   * 开始录制
   */
  startRecording(questionId, questionIndex) {
    try {
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000,
      });

      this.recordedChunks = [];
      this.recordingStartTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.handleRecordingStop(questionId, questionIndex);
      };

      this.mediaRecorder.start(1000); // 每秒收集数据
      this.isRecording = true;

      console.log(`开始录制第${questionIndex + 1}题`);
      return true;
    } catch (error) {
      console.error('开始录制失败:', error);
      return false;
    }
  }

  /**
   * 切换到下一段录制
   */
  async switchSegment(nextQuestionId, nextQuestionIndex) {
    if (!this.isRecording) {
      // 如果没有在录制，直接开始新段
      return this.startRecording(nextQuestionId, nextQuestionIndex);
    }

    // 检查录制时长（防抖）
    const recordingDuration = Date.now() - this.recordingStartTime;

    if (recordingDuration < this.minRecordingTime) {
      console.log(`录制时间太短(${recordingDuration}ms)，跳过上传`);
      // 标记跳过上传
      this.shouldSkipUpload = true;

      // 停止当前录制
      this.mediaRecorder.stop();
      this.isRecording = false;

      // 等待停止完成
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 重置标记
      this.shouldSkipUpload = false;

      // 开始新段录制
      return this.startRecording(nextQuestionId, nextQuestionIndex);
    }

    // 正常流程：先开始新段录制，再上传旧段（异步）
    // 1. 停止当前段（会触发 onstop，异步上传）
    this.mediaRecorder.stop();
    this.isRecording = false;

    // 2. 立即开始新段录制（不等待上传完成）
    // 等待一小段时间，确保 stop 事件触发
    await new Promise((resolve) => setTimeout(resolve, 50));

    return this.startRecording(nextQuestionId, nextQuestionIndex);
  }

  /**
   * 处理录制停止
   */
  handleRecordingStop(questionId, questionIndex) {
    // 检查是否跳过上传
    if (this.shouldSkipUpload) {
      console.log('跳过上传（录制时间太短）');
      return;
    }

    // 检查是否有录制数据
    if (this.recordedChunks.length === 0) {
      console.log('没有录制数据，跳过上传');
      return;
    }

    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });

    // 异步上传，不阻塞录制
    this.uploadVideo(blob, questionId, questionIndex);
  }

  /**
   * 上传视频到后端
   */
  async uploadVideo(videoBlob, questionId, questionIndex) {
    const formData = new FormData();
    formData.append('video', videoBlob, `question_${questionIndex}.webm`);
    formData.append('sessionId', this.sessionId);
    formData.append('questionId', questionId);
    formData.append('questionIndex', questionIndex);

    try {
      console.log(`上传第${questionIndex + 1}题视频...`);

      const response = await fetch('/api/monitoring/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`第${questionIndex + 1}题视频上传成功`, result);
      } else {
        console.error(`第${questionIndex + 1}题视频上传失败`);
        // 静默失败，不做任何操作
      }
    } catch (error) {
      console.error(`第${questionIndex + 1}题视频上传失败:`, error);
      // 静默失败，不做任何操作
    }
  }

  /**
   * 停止所有录制
   */
  async stopRecording() {
    if (this.isRecording && this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }

    // 等待最后一段上传
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 关闭摄像头
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    console.log('录制已停止');
  }

  /**
   * 获取录制状态
   */
  getStatus() {
    return {
      isRecording: this.isRecording,
      hasStream: !!this.stream,
    };
  }
}

export default VideoRecorder;
