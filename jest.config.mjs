import nextJest from "next/jest.js";

// 指向 app 根目录，让 next/jest 加载 next.config、.env、TS 路径别名
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  // 每个测试文件跑之前，先加载 jest-dom 的断言
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // 用 jsdom 假装有浏览器 DOM（组件测试必需）
  testEnvironment: "jest-environment-jsdom",
};

export default createJestConfig(config);
