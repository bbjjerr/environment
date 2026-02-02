# getTheReact API 文档（v1）

> **Base URL**: `/api/v1`  
> **认证方式**: JWT Bearer Token（请求头 `Authorization: Bearer <token>`）  
> **时间格式**: ISO8601 UTC  
> **分页参数**: `?page=1&limit=20`（默认值）

---

## 1. 认证模块 Auth

### 1.1 用户注册

- **POST** `/auth/register`
- **描述**: 创建新用户账号
- **请求体**:

```json
{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "password": "Passw0rd!"
}
```

- **响应** `201 Created`:

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alex Chen",
    "email": "alex@example.com",
    "avatarUrl": null,
    "status": "offline",
    "createdAt": "2026-01-29T08:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.2 用户登录

- **POST** `/auth/login`
- **描述**: 用户登录获取令牌
- **请求体**:

```json
{
  "email": "alex@example.com",
  "password": "Passw0rd!"
}
```

- **响应** `200 OK`:

```json
{
  "user": {
    "_id": "...",
    "name": "Alex Chen",
    "email": "...",
    "status": "online"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2..." //
}
```

### 1.3 刷新令牌

- **POST** `/auth/refresh`
- **请求体**: `{ "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2..." }`
- **响应** `200 OK`: `{ "token": "新的访问令牌" }`

### 1.4 退出登录

