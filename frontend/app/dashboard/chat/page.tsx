'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Bot, User, Send, Sparkles, RefreshCw } from 'lucide-react';
import { mockChatHistory, suggestedPrompts } from '@/lib/mock-data';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt');
  const [messages, setMessages] = useState<Message[]>(mockChatHistory);
  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialPrompt && messages.length === mockChatHistory.length) {
      handleSend(initialPrompt);
    }
  }, []);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    // In production, replace with actual API call:
    // const response = await chatApi.sendMessage(text, conversationId);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponses: Record<string, string> = {
      default: `I understand you're asking about "${text}". Let me help you with that.\n\nBased on our policies and your account information, here's what I found:\n\n1. **Quick Answer**: I can help you resolve this issue directly.\n2. **Next Steps**: If you need further assistance, I can create a support ticket for you.\n\nWould you like me to provide more details or create a ticket for human review?`,
      order: `I found your order information!\n\n**Order Status**: In Transit\n**Expected Delivery**: Within 2-3 business days\n**Tracking Number**: TRK123456789\n\nYour package is currently at the local distribution center and will be out for delivery soon.\n\nIs there anything specific about your order you'd like to know?`,
      refund: `I can help you with refund information.\n\n**Our Refund Policy**:\n- Full refunds available within 30 days of purchase\n- Items must be unused and in original packaging\n- Refunds are processed within 5-7 business days\n\n**To request a refund**, you can:\n1. Create a support ticket with your order number\n2. Include photos if the item is damaged\n\nWould you like me to start a refund request for you?`,
      return: `Here's how our return process works:\n\n**Return Steps**:\n1. Initiate a return request through your account\n2. Print the prepaid shipping label\n3. Pack the item securely\n4. Drop off at any authorized carrier location\n\n**Important Notes**:\n- Returns must be initiated within 30 days\n- Original receipt or order confirmation required\n\nShall I help you start a return?`,
    };

    let responseContent = aiResponses.default;
    const lowerText = text.toLowerCase();
    if (lowerText.includes('order') || lowerText.includes('track') || lowerText.includes('shipping')) {
      responseContent = aiResponses.order;
    } else if (lowerText.includes('refund') || lowerText.includes('money back')) {
      responseContent = aiResponses.refund;
    } else if (lowerText.includes('return')) {
      responseContent = aiResponses.return;
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Support Chat
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Get instant answers powered by AI
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleNewChat}>
          <RefreshCw className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col bg-card border-border/50 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-medium text-foreground mb-2">How can I help you today?</h2>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                I can help you with order tracking, refunds, returns, and general inquiries. 
                Ask me anything!
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSend(prompt)}
                    className="text-sm"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 h-11"
              disabled={isLoading}
            />
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} size="lg">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
