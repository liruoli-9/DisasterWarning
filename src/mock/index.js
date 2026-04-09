import Mock from 'mockjs';

const user = [
    {
        id: 1,
        username: 'admin',
        password: 'admin',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: '管理员'
    },
    {
        id: 2,
        username: 'test',
        password: 'test',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: '测试用户'
    }
]
// 模拟登录接口
Mock.mock('/api/login', 'post', (options) => {
    const { username, password } = JSON.parse(options.body)
    const checkUser = user.find(item => item.username === username && item.password === password)
    if (checkUser) {
        return {
            code: 200,
            message: '登录成功',
            data: {
                id: checkUser.id,
                username: checkUser.username,
                name: checkUser.name,
                avatar: checkUser.avatar,
                token: Mock.Random.guid()
            }
        }
    } else {
        return {
            code: 401,
            message: '用户名或密码错误'
        }
    }
})