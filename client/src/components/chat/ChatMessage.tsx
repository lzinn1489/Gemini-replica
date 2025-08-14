import type { Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs lg:max-w-2xl px-4 py-3 bg-primary text-white rounded-2xl rounded-br-md shadow-sm">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-xs lg:max-w-2xl">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{message.content}</p>
          {message.imageUrl && (
            <div className="mt-3">
              <img
                src={message.imageUrl}
                alt="AI Generated Image"
                className="rounded-lg shadow-sm max-w-full h-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
