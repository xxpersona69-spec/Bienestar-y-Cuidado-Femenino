import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Bot, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const AuraBotDrawer: React.FC = () => {
  const { isAuraBotOpen, setIsAuraBotOpen } = useStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: '🌸 ¡Hola linda! Soy Aura Bot, tu asesora experta en bienestar femenino y salud menstrual. ¿Tienes dudas sobre la Banda Térmica Aura Heat, nuestra rasuradora Velvet Touch o cómo funciona el Pago Contraentrega en Colombia?',
      time: 'Ahora'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isAuraBotOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsgText })
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Con mucho gusto te asesoro en lo que necesites para tu bienestar.',
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-rose-950/30 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-rose-100"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200 text-rose-950 flex items-center justify-between border-b border-rose-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-rose-600 flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm">Aura Bot IA</h3>
                <span className="text-[10px] text-rose-900/80 font-semibold block -mt-0.5">
                  Asesora Virtual de Bienestar Femenino
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAuraBotOpen(false)}
              className="p-1.5 text-rose-900 hover:bg-white/40 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-rose-50/30">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-2 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-rose-400 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-rose-500 text-white rounded-tr-none shadow-xs'
                      : 'bg-white text-rose-950 border border-rose-100 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`text-[9px] block mt-1 text-right ${m.sender === 'user' ? 'text-rose-100' : 'text-rose-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-rose-500 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Aura Bot está escribiendo...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-rose-100 bg-white">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Pregúntame sobre productos, cólicos o envíos..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-rose-50/60 border border-rose-200 rounded-2xl text-xs font-medium text-rose-950 focus:outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
