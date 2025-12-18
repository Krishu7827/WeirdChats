import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function InputArea({ onSend, disabled = false, placeholder = 'Type a message...' }: InputAreaProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="absolute bottom-6 left-0 w-full px-4 md:px-0 z-20">
       <div className="max-w-3xl mx-auto">
         {/* Floating Glass Container */}
         <div className="relative flex flex-col gap-2 p-2 rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-500/10 ring-1 ring-white/5">
            
            {/* Input Field */}
            <div className="flex items-end gap-2 px-2">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="w-full bg-transparent text-white border-0 focus:ring-0 p-3 max-h-[150px] resize-none placeholder-gray-500 leading-relaxed scrollbar-hide text-base font-light disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || disabled}
                  className={`mb-1 p-2.5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0
                    ${input.trim() && !disabled
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 hover:bg-indigo-700' 
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current transform rotate-90">
                    <path d="M12 2L2 22L12 18L22 22L12 2Z" stroke="none" />
                  </svg>
                </button>
            </div>

            {/* Bottom Tools */}
            <div className="flex justify-between items-center px-3 pt-2 border-t border-white/5">
                 <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-300 transition-colors" title="Attach file">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-300 transition-colors" title="Add image">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </button>
                 </div>

                 <span className="text-xs text-gray-600">Press Enter to send</span>
            </div>
         </div>
       </div>
    </div>
  );
}
