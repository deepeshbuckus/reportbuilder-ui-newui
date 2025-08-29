import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReports } from "@/contexts/ReportContext";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const ChatInterface = () => {
  const { generateReportFromPrompt } = useReports();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI HR report assistant. Tell me what kind of payroll or HR report you'd like to create - such as payroll summaries, benefits analysis, time tracking, or workforce demographics.",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userPrompt = inputValue;
    const newMessage: Message = {
      id: Date.now().toString(),
      content: userPrompt,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsGenerating(true);

    // Add AI thinking message
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "I'm analyzing your requirements and generating a comprehensive report. This may take a moment...",
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      // Generate report using the prompt
      const report = await generateReportFromPrompt(userPrompt);
      
      // Update the thinking message with the actual response
      const aiResponse: Message = {
        id: thinkingMessage.id,
        content: `Perfect! I've generated a comprehensive ${report.type} report titled "${report.title}". The report includes detailed analysis, key findings, and actionable recommendations based on your requirements. You can view the full report in the preview panel and access it from your dashboard.`,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === thinkingMessage.id ? aiResponse : msg
      ));
    } catch (error) {
      const errorMessage: Message = {
        id: thinkingMessage.id,
        content: "I apologize, but there was an error generating your report. Please try again with a different prompt.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === thinkingMessage.id ? errorMessage : msg
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-subtle">
      <div className="p-4 border-b bg-card/50">
        <h2 className="font-semibold text-foreground">HR Report Assistant</h2>
        <p className="text-sm text-muted-foreground">Describe the HR or payroll report you want to generate</p>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-full",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <div
                className={cn(
                  "px-4 py-3 rounded-xl max-w-[85%] shadow-chat transition-smooth",
                  message.sender === 'user'
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-card border"
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className={cn(
                  "text-xs opacity-70 mt-1 block",
                  message.sender === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-card/50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your HR/payroll report requirements..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            className="px-3"
            disabled={!inputValue.trim() || isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};