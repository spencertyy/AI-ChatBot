import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    // ↓ 让 Storybook 画布背景用你的深色主题，否则默认白底，组件看不清
    backgrounds: {
      default: "app-dark",
      values: [{ name: "app-dark", value: "#0a0a0f" }],
    },
  },
};

export default preview;
