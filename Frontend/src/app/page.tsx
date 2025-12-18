'use client';

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MessageBubble from '@/components/MessageBubble';
import InputArea from '@/components/InputArea';
import { useSocket } from '@/hooks/useSocket';

interface Message {
  id: string;
  content: string;
  sender: 'user1' | 'user2';  // user1 = me, user2 = them
}

export default function Home() {
  const { isConnected, myUserId, messages: socketMessages, registerUser, sendMessage, connectionError } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showRegistration, setShowRegistration] = useState(true);
  const [userIdInput, setUserIdInput] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Convert socket messages to display format
  useEffect(() => {
    const convertedMessages: Message[] = socketMessages.map(msg => ({
      id: msg.id,
      content: msg.text,
      // If I sent it, it's user1 (me), otherwise it's user2 (them)
      sender: msg.senderId === myUserId ? 'user1' : 'user2',
    }));
    setMessages(convertedMessages);
  }, [socketMessages, myUserId]);

  const handleRegister = () => {
    if (userIdInput.trim() && targetUserId.trim()) {
      registerUser(userIdInput.trim());
      setShowRegistration(false);
    }
  };

  const handleSendMessage = (content: string) => {
    if (targetUserId.trim() && myUserId) {
      sendMessage(targetUserId.trim(), content);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-transparent selection:bg-indigo-500/30 selection:text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-full">
        {/* Connection Status Bar */}
        <div className={`absolute top-0 left-0 w-full z-20 p-2 text-center text-xs font-medium ${isConnected ? 'bg-emerald-600' : 'bg-red-600'} text-white shadow-lg`}>
          {isConnected ? (
            <span>✓ Connected{myUserId ? ` as ${myUserId}` : ''} {targetUserId && `• Chatting with ${targetUserId}`}</span>
          ) : (
            <span>✗ Disconnected {connectionError && `- ${connectionError}`}</span>
          )}
        </div>

        {/* Registration Modal */}
        {showRegistration && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-gray-900/95 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl">💬</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">WeirdChats</h2>
                  <p className="text-sm text-gray-400">Start a private conversation</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your User ID</label>
                  <input
                    type="text"
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && document.getElementById('targetInput')?.focus()}
                    placeholder="e.g., alice"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chat with</label>
                  <input
                    id="targetInput"
                    type="text"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    placeholder="e.g., bob"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                <button
                  onClick={handleRegister}
                  disabled={!userIdInput.trim() || !targetUserId.trim()}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Chatting
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-6">
                Make sure your friend also opens this page and uses your ID to chat with you
              </p>
            </div>
          </div>
        )}

        {/* Background Glow Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent z-10 px-4 md:px-8 pt-16 pb-32">
           <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/5">
                         <span className="text-4xl">💬</span>
                      </div>
                      <h2 className="text-2xl font-semibold text-white">No messages yet</h2>
                      <p className="text-sm text-gray-400 max-w-sm">
                        {myUserId && targetUserId 
                          ? `Start the conversation with ${targetUserId}!`
                          : 'Register to start chatting'
                        }
                      </p>
                  </div>
              ) : (
                  <>
                    <div className="flex justify-center my-4">
                        <span className="bg-white/5 text-gray-400 text-[10px] px-4 py-1.5 rounded-full uppercase tracking-wider font-semibold backdrop-blur-xl border border-white/5">Today</span>
                    </div>

                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} content={msg.content} sender={msg.sender} />
                    ))}
                  </>
              )}
              <div ref={messagesEndRef} className="h-4" />
           </div>
        </div>

        {/* Input Area - NO TOGGLE, just send as yourself */}
        <InputArea 
            onSend={handleSendMessage} 
            disabled={!myUserId || !targetUserId}
            placeholder={myUserId ? `Message ${targetUserId}...` : 'Register to chat...'}
        />
      </main>
    </div>
  );
}
