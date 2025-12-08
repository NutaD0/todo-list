import { Cookie } from "lucide-react";

interface CookiesPanelProps {
  onAccept: () => void;
  onReject: () => void;
  isVisible: boolean;
}

export default function CookiesPanel({
  onAccept,
  onReject,
  isVisible,
}: CookiesPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg p-4 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-2xl mx-auto flex items-center gap-4">
        <Cookie className="w-6 h-6 text-gray-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            Мы используем файлы cookie для улучшения работы сайта и анализа
            трафика. Продолжая использовать сайт, вы соглашаетесь с нашей
            политикой использования cookie.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onReject}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Отклонить
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-neutral-800 transition-colors duration-200"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
