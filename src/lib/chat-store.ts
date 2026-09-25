import type { AskAnswer, AskAttachment } from "./api";

export type ChatEntry = { id: string; question: string; attachments: AskAttachment[]; answer?: AskAnswer; recorded?: boolean; unreachable?: boolean };
export type SavedChat = { id: string; title: string; updatedAt: string; entries: ChatEntry[] };
const KEY = "sqrlane.chats";
export const CHAT_EVENT = "sqrlane-chats-changed";

export function newChatId() { return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}` }
export function loadChats(): SavedChat[] { try { const value = localStorage.getItem(KEY); const parsed = value ? JSON.parse(value) : []; return Array.isArray(parsed) ? parsed.slice(0, 20) : [] } catch { return [] } }
export function saveChat(chat: SavedChat) { try { const compact = { ...chat, entries: chat.entries.map(entry => ({ ...entry, attachments: entry.attachments.map(file => ({ name: file.name, content: null })) })) }; const chats = [compact, ...loadChats().filter(x => x.id !== chat.id)].sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0,20); localStorage.setItem(KEY, JSON.stringify(chats)); dispatchEvent(new Event(CHAT_EVENT)) } catch {} }
export function deleteChat(id: string) { try { localStorage.setItem(KEY, JSON.stringify(loadChats().filter(x => x.id !== id))); dispatchEvent(new Event(CHAT_EVENT)) } catch {} }