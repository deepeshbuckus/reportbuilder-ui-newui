import { useState, useEffect } from "react";
import { useReports } from "@/contexts/ReportContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Users,
  TrendingUp,
  Lightbulb,
  Send,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface Report {
  conversationId: string;
  defaultTitle: string;
  reportName: string;
  createdAt: string;
  mapped: boolean;
}


const Dashboard = () => {
  const navigate = useNavigate();
  const { startNewChat } = useReports();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/reports?onlyMapped=true');
        const data = await response.json();
        
        // Handle both array and object formats
        let reportsArray: Report[];
        if (Array.isArray(data)) {
          reportsArray = data;
        } else if (typeof data === 'object' && data !== null) {
          // Convert object with numeric keys to array
          reportsArray = Object.values(data);
        } else {
          reportsArray = [];
        }
        
        setReports(reportsArray);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleChatRedirect = async () => {
    if (!chatInput.trim()) return;
    
    try {
      await startNewChat(chatInput);
      navigate("/");
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  };

  const handleEditReport = async (conversationId: string) => {
    try {
      let allMessages: any[] = [];
      let pageToken: string | undefined;
      
      do {
        const url = new URL(`https://localhost:60400/api/reports/${conversationId}/messages`);
        url.searchParams.set('pageSize', '100');
        if (pageToken) {
          url.searchParams.set('pageToken', pageToken);
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          allMessages = [...allMessages, ...(data.messages || [])];
          pageToken = data.next_page_token;
        } else {
          console.error('Failed to fetch conversation messages:', response.status);
          break;
        }
      } while (pageToken);

      // Set the session data and navigate to chat
      if (allMessages.length > 0) {
        // Store the chat history in localStorage for the chat interface to pick up
        localStorage.setItem('loadedChatHistory', JSON.stringify(allMessages));
        localStorage.setItem('loadedConversationId', conversationId);
        
        // Navigate to the chat page
        navigate("/");
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleUpdateReportName = async (conversationId: string, newName: string) => {
    try {
      const response = await fetch('http://localhost:8085/api/reports/mappings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          reportName: newName,
          description: "Updated report name",
          active: true
        }),
      });

      if (response.ok) {
        // Refresh reports after successful update
        const reportsResponse = await fetch('http://localhost:8085/api/reports?onlyMapped=true');
        const data = await reportsResponse.json();
        
        // Handle both array and object formats
        let reportsArray: Report[];
        if (Array.isArray(data)) {
          reportsArray = data;
        } else if (typeof data === 'object' && data !== null) {
          reportsArray = Object.values(data);
        } else {
          reportsArray = [];
        }
        
        setReports(reportsArray);
      }
    } catch (error) {
      console.error('Failed to update report name:', error);
    }
  };

  const filteredReports = reports.filter(report =>
    (report.reportName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    report.defaultTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featureCards = [
    {
      icon: DollarSign,
      title: "Payroll Insights",
      description: "Get total costs, averages, and breakdowns by department",
      example: "Show me total payroll costs for Q3 2024"
    },
    {
      icon: Users,
      title: "Workforce Reports", 
      description: "Analyze individual employee data and metrics",
      example: "List all employees with overtime hours last month"
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "Compare periods and identify changes over time", 
      example: "Compare payroll costs between Q2 and Q3 2024"
    }
  ];

  const promptingTips = [
    "Be specific with time ranges: \"Q3 2024\", \"last month\", \"year-to-date\"",
    "Filter by departments: \"Engineering team\", \"Sales department\"", 
    "Include pay codes: \"overtime\", \"bonuses\", \"healthcare deductions\"",
    "Ask for comparisons: \"compare this quarter to last quarter\""
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-4">
              Transform payroll data into insights with AI
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Ask simple questions, get detailed reports. Analyze your payroll history, earnings & deductions, employee profiles, and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <span>Payroll Insights</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span>Workforce Reports</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span>Trend Analysis</span>
              </div>
            </div>
          </div>
        </div>
          
        {/* Chat Input */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-1 shadow-lg border-blue-200">
            <div className="flex items-center gap-3 p-3">
              <div className="flex-1">
                <Input
                  placeholder="Ask for a custom payroll report"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatRedirect()}
                  className="border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 px-0"
                />
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleChatRedirect}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-2 pb-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Recent Reports Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-muted-foreground" />
              <h2 className="text-xl font-medium text-muted-foreground">Recent Reports</h2>
            </div>
            <Separator />
          </div>

          {/* Search */}
          <div className="relative mb-6 w-full md:max-w-[calc(50%-0.75rem)]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center text-muted-foreground">Loading reports...</div>
            ) : (
              filteredReports.slice(0, 6).map((report) => (
                <Card key={report.conversationId} className="p-6 hover:shadow-lg transition-smooth hover:border-blue-500 hover:border-2 cursor-pointer h-64">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">
                        {report.reportName || "Untitled Report - Click to edit"}
                      </h3>
                      <div className="text-xs text-muted-foreground mb-3">
                        Created on {new Date(report.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: '2-digit', 
                          day: '2-digit' 
                        })}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {report.defaultTitle}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-center">
                      <Button 
                        variant="outline" 
                        size="default" 
                        className="flex-1"
                        onClick={() => {
                          if (report.reportName) {
                            handleEditReport(report.conversationId);
                          } else {
                            const newName = prompt('Enter new report name:', report.reportName || '');
                            if (newName && newName.trim()) {
                              handleUpdateReportName(report.conversationId, newName.trim());
                            }
                          }
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {report.reportName ? 'Edit report' : 'Set name'}
                      </Button>
                      <Button size="default" className="bg-primary hover:bg-primary/90 flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Run report
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {filteredReports.length === 0 && (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No reports found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search criteria' : 'Create your first report to get started'}
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Report
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
