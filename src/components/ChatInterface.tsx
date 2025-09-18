import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReports } from "@/contexts/ReportContext";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const promptingTips = [
  "Be specific with time ranges: \"Q3 2024\", \"last month\", \"year-to-date\"",
  "Filter by departments: \"Engineering team\", \"Sales department\"", 
  "Include pay codes: \"overtime\", \"bonuses\", \"healthcare deductions\"",
  "Ask for comparisons: \"compare this quarter to last quarter\""
];

export const ChatInterface = () => {
  const { generateReportFromPrompt, currentReport, messageId, conversationId, setMessageId, sendChatMessage, fetchAttachmentResult, setSessionData } = useReports();
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

  // Initialize chat history when there's an existing session or loaded data
  useEffect(() => {
    // Check for loaded chat history from localStorage (when editing a report)
    const loadedChatHistory = localStorage.getItem('loadedChatHistory');
    const loadedConversationId = localStorage.getItem('loadedConversationId');
    
    if (loadedChatHistory && loadedConversationId) {
      try {
        const parsedHistory = JSON.parse(loadedChatHistory);
        console.log('Loading chat history:', parsedHistory);
        console.log('First message details:', parsedHistory[0]);
        console.log('All message keys:', parsedHistory.map((msg: any, index: number) => ({
          index,
          keys: Object.keys(msg),
          hasAttachment: !!msg.attachment_id || !!msg.attachmentId,
          messageId: msg.id || msg.message_id,
          attachmentId: msg.attachment_id || msg.attachmentId,
          fullMessage: msg
        })));
        
        console.log('Full first message object:', JSON.stringify(parsedHistory[0], null, 2));
        console.log('All messages with attachment check:', parsedHistory.map((msg: any, index: number) => ({
          index,
          message_id: msg.message_id,
          attachment_id: msg.attachment_id,
          status: msg.status,
          content: msg.content,
          fullKeys: Object.keys(msg)
        })));
        
        // Save the message ID from index 0 (latest message)
        if (parsedHistory.length > 0) {
          const latestMessage = parsedHistory[0];
          const latestMessageId = latestMessage.message_id || latestMessage.id;
          console.log('Setting message ID to:', latestMessageId);
          
          if (latestMessageId) {
            setMessageId(latestMessageId);
            
            // Set session data for the loaded conversation
            setSessionData(latestMessageId, loadedConversationId);
            
            // Find the latest message with an attachment and fetch its result
            const latestMessageWithAttachment = parsedHistory.find((msg: any) => 
              msg.attachment_id || msg.attachmentId
            );
            console.log('Latest message with attachment:', latestMessageWithAttachment);
            
            if (latestMessageWithAttachment) {
              const attachmentId = latestMessageWithAttachment.attachment_id || latestMessageWithAttachment.attachmentId;
              const msgId = latestMessageWithAttachment.message_id || latestMessageWithAttachment.id;
              
              if (attachmentId && msgId) {
                console.log('Will fetch attachment result for:', { conversationId: loadedConversationId, messageId: msgId, attachmentId });
                // Delay the fetch to ensure the report context is properly set
                setTimeout(() => {
                  fetchAttachmentResult(loadedConversationId, msgId, attachmentId).catch(error => {
                    console.error('Error fetching attachment result for loaded conversation:', error);
                  });
                }, 1000);
              } else {
                console.log('Missing attachment ID or message ID:', { attachmentId, msgId });
              }
            } else {
              console.log('No message with attachment found in history');
            }
          }
        }
        
        // Transform API messages to our Message format - reverse since index 0 is latest
        const transformedMessages: Message[] = parsedHistory.reverse().map((msg: any, index: number) => ({
          id: msg.id || `loaded-${index}`,
          content: msg.content || msg.message || '',
          sender: msg.role === 'user' ? 'user' : 'assistant',
          timestamp: new Date(msg.timestamp || Date.now())
        }));
        
        setMessages([
          {
            id: '1',
            content: "Hello! I'm your AI HR report assistant. Tell me what kind of payroll or HR report you'd like to create - such as payroll summaries, benefits analysis, time tracking, or workforce demographics.",
            sender: 'assistant',
            timestamp: new Date()
          },
          ...transformedMessages
        ]);
        
        // Clear the localStorage after loading
        localStorage.removeItem('loadedChatHistory');
        localStorage.removeItem('loadedConversationId');
      } catch (error) {
        console.error('Error parsing loaded chat history:', error);
      }
    } else if (currentReport && messageId && conversationId) {
      // Fallback to existing logic for current report
      const description = currentReport.description;
      const promptMatch = description.match(/Report generated from prompt: "(.+?)"/);
      const originalPrompt = promptMatch ? promptMatch[1] : "Previous query";

      const chatHistory: Message[] = [
        {
          id: '1',
          content: "Hello! I'm your AI HR report assistant. Tell me what kind of payroll or HR report you'd like to create - such as payroll summaries, benefits analysis, time tracking, or workforce demographics.",
          sender: 'assistant',
          timestamp: new Date(currentReport.createdAt.getTime() - 1000)
        },
        {
          id: '2',
          content: originalPrompt,
          sender: 'user',
          timestamp: currentReport.createdAt
        },
        {
          id: '3',
          content: `Perfect! I've generated a comprehensive ${currentReport.type} report titled "${currentReport.title}". The report includes detailed analysis with ${currentReport.apiData?.data?.length || 0} records. You can view the full report in the preview panel and access it from your dashboard.`,
          sender: 'assistant',
          timestamp: new Date(currentReport.createdAt.getTime() + 1000)
        }
      ];

      setMessages(chatHistory);
    }
  }, [currentReport, messageId, conversationId, setMessageId, setSessionData, fetchAttachmentResult]);

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
      let report;
      
      // If there's an existing conversation, use sendChatMessage
      if (conversationId && messageId) {
        await sendChatMessage(conversationId, userPrompt);
        report = currentReport; // Use the updated current report
      } else {
        // Otherwise, generate a new report
        report = await generateReportFromPrompt(userPrompt);
      }
      
      // Update the thinking message with the actual response
      const aiResponse: Message = {
        id: thinkingMessage.id,
        content: `Perfect! I've ${conversationId ? 'updated your report with new data' : 'generated a comprehensive ' + (report?.type || 'report')} titled "${report?.title || 'New Report'}". The report includes detailed analysis${report?.apiData?.data?.length ? ` with ${report.apiData.data.length} records` : ''}. You can view the full report in the preview panel and access it from your dashboard.`,
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

      {/* Prompting Tips Section */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <Card className="p-4 bg-blue-50/50 border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb className="w-3 h-3 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-2 text-sm">Prompting Tips</h3>
                <ul className="space-y-1.5 text-xs text-blue-800">
                  {promptingTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

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