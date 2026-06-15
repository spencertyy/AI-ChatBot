interface Message {
  id: string;
  role: "user" | "assistant";
  streaming?: boolean;
  content: string;
  timestamp: Date;
  inputTokens?: number;
  outputTokens?: number;
  model?: string;
}
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
interface Model {
  label: string;
  id: string;
  provider: string;
  icon: string;
}
export type { Message, Conversation, Model };
