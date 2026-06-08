import type { Conversation } from "../types/chat";

const STORAGE_KEY = "conversations";

// Save the conversation list to localStorage
export function saveConversations(conversations: Conversation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

// 从 localStorage 读取对话列表
export function loadConversations(): Conversation[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  const data = JSON.parse(raw);
  return data.map((conv: any) => ({
    ...conv,
    createdAt: new Date(conv.createdAt),
    updatedAt: new Date(conv.updatedAt),
    messages: conv.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    })),
  }));
}

//  localStorage Delete a conversation
export function deleteConversationFromStorage(convId: string): void {
  const conversations = loadConversations();
  const updated = conversations.filter((c) => c.id !== convId);
  saveConversations(updated);
}
