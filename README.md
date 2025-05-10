# 机器人远见家 (Robot Visionary)

这是一个机器人能力评估平台，用于评估机器人的感知、行为和因果性等方面的能力。

## 功能特点

- 从预设图片库随机选择3个机器人进行评估
- 使用滑块来对不同方面的能力进行评分
- 生成综合评分和详细评估报告
- 导出评估数据为CSV格式，方便后续分析

## 如何使用

1. 将需要评估的机器人图片放入 `/public/robot-images` 目录
2. 在 `src/config/robots.ts` 文件中更新机器人图片配置
3. 运行应用程序
4. 按照界面指引对随机选择的机器人进行评估
5. 完成评估后，下载CSV评估数据

## 开发说明

### 安装依赖
```
npm install
```

### 开发环境运行
```
npm run dev
```

### 构建生产版本
```
npm run build
```

### 部署说明

可以使用以下方式部署：

1. 使用GitHub Pages
2. 使用Firebase Hosting
3. 使用Vercel或Netlify等静态网站托管服务

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Radix UI 组件库
