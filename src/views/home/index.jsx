import { Result } from 'antd';

const Home = () => {
  return (
    <>
      <>
        <div
          style={{
            height: 'calc(100vh - 60px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Result status="404" title="首页" subTitle="待开发页面，敬请期待" />
        </div>
      </>
    </>
  );
};

export default Home;
