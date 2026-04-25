"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function ChatApp() {
  const { chatMessages, markChatAsRead } = useGameStore();

  useEffect(() => {
    // 채팅방에 들어오면 모두 읽음 처리
    markChatAsRead();
  }, [markChatAsRead]);

  return (
    <div className="w-full h-full bg-[#b2c7d9] flex flex-col relative text-black">
      {/* 까톡 헤더 */}
      <div className="bg-[#b2c7d9] px-4 py-3 flex items-center z-10 sticky top-0 border-b border-black/10">
        <Link href="/" className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={24} className="text-[#4a4a4a]" />
        </Link>
        <h1 className="text-lg font-bold text-[#4a4a4a]">채팅방</h1>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 pb-20">
        {chatMessages.length === 0 ? (
          <div className="text-center text-sm text-black/50 mt-10">메시지가 없습니다.</div>
        ) : (
          chatMessages.map((msg, idx) => (
            <div key={msg.id} className="flex flex-col animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start">
                <div className="w-9 h-9 rounded-[14px] bg-white border border-black/10 flex items-center justify-center mr-2 shadow-sm overflow-hidden">
                  <User size={20} className="text-black/30" />
                </div>
                <div className="flex flex-col max-w-[75%]">
                  <span className="text-xs text-black/60 mb-1 ml-1">{msg.sender}</span>
                  <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-none shadow-sm text-sm break-words border border-black/5 leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 가짜 입력창 */}
      <div className="absolute bottom-0 w-full bg-white p-3 border-t border-black/10 flex items-center">
        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mr-2">
          <span className="text-xl leading-none">+</span>
        </div>
        <div className="flex-1 bg-zinc-100 h-10 rounded-full px-4 flex items-center text-sm text-zinc-400">
          메시지를 입력하세요...
        </div>
        <div className="w-10 h-10 ml-2 bg-[#fee500] rounded-full flex items-center justify-center text-black font-bold text-xs shadow-sm">
          전송
        </div>
      </div>
    </div>
  );
}
