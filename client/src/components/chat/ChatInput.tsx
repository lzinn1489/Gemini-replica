import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showRateLimit, setShowRateLimit] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSentTime = useRef(0);
  const RATE_LIMIT_DELAY = 3000; // 3 seconds

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSend = () => {
    const content = message.trim();
    if (!content || disabled) return;

    // Rate limiting check
    const now = Date.now();
    if (now - lastSentTime.current < RATE_LIMIT_DELAY) {
      setShowRateLimit(true);
      setTimeout(() => setShowRateLimit(false), 3000);
      return;
    }

    lastSentTime.current = now;
    onSendMessage(content);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="resize-none rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-primary min-h-[44px]"
            rows={1}
            disabled={disabled}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            size="sm"
            className="absolute right-2 top-2 p-2 h-8 w-8"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {showRateLimit && (
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Aguarde antes de enviar outra mensagem</span>
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Catalyst IA pode cometer erros. Considere verificar informações importantes.
        </p>
      </div>
    </div>
  );
}
