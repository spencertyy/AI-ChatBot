import type { Meta, StoryObj, Decorator } from "@storybook/nextjs-vite";
import { SessionProvider } from "next-auth/react";
import AuthButton from "./AuthButton";

// ───────── decorator：包裹每个 story，注入一个假的 SessionProvider ─────────
// 第二个参数 context 携带这个 story 的所有配置，我们从 context.parameters.session 取假数据
const withMockSession: Decorator = (Story, context) => (
  <SessionProvider
    session={context.parameters.session ?? null}
    // 关掉自动刷新，避免 Storybook 里去请求不存在的 /api/auth/session
    refetchInterval={0}
    refetchOnWindowFocus={false}
  >
    <Story />
  </SessionProvider>
);

const meta = {
  title: "Components/AuthButton",
  component: AuthButton,
  parameters: { layout: "centered" },
  decorators: [withMockSession], // ← 应用到本文件所有 story
  tags: ["autodocs"],
} satisfies Meta<typeof AuthButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 已登录：提供假 session → 组件走 if(session) 分支
export const SignedIn: Story = {
  parameters: {
    session: {
      user: {
        name: "Spencer Tu",
        email: "spencer@example.com",
        image: "https://i.pravatar.cc/64?img=12",
      },
      expires: "2099-01-01T00:00:00.000Z",
    },
  },
};

// 未登录：session 为 null → 组件走最后 return → 显示 Google 登录按钮
export const SignedOut: Story = {
  parameters: {
    session: null,
  },
};
