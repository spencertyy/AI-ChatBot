import { useState } from "react";
import { Model } from "../types/chat";
import { ChevronDown } from "lucide-react";

type ModelSelectorProps = {
  selectModel: Model;
  models: Model[];
  setSelectModel: (model: Model) => void;
  // 额外 class，方便在不同位置（如 header）套不同样式
  className?: string;
};

export default function ModelSelector({
  selectModel,
  models,
  setSelectModel,
  className = "",
}: ModelSelectorProps) {
  const [showModelMenu, setShowModelMenu] = useState(false);

  return (
    <div className={`model-selector ${className}`}>
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
        <ChevronDown size={16} strokeWidth={1.5} />
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
              <span className="model-label">{model.label}</span>
              {model.id === selectModel.id && (
                <span className="model-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
