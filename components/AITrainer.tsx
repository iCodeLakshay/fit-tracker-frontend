import { aiApi } from '@/lib/api';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AITrainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Fitness Trainer. I'm here to help you with workout plans, exercise form, nutrition advice, and motivation. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount and fetch suggestions
  useEffect(() => {
    inputRef.current?.focus();
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const suggestions = await aiApi.getSuggestions();
      setQuickQuestions(suggestions);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      // Set fallback questions
      setQuickQuestions([
        "Create a workout plan for me",
        "How to improve my form?",
        "Nutrition advice for muscle gain",
        "I need motivation to exercise"
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({ sender: m.sender, content: m.content }));
      const aiResponseContent = await aiApi.sendMessage(currentInput, conversationHistory);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="h-[100vh] flex flex-col overflow-hidden">
        <CardHeader className="border-b bg-blue-50 px-4 py-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-blue-600 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-blue-900">AI Fitness Trainer</CardTitle>
              <p className="text-sm text-blue-700">Your personal fitness assistant</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4"
            ref={scrollAreaRef}
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={message.sender === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}>
                    {message.sender === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                  <div
                    className={`rounded-lg px-4 py-3 ${message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                      }`}
                  >
                    <div className="text-sm break-words markdown-message">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => <h1 className="mt-4 mb-2 text-xl font-bold text-blue-800" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="mt-4 mb-2 text-lg font-semibold text-blue-700" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="mt-3 mb-1 text-base font-semibold text-blue-600" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 whitespace-pre-line" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-2" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          br: () => <br />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 mt-2">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions (only show when conversation is new) */}
          {messages.length <= 2 && quickQuestions.length > 0 && (
            <div className="px-4 py-2 border-t bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInputMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about fitness, workouts, or nutrition..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send.
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Custom Markdown styling for chat messages */}
      <style jsx global>{`
      .markdown-message h1, .markdown-message h2, .markdown-message h3 {
        margin-top: 1.25em;
        margin-bottom: 0.75em;
        line-height: 1.2;
      }
      .markdown-message p {
        margin-bottom: 0.75em;
        white-space: pre-line;
      }
      .markdown-message ul, .markdown-message ol {
        margin-bottom: 0.75em;
      }
      .markdown-message li {
        margin-bottom: 0.25em;
      }
    `}</style>
    </div>
  );
}
