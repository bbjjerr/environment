# getTheReact 后端服务

Node.js + Express + MongoDB 的聊天应用 API 服务。

## 功能特性

- ✅ 用户认证（注册、登录、JWT Token）
- ✅ 用户管理（个人信息、在线状态、搜索）
- ✅ 会话管理（创建、列表、置顶、未读计数）
- ✅ 消息功能（发送、编辑、删除、表情反应）
- ✅ 文件上传（图片、文档）
- ✅ 通知系统

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/getTheReact
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 3. 启动 MongoDB

确保本地 MongoDB 服务正在运行，或使用 MongoDB Atlas。

### 4. 初始化测试数据（可选）

```bash
npm run seed
```

这将创建测试用户和示例对话：

- alex@example.com / 123456
- sarah@example.com / 123456
- michael@example.com / 123456

### 5. 启动服务

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm start
```

服务启动后访问 `http://localhost:4000/api/health` 检查状态。

## 目录结构

```
server/
├── .env                 # 环境变量
├── .env.example         # 环境变量示例
├── package.json
├── README.md
├── docs/
│   └── api.md           # API 文档
├── uploads/             # 上传文件目录
└── src/
    ├── app.js           # Express 应用
    ├── server.js        # 启动入口
    ├── seed.js          # 种子数据脚本
    ├── config/
    │   └── db.js        # 数据库连接
    ├── controllers/     # 控制器
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── conversation.controller.js
    │   ├── message.controller.js
    │   ├── media.controller.js
    │   └── notification.controller.js
    ├── middleware/
    │   ├── auth.js      # JWT 认证中间件
    │   └── errorHandler.js
    ├── models/          # Mongoose 模型
    │   ├── User.js
    │   ├── Conversation.js
    │   ├── Message.js
    │   ├── MediaAsset.js
    │   └── Notification.js
    ├── routes/          # 路由
    │   ├── index.js
    │   ├── auth.route.js
    │   ├── user.route.js
    │   ├── conversation.route.js
    │   ├── message.route.js
    │   ├── media.route.js
    │   └── notification.route.js
    └── utils/
        └── asyncHandler.js
```

## API 端点概览

| 模块 | 端点                                     | 描述         |
| ---- | ---------------------------------------- | ------------ |
| 认证 | `POST /api/v1/auth/register`             | 用户注册     |
| 认证 | `POST /api/v1/auth/login`                | 用户登录     |
| 认证 | `POST /api/v1/auth/refresh`              | 刷新令牌     |
| 用户 | `GET /api/v1/users/me`                   | 获取当前用户 |
| 用户 | `PATCH /api/v1/users/me`                 | 更新用户信息 |
| 会话 | `GET /api/v1/conversations`              | 会话列表     |
| 会话 | `POST /api/v1/conversations`             | 创建会话     |
| 消息 | `GET /api/v1/messages/conversation/:id`  | 消息列表     |
| 消息 | `POST /api/v1/messages/conversation/:id` | 发送消息     |
| 媒体 | `POST /api/v1/uploads`                   | 上传文件     |
| 通知 | `GET /api/v1/notifications`              | 通知列表     |

完整 API 文档请查看 [docs/api.md](docs/api.md)

## 开发说明

### 测试 API

使用 curl 测试登录：

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"123456"}'
```

### 认证请求

登录后获取 token，后续请求在 Header 中携带：

```
Authorization: Bearer <your_token>
```

## 技术栈

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **File Upload**: multer
- **Validation**: express-validator
