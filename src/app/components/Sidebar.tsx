import type { Conversation } from "../types/chat";

type SidebarProps = {
  conversations: Conversation[];
  activeConvId: string | null;
  setActiveConvId: (id: string) => void;
  handleNewChat: () => void;
  handleDeleteConv: (id: string) => void;
};
export default function Sidebar({
  conversations,
  activeConvId,
  handleNewChat,
  setActiveConvId,
  handleDeleteConv,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <button onClick={handleNewChat} className="newChat">
        * New Chat
      </button>
      <div className="conv-list">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`conv-item ${conv.id === activeConvId ? "active" : ""}`}
            onClick={() => setActiveConvId(conv.id)}
          >
            <span className="conv-title">{conv.title}</span>
            <button
              className="conv-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteConv(conv.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
