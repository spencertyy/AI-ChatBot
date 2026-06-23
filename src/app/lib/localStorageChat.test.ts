import {
  saveConversations,
  loadConversations,
  deleteConversationFromStorage,
} from "./localStorageChat";
import { Conversation } from "../types/chat";

function makeConversation(id: string, title: string): Conversation {
  return {
    id,
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
describe("localStorageChat", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns [] when nothing is stored", () => {
    expect(loadConversations()).toEqual([]);
  });

  it("saves and loads conversations (round trip)", () => {
    const conversations = [makeConversation("1", "Conversation 1")];
    saveConversations(conversations);
    expect(loadConversations()).toEqual(conversations);
  });
});

it("deletes the right conversation", () => {
  saveConversations([
    makeConversation("1", "Conv 1"),
    makeConversation("2", "Conv 2"),
  ]);
  deleteConversationFromStorage("1");

  const remaining = loadConversations();
  expect(remaining).toHaveLength(1); // 只剩 1 条
  expect(remaining[0].id).toBe("2"); // 且留下的是 "2"
});
