import { aiApi } from '@/lib/api';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
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
      {/* Global styles for Markdown formatting */}
      <style jsx global>{`
        .markdown-content {
          word-break: break-word;
          overflow-wrap: anywhere;
          max-width: 100%;
        }
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          margin-top: 1em;
          margin-bottom: 0.5em;
          line-height: 1.3;
        }
        .markdown-content p {
          margin-bottom: 0.75em;
          white-space: pre-line;
        }
        .markdown-content ul, .markdown-content ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        .markdown-content li {
          margin-bottom: 0.25em;
        }
        .markdown-content blockquote {
          border-left: 3px solid #e2e8f0;
          padding-left: 1em;
          font-style: italic;
          margin: 1em 0;
        }
        .markdown-content code {
          background-color: #f1f5f9;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.9em;
        }
        .markdown-content pre {
          background-color: #f1f5f9;
          padding: 1em;
          border-radius: 0.25em;
          overflow-x: auto;
          margin: 1em 0;
        }
      `}</style>
      
      <Card className="h-[100vh] flex flex-col max-w-full overflow-hidden">
        <CardHeader className="border-b bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-900">AI Fitness Trainer</CardTitle>
              <p className="text-sm text-blue-700">Your personal fitness assistant</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 max-w-full overflow-hidden">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 max-w-full overflow-x-hidden" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={message.sender === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}>
                      {message.sender === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`} style={{ maxWidth: '80%', minWidth: 0, overflow: 'hidden' }}>
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%', overflow: 'hidden' }}
                    >
                      <div className="text-sm markdown-content" style={{ maxWidth: '100%', overflow: 'hidden' }}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-semibold mt-3 mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="font-medium mt-2 mb-1" {...props} />,
                            p: ({node, ...props}) => <p className="mb-3 whitespace-pre-line" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            a: ({node, ...props}) => <a className="text-blue-500 underline" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                            code: ({node, className, ...props}) => 
                              <code className="bg-gray-100 px-1 py-0.5 rounded" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
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
          </ScrollArea>

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
                className="bg-blue-600 hover:bg-blue-700"
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

      {/* Tips Card */}
      {/* <Card className="hidden md:block max-h-56 overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">💡 Tips for Better Conversations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600">• Be specific about your fitness goals and current level</p>
          <p className="text-sm text-gray-600">• Ask about workout routines, exercise form, or nutrition</p>
          <p className="text-sm text-gray-600">• Share your progress for personalized advice</p>
          <p className="text-sm text-gray-600">• Ask for motivation when you need an extra push</p>
        </CardContent>
      </Card> */}
    </div>
  );
}
