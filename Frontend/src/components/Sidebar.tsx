import React from 'react';

export default function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-[280px] h-full bg-black/20 backdrop-blur-xl border-r border-white/5 p-4 z-20">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-purple-500/20"></div>
         <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            WeirdChats
         </h1>
      </div>

      <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 mb-6 group">
        <span className="text-xl leading-none group-hover:rotate-90 transition-transform duration-300">+</span>
        <span>New Chat</span>
      </button>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
        <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Today</h3>
            <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all group text-left">
                    <div className="text-gray-400 group-hover:text-indigo-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white truncate">Project Discussion</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all group text-left">
                     <div className="text-gray-400 group-hover:text-indigo-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white truncate">Weekend Plans</span>
                </button>
            </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-white/5">
         <button className="flex items-center gap-3 px-3 py-3 w-full rounded-xl hover:bg-white/5 transition-colors text-white text-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs">AD</div>
            <div className="flex flex-col items-start">
               <span className="font-medium">Adarsh Agnihotri</span>
               <span className="text-xs text-gray-500">Pro Member</span>
            </div>
         </button>
      </div>
    </div>
  );
}
