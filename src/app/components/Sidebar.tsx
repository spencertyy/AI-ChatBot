import type { Conversation } from "../types/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { PanelsTopLeft } from "lucide-react";
import AuthButton from "./AuthButton";
import { Dot } from "lucide-react";
import { X, Pencil, Check } from "lucide-react";
type SidebarProps = {
  conversations: Conversation[];
  activeConvId: string | null;
  setActiveConvId: (id: string) => void;
  handleNewChat: () => void;
  handleDeleteConv: (id: string) => void;
  isSidebarOpen: boolean;
  onToggle: () => void;
  handleRenameConv: (convId: string, newTitle: string) => void;
};
export default function Sidebar({
  conversations,
  activeConvId,
  handleNewChat,
  setActiveConvId,
  handleDeleteConv,
  isSidebarOpen,
  onToggle,
  handleRenameConv,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  function startEditing(conv: Conversation) {
    setEditingConvId(conv.id);
    setEditingTitle(conv.title);
  }
  function cancelEditing() {
    setEditingConvId(null);
    setEditingTitle("");
  }
  function saveTitle(newTitle: string) {
    if (!editingConvId) return;
    handleRenameConv(editingConvId, newTitle);
    cancelEditing();
  }
  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <aside className={isSidebarOpen ? "sidebar" : "sidebar sidebar-closed"}>
      <div className="sidebar-header">
        <button onClick={onToggle} className="panel-btn">
          <PanelsTopLeft size={16} strokeWidth={1.5} />
        </button>
        {isSidebarOpen && (
          <button onClick={handleNewChat} className="newChat">
            <FontAwesomeIcon icon={faEdit} />
          </button>
        )}
      </div>
      <button className="searchBar">
        <FontAwesomeIcon icon={faSearch} />
        <input
          className="search"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </button>
      <div className="conv-list">
        <p className="conv-section-label">RECENT </p>
        {filteredConversations.map((conv) => (
          <div
            key={conv.id}
            className={`conv-item ${conv.id === activeConvId ? "active" : ""}`}
            onClick={() => setActiveConvId(conv.id)}
          >
            {editingConvId === conv.id ? (
              // 编辑状态：input + 保存 + 取消
              <>
                <input
                  className="conv-title-input"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTitle(editingTitle);
                    if (e.key === "Escape") cancelEditing();
                  }}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
                <button
                  className="conv-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveTitle(editingTitle);
                  }}
                >
                  <Check size={15} />
                </button>
                <button
                  className="conv-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelEditing();
                  }}
                >
                  <X size={15} />
                </button>
              </>
            ) : (
              // 正常状态：标题 + 编辑 + 删除
              <>
                <span className="conv-title">{conv.title}</span>
                <button
                  className="conv-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(conv);
                  }}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="conv-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConv(conv.id);
                  }}
                >
                  <X size={15} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="auth-area">
        <AuthButton />
      </div>
    </aside>
  );
}