- **POST** `/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **响应** `204 No Content`

---

## 2. 用户模块 Users

### 2.1 获取当前用户

- **GET** `/users/me`
- **响应** `200 OK`:

```json
{
  "_id": "507f1f77bcf86cd799439011", //身份的唯一id
  "name": "Alex Chen", //名字
  "email": "alex@example.com", //邮箱
  "avatarUrl": "", //头像
  "title": "Frontend Developer", //职业
  "status": "online", //在线的状态
  "settings": {
    "muteNotifications": false, //消息是否免打扰
    "privacyBlocked": [] //这是隐私的黑名单
  }
}
```

### 2.2 更新当前用户

- **PATCH** `/users/me`
- **请求体**:

```json
{
  "name": "Alex Chen",
  "title": "Senior Developer",
  "settings": { "muteNotifications": true }
}
```

- **响应** `200 OK`: 返回更新后的用户对象

### 2.3 更新在线状态

- **PUT** `/users/me/status`
- **请求体**: `{ "status": "online" }` （可选值: `online`, `offline`, `away`）
- **响应** `200 OK`: `{ "status": "online" }`

### 2.4 搜索用户

- **GET** `/users?search=alex&page=1&limit=10`
- **响应** `200 OK`:

```json
{
  "data": [
    {
      "_id": "...",
      "name": "Alex Chen",
      "avatarUrl": "...",
      "status": "online"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 1 }
}
```

### 2.5 获取指定用户

- **GET** `/users/:userId`
- **响应** `200 OK`: 用户公开信息

---

## 3. 会话模块 Conversations

### 3.1 获取会话列表

- **GET** `/conversations?type=direct&page=1&limit=20`
- **参数**: `type` 可选值 `direct`（私聊）或 `group`（群聊）
- **响应** `200 OK`:

```json
{
  "data": [
    {
      "_id": "conv_001",
      "type": "direct",
      "participants": [
        {
          "_id": "user_001",
          "name": "Sarah Wilson",
          "avatarUrl": "...",
          "status": "online"
        }
      ],
      "lastMessage": {
        "_id": "msg_001",
        "body": "设计稿看起来很棒！🔥",
        "senderId": {
          "_id": "user_001",
          "name": "Sarah Wilson",
          "avatarUrl": "..."
        },
        "createdAt": "2026-01-29T10:30:00.000Z"
      },
      "unreadCount": 2,
      "isPinned": true,
      "updatedAt": "2026-01-29T10:30:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 3 }
}
```

### 3.2 创建会话

- **POST** `/conversations`
- **请求体**:

```json
{
  "participantIds": ["user_002", "user_003"],
  "type": "direct",
  "name": "Design Team Sync"
}
```

- **响应** `201 Created`: 返回新会话对象

### 3.3 获取会话详情

- **GET** `/conversations/:conversationId`
- **响应** `200 OK`: 完整会话信息（含成员详情）

### 3.4 更新会话

- **PATCH** `/conversations/:conversationId`
- **请求体**:

```json
{
  "name": "新群名",
  "isPinned": true,
  "isMuted": false
}
```

### 3.5 清空未读

- **POST** `/conversations/:conversationId/unread/reset`
- **响应** `200 OK`: `{ "unreadCount": 0 }`

### 3.6 删除会话

- **DELETE** `/conversations/:conversationId`
- **响应** `204 No Content`

---

## 4. 消息模块 Messages

### 4.1 获取消息列表

- **GET** `/messages/conversation/:conversationId?page=1&limit=50&before=2026-01-29T10:00:00Z`
- **参数**: `before` 用于加载更早的消息
- **响应** `200 OK`:

```json
{
  "data": [
    {
      "_id": "msg_001",
      "conversationId": "conv_001",
      "senderId": "user_001",
      "sender": { "name": "Sarah Wilson", "avatarUrl": "..." },
      "body": "Hi Sarah, 昨天发的 Dashboard UI 你看了吗?",
      "attachments": [],
      "richContent": null,
      "reactions": [{ "userId": "user_002", "emoji": "👍" }],
      "status": "read",
      "createdAt": "2026-01-29T10:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 50, "hasMore": true }
}
```

### 4.2 发送消息

- **POST** `/messages/conversation/:conversationId`
- **请求体**:

```json
{
  "body": "太好了！我也觉得 Indigo 那个色系很适合。",
  "attachments": ["asset_001"], //附件
  "richContent": {
    "type": "image", //类型
    "url": "https://example.com/image.png", //图片地址
    "meta": { "width": 800, "height": 600 } //图片信息
  }
}
```

- **响应** `201 Created`: 返回新消息对象

### 4.3 编辑消息

- **PATCH** `/messages/:messageId`
- **请求体**: `{ "body": "修改后的内容" }`
- **响应** `200 OK`

### 4.4 删除消息

- **DELETE** `/messages/:messageId`
- **响应** `204 No Content`

### 4.5 添加表情反应

- **POST** `/messages/:messageId/reactions`
- **请求体**: `{ "emoji": "🔥" }`
- **响应** `200 OK`

### 4.6 移除表情反应

- **DELETE** `/messages/:messageId/reactions/:emoji`
- **响应** `204 No Content`

### 4.7 更新消息状态

- **POST** `/messages/:messageId/status`
- **请求体**: `{ "status": "read" }` （可选值: `sent`, `delivered`, `read`）
- **响应** `200 OK`

---

## 5. 媒体模块 Media

### 5.1 上传文件

- **POST** `/uploads`
- **Content-Type**: `multipart/form-data`
- **请求体**: `file` 字段
- **响应** `201 Created`:

```json
{
  "assetId": "asset_001",
  "url": "https://cdn.example.com/uploads/xxx.png",
  "type": "image",
  "size": 102400
}
```

### 5.2 获取会话媒体列表

- **GET** `/conversations/:conversationId/media?type=image&page=1&limit=20`
- **参数**: `type` 可选值 `image`, `file`, `link`
- **响应** `200 OK`:

```json
{
  "data": [
    {
      "assetId": "asset_001",
      "type": "image",
      "url": "...",
      "createdAt": "..."
    }
  ],
  "counts": { "image": 128, "file": 43, "link": 205 }
}
```

### 5.3 下载文件

- **GET** `/media/:assetId/download`
- **响应**: 文件流或重定向到签名 URL

---

## 6. 通知模块 Notifications

### 6.1 获取通知列表

- **GET** `/notifications?isRead=false&page=1&limit=20`
- **响应** `200 OK`:

```json
{
  "data": [
    {
      "_id": "notif_001",
      "type": "new_message",
      "payload": { "conversationId": "conv_001", "senderId": "user_001" },
      "isRead": false,
      "createdAt": "2026-01-29T10:30:00.000Z"
    }
  ]
}
```

### 6.2 更新通知状态

- **PATCH** `/notifications/:notificationId`
- **请求体**: `{ "isRead": true }`
- **响应** `200 OK`

### 6.3 测试通知（仅开发环境）

- **POST** `/notifications/test`
- **响应** `201 Created`

---

## 7. WebSocket 实时事件

### 连接方式

```javascript
const socket = io("ws://localhost:4000", {
  auth: { token: "Bearer eyJhbGciOiJIUzI1NiIs..." },
});
```

### 事件列表

| 事件名                | 方向          | 数据格式                      | 说明                        |
| --------------------- | ------------- | ----------------------------- | --------------------------- |
| `presence:update`     | 服务端→客户端 | `{ userId, status }`          | 用户在线状态变化            |
| `message:new`         | 服务端→客户端 | `{ message, conversationId }` | 新消息推送                  |
| `message:status`      | 服务端→客户端 | `{ messageId, status }`       | 消息状态更新（已送达/已读） |
| `conversation:update` | 服务端→客户端 | `{ conversationId, changes }` | 会话信息变化                |
| `typing:start`        | 双向          | `{ conversationId, userId }`  | 用户开始输入                |
| `typing:stop`         | 双向          | `{ conversationId, userId }`  | 用户停止输入                |

---

## 8. 错误响应格式

```json
{
  "error": "ValidationError",
  "message": "请求参数不合法",
  "details": [{ "field": "email", "message": "邮箱格式不正确" }],
  "traceId": "abc123"
}
```

### 状态码说明

| 状态码 | 说明                       |
| ------ | -------------------------- |
| `200`  | 请求成功                   |
| `201`  | 创建成功                   |
| `204`  | 操作成功，无返回内容       |
| `400`  | 请求参数错误               |
| `401`  | 未授权（Token 无效或过期） |
| `403`  | 无权限访问该资源           |
| `404`  | 资源不存在                 |
| `409`  | 资源冲突（如邮箱已注册）   |
| `429`  | 请求过于频繁               |
| `500`  | 服务器内部错误             |

---

## 9. 健康检查

- **GET** `/api/health`
- **响应** `200 OK`:

```json
{
  "status": "ok",
  "timestamp": "2026-01-29T08:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 10. 数据模型参考

### User

```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "avatarUrl": "string",
  "title": "string",
  "status": "online | offline | away",
  "settings": {
    "muteNotifications": "boolean",
    "privacyBlocked": ["ObjectId"]
  },
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Conversation

```json
{
  "_id": "ObjectId",
  "type": "direct | group",
  "name": "string",
  "participants": ["ObjectId"],
  "lastMessage": "ObjectId",
  "unreadCount": { "userId": "number" },
  "pinnedBy": ["ObjectId"],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Message

```json
{
  "_id": "ObjectId",
  "conversationId": "ObjectId",
  "senderId": "ObjectId",
  "body": "string",
  "attachments": ["ObjectId"],
  "richContent": { "type": "image|file|link", "url": "string", "meta": {} },
  "reactions": [{ "userId": "ObjectId", "emoji": "string" }],
  "status": "sent | delivered | read",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### MediaAsset

```json
{
  "_id": "ObjectId",
  "uploaderId": "ObjectId",
  "conversationId": "ObjectId",
  "type": "image | file | link",
  "url": "string",
  "size": "number",
  "meta": {},
  "createdAt": "ISO8601"
}
```

### Notification

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "type": "string",
  "payload": {},
  "isRead": "boolean",
  "createdAt": "ISO8601"
}
```

---

> 📝 本文档可导入 Swagger/OpenAPI 或 Postman 进一步完善。如有问题请联系后端开发。
