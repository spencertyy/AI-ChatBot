import type { Conversation } from "../types/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
type SidebarProps = {
  conversations: Conversation[];
  activeConvId: string | null;
  setActiveConvId: (id: string) => void;
  handleNewChat: () => void;
  handleDeleteConv: (id: string) => void;
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
};
export default function Sidebar({
  conversations,
  activeConvId,
  handleNewChat,
  setActiveConvId,
  handleDeleteConv,
  input,
  setInput,
  handleSend,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button onClick={handleNewChat} className="newChat">
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>
      <button className="searchBar">
        <FontAwesomeIcon icon={faSearch} />
        <input
          className="search"
          type="text"
          placeholder="Search..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return; //解决输入法问题

            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
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
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
