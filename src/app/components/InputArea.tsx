import { useState } from "react";
import { Message, Model } from "../types/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { ChevronDown } from "lucide-react";
import { MetalFx } from "metal-fx";

type InputAreaProps = {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  handleStop: () => void;
  selectModel: Model;
  models: Model[];
  setSelectModel: (model: Model) => void;
};

export default function InputArea({
  input,
  setInput,
  handleSend,
  isLoading,
  handleStop,
  selectModel,
  models,
  setSelectModel,
}: InputAreaProps) {
  const [showModelMenu, setShowModelMenu] = useState(false);

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <div className="input-box">
          <input
            className="input"
            type="text"
            placeholder="How can I help you today?"
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
          <div className="input-footer">
            <button className="file-upload">
              <FontAwesomeIcon icon={faPaperclip} />
            </button>
            <button className="image-upload">
              <FontAwesomeIcon icon={faImage} />
            </button>
            <div className="model-selector">
              <button
                className="multi-model"
                onClick={() => setShowModelMenu(!showModelMenu)}
              >
                <img
                  src={selectModel.icon}
                  width={16}
                  height={16}
                  className="model-icon"
                />
                {selectModel.label}
                <ChevronDown size={18} strokeWidth={1} />
              </button>
              {showModelMenu && (
                <div className="model-menu">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      className="model-option"
                      onClick={() => {
                        setSelectModel(model);
                        setShowModelMenu(false);
                      }}
                    >
                      <img
                        src={model.icon}
                        width={16}
                        height={16}
                        className="model-icon"
                      />
                      <span className="moble-label">{model.label}</span>
                      {model.id === selectModel.id && (
                        <span className="model-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="send-btn-wrapper">
              <MetalFx preset="chromatic" variant="circle" strength={0.45}>
                {isLoading ? (
                  <button className="send-btn stop-btn" onClick={handleStop}>
                    ■
                  </button>
                ) : (
                  <button className="send-btn" onClick={() => handleSend()}>
                    ↑
                  </button>
                )}
              </MetalFx>
            </div>
          </div>
        </div>
        <p className="ai-disclaimer">
          AI may make mistakes, Please verify important information.
        </p>
      </div>
    </div>
  );
}
