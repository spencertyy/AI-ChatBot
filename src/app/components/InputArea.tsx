type InputAreaProps = {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  handleStop: () => void;
};

export default function InputArea({
  input,
  setInput,
  handleSend,
  isLoading,
  handleStop,
}: InputAreaProps) {
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
          {isLoading ? (
            <button className="send-btn stop-btn" onClick={handleStop}>
              ■
            </button>
          ) : (
            <button className="send-btn" onClick={() => handleSend()}>
              ↑
            </button>
          )}
        </div>
        <p className="ai-disclaimer">
          AI may make mistakes, Please verify important information.
        </p>
      </div>
    </div>
  );
}
