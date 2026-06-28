import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MarkdownRenderer } from './MarkDownRenderer';

const meta = {
  title: 'Components/MarkdownRenderer',
  component: MarkdownRenderer,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
  },
} satisfies Meta<typeof MarkdownRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

// 综合文档：标题、加粗、列表、行内代码、引用 —— 覆盖最常见的 markdown 元素
export const RichDocument: Story = {
  args: {
    content: `# Streaming Chat

This response uses **GitHub-Flavored Markdown**. You can mix _inline_ formatting,
\`inline code\`, and structured content.

## Key features
- Token-by-token SSE streaming
- Message branching & regenerate
- Syntax-highlighted code blocks

> AI may make mistakes. Verify important information.`,
  },
};

// GFM 表格：覆盖组件里 table 的自定义渲染（markdown-table 样式，依赖 remark-gfm）
export const WithTable: Story = {
  args: {
    content: `## Model comparison

| Model | Provider | Speed |
| --- | --- | --- |
| gemini-2.5-flash | Google | Fast |
| gpt-4o-mini | OpenAI | Fast |`,
  },
};

// 代码块：fenced code 会被路由进 CodeBlock 组件（组件里 code 自定义渲染那条分支）
export const WithCodeBlock: Story = {
  args: {
    content: `Here is how to read an SSE stream on the client:

\`\`\`typescript
const reader = response.body.getReader();
const decoder = new TextDecoder();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));
}
\`\`\``,
  },
};
