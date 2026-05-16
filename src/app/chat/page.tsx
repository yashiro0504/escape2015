"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, MessageCircle, Newspaper, Landmark, ShieldAlert } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

type RoomId = 'mom' | 'boss' | 'friend' | 'secret' | 'system' | 'news' | 'bank' | 'rumor';

export default function ChatApp() {
  const { chatMessages, markChatAsRead } = useGameStore();
  const [activeRoom, setActiveRoom] = useState<RoomId | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRoom) {
      const hasUnread = chatMessages.some(m => m.room === activeRoom && !m.isRead);
      if (hasUnread) {
        markChatAsRead(activeRoom);
      }
    }
  }, [activeRoom, chatMessages, markChatAsRead]);

  useEffect(() => {
    if (activeRoom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeRoom]);

  const rooms = [
    { id: 'bank', name: '흙수저은행', icon: <Landmark size={20} className="text-yellow-600" /> },
    { id: 'news', name: '뉴스 속보', icon: <Newspaper size={20} className="text-blue-600" /> },
    { id: 'mom', name: '엄마', icon: <User size={20} className="text-pink-500" /> },
    { id: 'boss', name: '김팀장', icon: <User size={20} className="text-blue-500" /> },
    { id: 'friend', name: '동창 이재용', icon: <User size={20} className="text-emerald-500" /> },
    { id: 'secret', name: '비밀정보방', icon: <ShieldAlert size={20} className="text-purple-600" /> },
    { id: 'rumor', name: '내부자 정보', icon: <ShieldAlert size={20} className="text-amber-500" /> },
    { id: 'system', name: '알림톡', icon: <MessageCircle size={20} className="text-gray-500" /> }
  ] as const;

  if (!activeRoom) {
    return (
      <div className="w-full h-full bg-white flex flex-col relative text-black">
        {/* 까톡 헤더 */}
        <div className="bg-[#fee500] px-4 py-3 flex items-center z-10 sticky top-0 border-b border-black/10">
          <Link href="/" className="mr-3 active:scale-90 transition-transform">
            <ArrowLeft size={22} className="text-[#3c1e1e]" />
          </Link>
          <h1 className="text-base font-bold text-[#3c1e1e]">까톡</h1>
        </div>

        {/* 채팅방 리스트 */}
        <div className="flex-1 overflow-y-auto bg-white">
          {rooms.map((room, idx) => {
            const roomMsgs = chatMessages.filter(m => m.room === room.id);
            const unreadCount = roomMsgs.filter(m => !m.isRead).length;
            const lastMsg = roomMsgs[roomMsgs.length - 1];

            return (
              <div 
                key={room.id} 
                onClick={() => setActiveRoom(room.id)}
                className="flex items-center px-4 py-3 hover:bg-zinc-50 cursor-pointer transition-colors animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-[18px] bg-zinc-100 border border-black/5 flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
                  {room.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-[14px] text-black/80">{room.name}</span>
                  </div>
                  <p className="text-[12px] text-black/40 truncate">
                    {lastMsg ? lastMsg.text : '대화 내역이 없습니다.'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                    {unreadCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const activeRoomData = rooms.find(r => r.id === activeRoom);
  const currentMessages = chatMessages.filter(m => m.room === activeRoom);

  return (
    <div className="w-full h-full bg-[#9bbbd4] flex flex-col relative text-black">
      {/* 채팅방 내부 헤더 */}
      <div className="bg-[#9bbbd4] px-4 py-3 flex items-center z-10 sticky top-0 border-b border-black/10 backdrop-blur-md">
        <button onClick={() => setActiveRoom(null)} className="mr-3 active:scale-90 transition-transform">
          <ArrowLeft size={22} className="text-[#4a4a4a]" />
        </button>
        <h1 className="text-base font-bold text-[#4a4a4a]">{activeRoomData?.name}</h1>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3 pb-20">
        {currentMessages.length === 0 ? (
          <div className="text-center text-sm text-black/30 mt-10">메시지가 없습니다.</div>
        ) : (
          currentMessages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div className="flex items-start">
                <div className="w-9 h-9 rounded-[14px] bg-white border border-black/5 flex items-center justify-center mr-2 shadow-sm flex-shrink-0">
                  {activeRoomData?.icon}
                </div>
                <div className="flex flex-col max-w-[75%]">
                  <span className="text-[10px] text-black/40 mb-1 ml-1 font-bold flex items-center">
                    {msg.sender}
                    {msg.date && <span className="font-normal text-black/30 ml-1.5 text-[9px]">{msg.date}</span>}
                  </span>
                  <div className="bg-white px-3.5 py-2.5 rounded-2xl rounded-tl-sm shadow-sm text-[13px] break-words border border-black/5 leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* 가짜 입력창 */}
      <div className="absolute bottom-0 w-full bg-white p-3 border-t border-black/10 flex items-center shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mr-2">
          <span className="text-lg leading-none text-zinc-400">+</span>
        </div>
        <div className="flex-1 bg-zinc-100 h-10 rounded-full px-4 flex items-center text-[13px] text-zinc-400">
          메시지를 입력하세요...
        </div>
        <div className="w-10 h-10 ml-2 bg-[#fee500] rounded-full flex items-center justify-center text-[#3c1e1e] font-bold text-[11px] shadow-sm">
          전송
        </div>
      </div>
    </div>
  );
}
