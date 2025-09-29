import { userApi } from '@/services/api';
import type { User } from '@/services/types/user';

const Example = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getUsers({ page: 1, pageSize: 10 });
      if (response.code === 200) {
        setUsers(response.result.users);
        message.success('获取用户列表成功');
      }
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const newUser = {
        name: '新用户',
        email: 'newuser@example.com',
        role: 'user' as const,
      };
      const response = await userApi.createUser(newUser);
      if (response.code === 200) {
        message.success('创建用户成功');
        fetchUsers(); // 刷新列表
      }
    } catch (error) {
      message.error('创建用户失败');
      console.error('错误:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>用户管理示例</h1>
      <Space style={{ marginBottom: '16px' }}>
        <Button type="primary" onClick={fetchUsers} loading={loading}>
          刷新列表
        </Button>
        <Button onClick={handleCreateUser}>创建用户</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default Example;
