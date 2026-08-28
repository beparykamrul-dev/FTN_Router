import React, { useState, useRef, useEffect } from 'react';
import { Command, Send, Bot, Sparkles, Loader2, Bookmark, Download, Upload, Database, Settings2, Trash2, Network, X } from 'lucide-react';
import { cn } from '../utils';

interface Message {
  role: 'user' | 'model';
  content: string;
  id?: string;
}

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookmarks, setBookmarks] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isContextAware, setIsContextAware] = useState(true);
  const [activePanel, setActivePanel] = useState<'none' | 'bookmarks' | 'settings'>('none');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load state from local storage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('ftn_ai_memory');
    const savedBookmarks = localStorage.getItem('ftn_ai_bookmarks');
    const savedContext = localStorage.getItem('ftn_ai_context');

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{ id: Date.now().toString(), role: 'model', content: 'Greetings. I am **FTN AI**, your proprietary network intelligence. I am directly integrated with your FTN grid infrastructure. How may I assist in optimizing your topology today?' }]);
    }
    
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedContext) setIsContextAware(JSON.parse(savedContext));
  }, []);

  // Save state to local storage when it changes
  useEffect(() => {
    if (messages.length > 0) localStorage.setItem('ftn_ai_memory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ftn_ai_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('ftn_ai_context', JSON.stringify(isContextAware));
  }, [isContextAware]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    const history = messages.slice(1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userMsg };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: history,
          contextAwareness: isContextAware
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch FTN AI response');

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: data.text }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: `**Error:** ${err.message}. Please verify your GEMINI_API_KEY configuration.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = (msg: Message) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === msg.id);
      if (exists) return prev.filter(b => b.id !== msg.id);
      return [...prev, msg];
    });
  };

  const handleExport = () => {
    const data = {
      version: '1.0',
      messages,
      bookmarks,
      isContextAware,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ftn-ai-memory-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    window.dispatchEvent(new CustomEvent('add-toast', { detail: { type: 'success', title: 'Memory Exported', message: 'FTN AI state exported successfully.' } }));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.messages) setMessages(data.messages);
        if (data.bookmarks) setBookmarks(data.bookmarks);
        if (data.isContextAware !== undefined) setIsContextAware(data.isContextAware);
        window.dispatchEvent(new CustomEvent('add-toast', { detail: { type: 'success', title: 'Memory Imported', message: 'FTN AI state restored successfully.' } }));
      } catch (err) {
        window.dispatchEvent(new CustomEvent('add-toast', { detail: { type: 'error', title: 'Import Failed', message: 'Invalid FTN AI memory file.' } }));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearMemory = () => {
    setMessages([{ id: Date.now().toString(), role: 'model', content: 'Memory cleared. I am **FTN AI**. How may I assist you now?' }]);
    setBookmarks([]);
    localStorage.removeItem('ftn_ai_memory');
    localStorage.removeItem('ftn_ai_bookmarks');
    window.dispatchEvent(new CustomEvent('add-toast', { detail: { type: 'info', title: 'Memory Cleared', message: 'Local storage wiped.' } }));
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white mb-1 flex items-center gap-2">
              <Bot className="w-6 h-6 text-[#00f0ff]" /> FTN AI
            </h1>
            <p className="text-gray-400 text-sm font-mono flex items-center gap-2">
              Proprietary Network Intelligence
              {isContextAware && <span className="bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 px-2 py-0.5 rounded text-[10px] uppercase">Telemetry Sync Active</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActivePanel(activePanel === 'bookmarks' ? 'none' : 'bookmarks')}
              className={cn("p-2 rounded-lg transition-colors border", activePanel === 'bookmarks' ? "bg-purple-500/20 border-purple-500/50 text-purple-400" : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white")}
              title="Saved Configurations & Insights"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'settings' ? 'none' : 'settings')}
              className={cn("p-2 rounded-lg transition-colors border", activePanel === 'settings' ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white")}
              title="Memory & Context Settings"
            >
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 glass-panel border border-gray-800/60 rounded-xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={msg.id || i} className={cn("flex gap-4 max-w-[85%] group", msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto")}>
                <div className={cn(
                  "w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center shadow-lg border",
                  msg.role === 'user' 
                    ? "bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]" 
                    : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                )}>
                  {msg.role === 'user' ? <Command className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed relative",
                  msg.role === 'user' 
                    ? "bg-gray-800 text-gray-200 rounded-tr-sm"
                    : "bg-gray-900/80 border border-gray-800/80 text-gray-300 rounded-tl-sm"
                )}>
                  {msg.role === 'model' && (
                    <button 
                      onClick={() => toggleBookmark(msg)}
                      className={cn(
                        "absolute -right-2 -top-2 p-1.5 rounded-full border shadow-sm transition-all opacity-0 group-hover:opacity-100",
                        bookmarks.find(b => b.id === msg.id) ? "opacity-100 bg-purple-500 text-white border-purple-400" : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"
                      )}
                    >
                      <Bookmark className="w-3 h-3" />
                    </button>
                  )}
                  <div dangerouslySetInnerHTML={{ 
                    __html: msg.content.replace(/```(routeros|bash|json)?\n([\s\S]*?)```/g, '<pre class="bg-black text-[#00ff66] p-3 rounded-lg my-2 font-mono text-xs overflow-x-auto border border-gray-800">$2</pre>').replace(/\n/g, '<br/>') 
                  }} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 max-w-[85%]">
                 <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center shadow-lg border bg-purple-500/10 border-purple-500/30 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                 </div>
                 <div className="p-4 rounded-2xl text-sm leading-relaxed bg-gray-900/80 border border-gray-800/80 text-gray-300 rounded-tl-sm flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin text-[#00f0ff]" /> Integrating telemetry...
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gray-900 border-t border-gray-800/50">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Ask FTN AI to optimize queues, check OLT lasers, or retrieve configurations..."
                className="w-full bg-gray-950 border border-gray-800 text-white pl-12 pr-14 py-4 rounded-xl focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 transition-all font-sans text-sm shadow-inner disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 p-2 bg-gradient-to-br from-[#0088ff] to-[#0055cc] hover:from-[#0099ff] hover:to-[#0066ee] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,136,255,0.4)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-center mt-2">
               <span className="text-[10px] text-gray-500 font-mono flex items-center justify-center gap-1">
                 <Database className="w-3 h-3" /> State persisted locally
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panels */}
      {activePanel !== 'none' && (
        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              {activePanel === 'bookmarks' ? <><Bookmark className="w-4 h-4 text-purple-400" /> Saved Insights</> : <><Settings2 className="w-4 h-4 text-gray-400" /> AI Settings</>}
            </h3>
            <button onClick={() => setActivePanel('none')} className="text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="glass-panel border border-gray-800/60 rounded-xl flex-1 overflow-y-auto p-4">
            {activePanel === 'bookmarks' && (
              <div className="space-y-4">
                {bookmarks.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No saved insights yet.</p>
                  </div>
                ) : (
                  bookmarks.map(b => (
                    <div key={b.id} className="bg-gray-900/80 border border-gray-800 p-3 rounded-lg relative group">
                      <button onClick={() => toggleBookmark(b)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                      <div className="text-xs text-gray-300 line-clamp-4" dangerouslySetInnerHTML={{ __html: b.content.replace(/```/g, '') }} />
                    </div>
                  ))
                )}
              </div>
            )}

            {activePanel === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                    <Network className="w-4 h-4 text-[#00ff66]" /> Context Engine
                  </h4>
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div>
                      <p className="text-sm text-gray-200">Context Awareness</p>
                      <p className="text-[10px] text-gray-500 mt-1 leading-tight">Allow FTN AI to read live telemetry from SmartNOC and PKI Engine.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-2">
                      <input type="checkbox" className="sr-only peer" checked={isContextAware} onChange={() => setIsContextAware(!isContextAware)} />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00ff66]"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#00f0ff]" /> Memory Management
                  </h4>
                  <div className="space-y-2">
                    <button onClick={handleExport} className="w-full flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors text-sm text-gray-300">
                      <span>Export AI State (JSON)</span>
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors text-sm text-gray-300">
                      <span>Import AI State</span>
                      <Upload className="w-4 h-4 text-gray-400" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />

                    <button onClick={clearMemory} className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors text-sm text-red-400 mt-4">
                      <span>Wipe Local Memory</span>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
