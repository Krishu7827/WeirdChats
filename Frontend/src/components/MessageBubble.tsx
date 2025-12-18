import React from 'react';

interface MessageBubbleProps {
  content: string;
  sender: 'user1' | 'user2';
}

export default function MessageBubble({ content, sender }: MessageBubbleProps) {
  const isUser1 = sender === 'user1'; // "Me" (Right side)
  
  return (
    <div className={`flex w-full ${isUser1 ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] md:max-w-[70%] flex gap-3 ${isUser1 ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className="flex-shrink-0 self-end mb-1">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg
             ${isUser1 
                ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 ring-2 ring-indigo-500/20' 
                : 'bg-gradient-to-tr from-emerald-500 to-teal-600 ring-2 ring-emerald-500/20'}`}>
             {isUser1 ? 'Me' : 'Us'}
           </div>
        </div>

        {/* Bubble */}
        <div className={`relative px-5 py-3.5 shadow-lg
            ${isUser1 
                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm bg-gradient-to-br from-indigo-600 to-indigo-700' 
                : 'bg-[#1f2937] text-gray-100 rounded-2xl rounded-tl-sm border border-white/5'
            }`}>
          <div className="prose prose-invert prose-p:leading-relaxed prose-p:my-0 break-words text-[15px]">
            {content}
          </div>
          
          {/* Timestamp (fake) */}
          <div className={`text-[10px] mt-1 opacity-50 ${isUser1 ? 'text-right' : 'text-left'}`}>
             Just now
          </div>
        </div>

      </div>
    </div>
  );
}
