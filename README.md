# React Playground

React Playground 是一个交互式环境，用户可以实时编写、编译和预览 React 代码。本项目允许用户在 Monaco Editor 中编写 JSX 代码，并实时查看预览，支持代码格式化和语法高亮等功能。

## 功能特性

- **实时代码预览**：编写 React JSX 代码并立即查看渲染结果。
- **语法高亮**：使用 Monaco Editor 提供增强的代码编辑体验。
- **自动格式化**：支持快捷键自动格式化代码（例如 `Ctrl/Cmd + J`）。
- **代码隔离**：代码在安全的沙箱环境中运行，避免污染主页面。
- **模块支持**：通过 `import maps` 支持从 CDN 加载 React 和 ReactDOM 模块。

## 快速开始

### 前置要求

- 已安装 [Node.js](https://nodejs.org/)
- 使用 [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/) 包管理器

### 安装步骤

1. 克隆此仓库：

   ```bash
   git clone https://github.com/your-username/react-playground.git
   cd react-playground
  ```
  
2. 安装依赖：

   ```bash
   npm install
  ```

### 项目结构

项目的基本文件结构如下：

react-playground/
- public/
- src/
  - components/
    - Editor.tsx        # Monaco 编辑器组件
    - Header.tsx        # 头部组件
    - Playground.tsx    # Playground 组件
    - Preview.tsx       # 预览组件
  - App.tsx             # 应用主入口
  - index.tsx           # 渲染 App 组件
- README.md
- package.json
- tsconfig.json



### 实现原理

1. **代码转译**：使用 @babel/standalone 将用户编写的 React JSX 代码实时转译为浏览器可执行的 JavaScript。
2. **动态代码预览**：通过 Blob 和 URL.createObjectURL 将转译后的 JavaScript 代码生成一个临时的 URL，使其在浏览器中作为独立的可执行文件进行加载和运行。
3. **实时隔离渲染**：使用 iframe 作为沙箱环境，在其中加载并渲染转译后的代码，确保代码执行与主页面隔离，并实现实时更新。
4. **动态模块加载**：利用 esm.sh CDN 服务，按需加载第三方库（如 React 和 ReactDOM），无需在本地安装依赖，提升加载速度和灵活性。