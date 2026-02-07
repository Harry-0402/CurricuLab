"use client"

import React, { useEffect, useState, useRef } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TelegramChatInterfaceProps {
    onLogout: () => void;
}

interface Chat {
    id: string;
    title: string;
    message: string;
    unreadCount: number;
    date: number;
    isGroup: boolean;
}

interface Message {
    id: number;
    text: string;
    senderId: string;
    isOut: boolean;
    date: number;
    media: boolean;
}

export function TelegramChatInterface({ onLogout }: TelegramChatInterfaceProps) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Group Creation State
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupUsers, setNewGroupUsers] = useState(''); // Comma separated for MVP

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadChats = async () => {
        try {
            const res = await fetch('/api/community/telegram/chat', {
                method: 'POST',
                body: JSON.stringify({ action: 'dialogs' }),
            });
            const data = await res.json();
            if (data.success) {
                setChats(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingChats(false);
        }
    };

    const loadMessages = async (chatId: string) => {
        setIsLoadingMessages(true);
        setActiveChatId(chatId);
        try {
            const res = await fetch('/api/community/telegram/chat', {
                method: 'POST',
                body: JSON.stringify({ action: 'history', chatId }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages(data.data.reverse()); // GramJS returns newest first
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeChatId) return;

        const tempId = Date.now();
        const tempMsg: Message = {
            id: tempId,
            text: newMessage,
            senderId: 'me',
            isOut: true,
            date: Math.floor(Date.now() / 1000),
            media: false
        };

        setMessages(prev => [...prev, tempMsg]);
        setNewMessage('');

        try {
            await fetch('/api/community/telegram/chat', {
                method: 'POST',
                body: JSON.stringify({ action: 'send', chatId: activeChatId, text: tempMsg.text }),
            });
            // Ideally poll/refresh here to replace temp ID with real one
        } catch (err) {
            console.error("Failed to send", err);
            // Show error state on message
        }
    };

    const handleCreateGroup = async () => {
        if (!newGroupName.trim() || !newGroupUsers.trim()) return;

        try {
            const users = newGroupUsers.split(',').map(u => u.trim());
            await fetch('/api/community/telegram/chat', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'create_group',
                    title: newGroupName,
                    users: users
                }),
            });
            setIsCreateGroupOpen(false);
            setNewGroupName('');
            setNewGroupUsers('');
            loadChats(); // Refresh list
            alert("Group created!");
        } catch (err) {
            alert("Failed to create group. Ensure usernames are valid.");
        }
    };

    useEffect(() => {
        loadChats();
        // Polling loop for chat list updates every 10s
        const interval = setInterval(loadChats, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeChatId) {
            // Polling loop for active chat messages every 3s
            const interval = setInterval(() => {
                // Background update without loading spinner
                fetch('/api/community/telegram/chat', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'history', chatId: activeChatId }),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) setMessages(data.data.reverse());
                    });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [activeChatId]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    return (
        <div className="flex h-full">
            {/* Sidebar (Chat List) */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-gray-700 uppercase tracking-wide text-xs">Active Chats</h2>
                    <button
                        onClick={() => setIsCreateGroupOpen(true)}
                        className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-blue-600 transition-colors" title="Create Group"
                    >
                        <Icons.Plus size={16} />
                    </button>
                </div>

                {/* Create Group Form (Inline) */}
                {isCreateGroupOpen && (
                    <div className="p-4 bg-white border-b border-blue-100 animate-in slide-in-from-top-2">
                        <input
                            className="w-full mb-2 px-3 py-2 text-sm border rounded-lg"
                            placeholder="Group Name"
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                        />
                        <input
                            className="w-full mb-2 px-3 py-2 text-sm border rounded-lg"
                            placeholder="Usernames (comma separated)"
                            value={newGroupUsers}
                            onChange={e => setNewGroupUsers(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setIsCreateGroupOpen(false)} className="px-3 py-1 text-xs font-bold text-gray-500">Cancel</button>
                            <button onClick={handleCreateGroup} className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg">Create</button>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {isLoadingChats ? (
                        <div className="flex justify-center p-8"><Icons.Loader2 className="animate-spin text-gray-400" /></div>
                    ) : (
                        chats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => loadMessages(chat.id)}
                                className={cn(
                                    "w-full p-4 flex items-center gap-3 text-left hover:bg-white transition-colors border-b border-gray-50",
                                    activeChatId === chat.id ? "bg-white border-l-4 border-l-blue-600 shadow-sm" : "border-l-4 border-l-transparent"
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                    {chat.title.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <span className="font-bold text-sm text-gray-900 truncate">{chat.title}</span>
                                        <span className="text-[10px] text-gray-400">{chat.date ? format(new Date(chat.date * 1000), 'HH:mm') : ''}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{chat.message || 'No messages yet'}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={onLogout} className="text-xs text-red-500 font-bold flex items-center gap-2 hover:bg-red-50 p-2 rounded-lg w-full">
                        <Icons.LogOut size={14} /> Log Out
                    </button>
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-[#eef0f3]">
                {activeChatId ? (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, idx) => (
                                <div key={msg.id || idx} className={cn("flex", msg.isOut ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm break-words relative",
                                        msg.isOut
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white text-gray-900 rounded-bl-none"
                                    )}>
                                        <p>{msg.text}</p>
                                        <span className={cn(
                                            "text-[10px] block text-right mt-1 opacity-70",
                                            msg.isOut ? "text-blue-100" : "text-gray-400"
                                        )}>
                                            {format(new Date(msg.date * 1000), 'HH:mm')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                                <input
                                    className="flex-1 bg-transparent px-2 text-sm focus:outline-none"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    <Icons.Send size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                        <div className="p-6 bg-gray-100 rounded-full">
                            <Icons.MessageCircle size={48} className="opacity-20" />
                        </div>
                        <p className="font-medium text-sm">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
