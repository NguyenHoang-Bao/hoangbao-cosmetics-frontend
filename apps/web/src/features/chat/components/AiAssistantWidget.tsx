import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, RotateCcw, ArrowUp, Loader2 } from 'lucide-react';
import type { ChatMessage, QuickPrompt } from '../types';
import { INITIAL_ASSISTANT_MESSAGE, DEFAULT_QUICK_PROMPTS } from '../config';
import { sendMessageToAssistant } from '../services/chatService';
import { ProductRecommendationCard } from './ProductRecommendationCard';

export const AiAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasUnreadNotice, setHasUnreadNotice] = useState<boolean>(true);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: INITIAL_ASSISTANT_MESSAGE,
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnreadNotice(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages, scrollToBottom]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-welcome-' + Date.now(),
        sender: 'assistant',
        text: INITIAL_ASSISTANT_MESSAGE,
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessageToAssistant(trimmed, [...messages, userMessage]);
      const botMessage: ChatMessage = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        text: response.text,
        timestamp: new Date(),
        suggestedProducts: response.suggestedProducts
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('[AI Assistant Error]:', err);
      const errorMessage: ChatMessage = {
        id: 'error-' + Date.now(),
        sender: 'assistant',
        text: 'Hệ thống đang bảo trì kết nối tới máy chủ n8n. Vui lòng thử lại sau ít phút hoặc liên hệ hotline Hoàng Bảo Cosmetics để được hỗ trợ tức thì.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: QuickPrompt) => {
    handleSendMessage(prompt.prompt);
  };

  const renderFormattedText = (text: string) => {
    const paragraphs = text.split('\n\n');
    return (
      <div className="space-y-2">
        {paragraphs.map((para, pIdx) => {
          const parts = para.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={pIdx} className="leading-relaxed">
              {parts.map((part, idx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={idx} className="font-semibold text-[#0F1E36]">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ── 1. NÚT KÍCH HOẠT DẠNG TRÒN TỐI GIẢN (OPTION 1 - XANH NAVY SANG TRỌNG) ── */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 select-none">
        <div className="relative group">
          <button
            type="button"
            onClick={handleToggle}
            aria-label="Mở trợ lý tư vấn da liễu và sản phẩm shop"
            className="w-13 h-13 rounded-full bg-[#0F1E36] hover:bg-[#162B4D] text-white flex items-center justify-center shadow-2xl border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-slate-200 transition-transform duration-200" />
            ) : (
              <MessageSquare className="w-5 h-5 text-white transition-transform duration-200" />
            )}

            {/* Chấm trạng thái online */}
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-2xs"></span>
          </button>

          {/* Tooltip khi hover (chỉ khi đang đóng) */}
          {!isOpen && (
            <div className="absolute bottom-full right-0 mb-2.5 px-3 py-1.5 rounded-xl bg-[#0F1E36] text-white text-[11px] font-medium whitespace-nowrap shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Tư vấn da & tìm sản phẩm shop
              <span className="absolute top-full right-5 -mt-1 border-4 border-transparent border-t-[#0F1E36]"></span>
            </div>
          )}

          {/* Chấm thông báo nhỏ lần đầu */}
          {!isOpen && hasUnreadNotice && (
            <span className="absolute -top-1 -left-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0F1E36] border border-white"></span>
            </span>
          )}
        </div>
      </div>

      {/* ── 2. HỘP THOẠI CHAT (DEEP NAVY LUXURY) ── */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[530px] sm:h-[580px] bg-white rounded-2xl border border-neutral-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
          
          {/* Header Khung Chat: Xanh Navy Quý Phái */}
          <div className="bg-[#0F1E36] text-white px-4 sm:px-5 py-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#1A2D4C] border border-white/20 text-white flex items-center justify-center font-art text-xs tracking-wider">
                  HB
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#0F1E36]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-xs sm:text-sm tracking-tight text-white">
                    Hoàng Bảo Skincare Concierge
                  </h3>
                  <span className="text-[9px] font-mono uppercase bg-[#1A2D4C] text-slate-200 px-1.5 py-0.2 rounded border border-white/10">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Tư vấn chuẩn da liễu & Sản phẩm chính hãng
                </p>
              </div>
            </div>

            {/* Các nút công cụ */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Làm mới hội thoại"
                className="w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Đóng chat"
                className="w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vùng Nội Dung Tin Nhắn */}
          <div className="flex-1 p-4 space-y-3.5 bg-[#FAF9F7] text-xs overflow-y-auto">
            {/* Phân cách định vị vai trò */}
            <div className="text-center my-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 bg-slate-200/60 px-2.5 py-0.5 rounded-full border border-slate-200">
                Tư vấn chuẩn y khoa • Gợi ý sản phẩm tại shop
              </span>
            </div>

            {/* Danh sách tin nhắn */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#0F1E36] text-white flex items-center justify-center text-[10px] font-art shrink-0 mt-0.5">
                    HB
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[86%] ${
                    msg.sender === 'user'
                      ? 'bg-[#0F1E36] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-neutral-800 rounded-tl-xs border border-neutral-200/80 shadow-xs'
                  }`}
                >
                  {renderFormattedText(msg.text)}

                  {/* Hiển thị thẻ sản phẩm gợi ý nếu có */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="space-y-1.5 mt-2 pt-2 border-t border-neutral-100">
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                        Gợi ý sản phẩm tại shop:
                      </span>
                      {msg.suggestedProducts.map((prod) => (
                        <ProductRecommendationCard
                          key={prod.idProduct}
                          product={prod}
                          onProductClick={() => setIsOpen(false)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Gợi ý câu hỏi nhanh (Chỉ hiển thị khi mới bắt đầu cuộc trò chuyện) */}
            {messages.length === 1 && (
              <div className="flex flex-col gap-1.5 pl-8 pt-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Gợi ý câu hỏi nhanh:
                </span>
                <div className="flex flex-col gap-1.5">
                  {DEFAULT_QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handlePromptClick(prompt)}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-neutral-200 hover:border-slate-300 text-[11px] font-medium text-neutral-800 transition-colors text-left shadow-2xs"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-center pl-8 text-slate-500 text-[11px]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0F1E36]" />
                <span>Chuyên viên đang tra cứu phác đồ & sản phẩm...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Thanh Nhập Tin Nhắn */}
          <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Hỏi về tình trạng da hoặc tìm sản phẩm..."
                disabled={isLoading}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-neutral-100 border border-transparent focus:border-[#0F1E36]/40 focus:bg-white focus:outline-none transition-all placeholder:text-neutral-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                title="Gửi tin nhắn"
                className="w-9 h-9 rounded-xl bg-[#0F1E36] hover:bg-[#162B4D] disabled:bg-slate-300 text-white flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Hỗ trợ bởi n8n AI Workflow</span>
              <span>Bảo mật thông tin</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
