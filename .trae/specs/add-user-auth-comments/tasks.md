# Tasks

- [x] Task 1: 搭建后端服务器基础框架
  - [x] 初始化 Node.js 项目（`backend/` 目录），安装 Express、better-sqlite3、bcryptjs、jsonwebtoken、cors
  - [x] 创建 SQLite 数据库初始化脚本（users 表、comments 表、diagnostic_results 表）
  - [x] 创建 Express 服务器入口文件，配置 CORS、JSON 解析中间件

- [x] Task 2: 实现用户注册 API
  - [x] 创建 `POST /api/auth/register` 接口
  - [x] 参数校验：邮箱格式、密码长度（≥6位）、邮箱唯一性
  - [x] 密码 bcrypt 加密存储
  - [x] 注册成功后自动返回 JWT 令牌

- [x] Task 3: 实现用户登录 API
  - [x] 创建 `POST /api/auth/login` 接口
  - [x] 验证邮箱和密码
  - [x] 返回 JWT 令牌（有效期 7 天）
  - [x] 创建 `GET /api/auth/me` 接口，通过 JWT 获取当前用户信息

- [x] Task 4: 实现评论 CRUD API
  - [x] 创建 `POST /api/comments` 发表评论（需 JWT 认证）
  - [x] 创建 `GET /api/comments` 获取评论列表（分页，每页 20 条，按时间倒序，无需登录即可查看）
  - [x] 创建 `DELETE /api/comments/:id` 删除评论（仅限作者本人）

- [x] Task 5: 实现诊断结果保存 API
  - [x] 创建 `POST /api/diagnostic` 保存诊断结果（需 JWT 认证）
  - [x] 创建 `GET /api/diagnostic/history` 获取用户历史诊断记录

- [x] Task 6: 使用 web-artifacts-builder 技能初始化前端 React 项目
  - [x] 运行初始化脚本创建 React + TypeScript + Tailwind + shadcn/ui 项目
  - [x] 将现有样式主题（CSS 变量、配色方案）迁移到 Tailwind 配置

- [x] Task 7: 将现有页面迁移到 React 组件
  - [x] Tab 导航组件（App.tsx）
  - [x] 诊断测试 Tab 组件（18题测试、六维图谱、球员类型结果）
  - [x] 进阶指南 Tab 组件（自测、新手画像、瓶颈分析、进阶路径）
  - [x] 训练教程 Tab 组件（心态、意识、战术、姿势、三周清单）
  - [x] AI 建议 Tab 组件（DeepSeek API 对话）

- [x] Task 8: 实现前端用户认证 UI 和状态管理
  - [x] 创建 AuthContext（React Context）管理登录状态、JWT 令牌
  - [x] 创建登录/注册弹窗组件（Dialog from shadcn/ui）
  - [x] 更新顶部导航栏：未登录显示"登录/注册"按钮，已登录显示用户名和"退出"按钮
  - [x] 实现 JWT 自动恢复（页面刷新时从 localStorage 读取令牌并验证）

- [x] Task 9: 实现前端评论 UI
  - [x] 创建评论列表组件（显示用户名、时间、内容）
  - [x] 创建评论输入组件（文本框 + 提交按钮）
  - [x] 实现"加载更多"分页按钮
  - [x] 实现自己的评论显示删除按钮

- [x] Task 10: 前后端联调与诊断结果持久化
  - [x] 前端 API 服务层（封装 fetch 调用，解包 {success,data} 格式）
  - [x] 已登录用户测试完成后自动保存诊断结果到服务器
  - [x] 未登录用户仍可使用测试功能（结果存 localStorage）

- [x] Task 11: 验证测试
  - [x] 代码审查：API 字段对齐、组件集成、状态管理正确
  - [ ] 启动后端服务器，测试所有 API 接口（需本地 Node.js 环境）
  - [ ] 启动前端开发服务器，测试完整流程（需本地 Node.js 环境）

# Task Dependencies
- Task 2、3、4、5 依赖于 Task 1（后端基础框架）
- Task 6 可并行于 Task 1-5（前端初始化不依赖后端）
- Task 7 依赖于 Task 6（前端页面在 React 项目上构建）
- Task 8 依赖于 Task 6 和 Task 3（前端认证需要后端登录 API）
- Task 9 依赖于 Task 6 和 Task 4（前端评论需要后端评论 API）
- Task 10 依赖于 Task 5、7、8（联调需要前后端都就绪）
- Task 11 依赖于所有前面的 Task