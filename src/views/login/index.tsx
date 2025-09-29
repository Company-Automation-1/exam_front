import { authApi } from '@/services/api';
import type { LoginRequest } from '@/services/types/auth';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authApi.login(values);
      if (response.code === 200) {
        message.success('登录成功');
        console.log('用户信息:', response.result.user);
        console.log('访问令牌:', response.result.accessToken);
      }
    } catch (error) {
      message.error('登录失败');
      console.error('登录错误:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>登录示例</h2>
      <Form onFinish={handleLogin} layout="vertical">
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: '请输入邮箱' }]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
