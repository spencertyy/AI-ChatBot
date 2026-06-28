import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeBlock } from "./CodeBlock";

// ───────────── meta（默认导出，整个文件一个）─────────────
const meta = {
  // title：决定它在左侧边栏的位置，用 "/" 分层。这里会出现在 Components 分组下
  title: "Components/CodeBlock",
  // component：指向被展示的组件本体
  component: CodeBlock,
  // parameters.layout 'centered'：把组件居中显示（默认是 'padded' 贴左上角）
  parameters: { layout: "centered" },
  // tags: ['autodocs']：自动给这个组件生成一页文档（侧边栏会多一个 Docs 条目）
  tags: ["autodocs"],
  // argTypes：告诉 Storybook 每个 prop 用什么控件来调。language 用下拉，code 用多行文本
  argTypes: {
    language: {
      control: "select",
      options: [
        "javascript",
        "typescript",
        "python",
        "bash",
        "css",
        "json",
        "cobol",
      ],
    },
    code: { control: "text" },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;

// Story 类型：从 meta 推导，保证下面每个 story 的 args 类型和组件 props 对齐
type Story = StoryObj<typeof meta>;

// ───────────── 下面每个命名导出 = 一个 story ─────────────

// 正常情况：已知语言 JavaScript，有彩色 badge
export const JavaScript: Story = {
  args: {
    language: "javascript",
    code: `function greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("Storybook"));`,
  },
};

// 另一种已知语言，证明语言映射表生效
export const Python: Story = {
  args: {
    language: "python",
    code: `def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Storybook"))`,
  },
};

// 边界：传一个不在 langConfig 表里的语言 → 触发组件第 20 行的 ?? fallback
export const UnknownLanguage: Story = {
  args: {
    language: "cobol",
    code: `IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO.\nPROCEDURE DIVISION.\n    DISPLAY "Hello, World!".`,
  },
};

// 边界：超长代码，观察容器的滚动/溢出表现
export const LongCode: Story = {
  args: {
    language: "typescript",
    code: Array.from(
      { length: 40 },
      (_, i) =>
        `const line${i} = "this is a fairly long line of code number ${i} to test overflow";`,
    ).join("\n"),
  },
};
