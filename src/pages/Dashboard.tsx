import { useState } from "react";
import { useReports } from "@/contexts/ReportContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Send
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  type: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Q4 Payroll Summary Report',
    description: 'Comprehensive quarterly payroll analysis including salary distributions, overtime costs, and tax withholdings.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
    status: 'published',
    type: 'Payroll'
  },
  {
    id: '2',
    title: 'Employee Benefits Analysis',
    description: 'Detailed breakdown of healthcare, retirement contributions, and other employee benefits costs.',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16'),
    status: 'draft',
    type: 'Benefits'
  },
  {
    id: '3',
    title: 'Time & Attendance Report',
    description: 'Monthly analysis of employee attendance, PTO usage, sick leave, and overtime patterns.',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
    status: 'published',
    type: 'Attendance'
  },
  {
    id: '4',
    title: 'Workforce Demographics Report',
    description: 'HR analytics on employee demographics, diversity metrics, and workforce composition.',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
    status: 'archived',
    type: 'Demographics'
  }
];

const prebuiltReports: Report[] = [
  {
    id: 'pb1',
    title: 'Monthly Payroll Summary Template',
    description: 'Ready-to-use template for monthly payroll summaries including gross pay, deductions, and net pay analysis.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    status: 'published',
    type: 'Payroll Template'
  },
  {
    id: 'pb2',
    title: 'Employee Onboarding Report',
    description: 'Track new hire progress, documentation completion, and onboarding milestones.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    status: 'published',
    type: 'HR Template'
  },
  {
    id: 'pb3',
    title: 'PTO Balance Report',
    description: 'Monitor employee vacation days, sick leave balances, and upcoming time-off requests.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    status: 'published',
    type: 'Attendance Template'
  },
  {
    id: 'pb4',
    title: 'Performance Review Summary',
    description: 'Comprehensive template for quarterly and annual performance evaluations and ratings.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    status: 'published',
    type: 'Performance Template'
  },
  {
    id: 'pb5',
    title: 'Compliance Audit Report',
    description: 'Track regulatory compliance, document reviews, and audit findings for HR processes.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    status: 'published',
    type: 'Compliance Template'
  },
  {
    id: 'pb6',
    title: 'Salary Benchmarking Analysis',
    description: 'Compare employee compensation against industry standards and market rates.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    status: 'published',
    type: 'Compensation Template'
  }
];

const Dashboard = () => {
  const { reports } = useReports();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase())
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
      {/* Header */}
      <div className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">
              Payroll Intelligence
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Transform payroll data into insights with AI
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Ask simple questions, get detailed reports. Analyze your payroll history, earnings & deductions,
            employee profiles, and more.
          </p>

          {/* Feature Cards */}
          <div className="flex justify-center gap-4 mb-8">
            {featureCards.map((card) => (
              <div key={card.title} className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-smooth cursor-pointer">
                <card.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{card.title}</span>
              </div>
            ))}
          </div>
          
          {/* Chat Input */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-1 shadow-lg">
              <div className="flex items-center gap-3 p-3">
                <div className="flex-1">
                  <Input
                    placeholder="Ask for a custom payroll report"
                    className="border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 px-0"
                  />
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="get-started" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="get-started" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Get Started
              </TabsTrigger>
              <TabsTrigger value="recent-reports" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Recent Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="get-started" className="space-y-6">
              {/* Feature Cards Detail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featureCards.map((card) => (
                  <Card key={card.title} className="p-6 hover:shadow-lg transition-smooth">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <card.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {card.description}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Example: "{card.example}"
                    </p>
                  </Card>
                ))}
              </div>

              {/* Prompting Tips */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Prompting Tips</h3>
                </div>
                <ul className="space-y-2">
                  {promptingTips.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="recent-reports" className="space-y-6">
              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Reports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReports.slice(0, 6).map((report) => (
                  <Card key={report.id} className="p-6 hover:shadow-lg transition-smooth group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <Badge 
                          variant={report.status === 'published' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {report.status}
                        </Badge>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-smooth">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-2">
                          {report.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {report.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Updated {report.updatedAt.toLocaleDateString()}
                      </div>

                      <div className="pt-2 border-t">
                        <Badge variant="outline" className="text-xs">
                          {report.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Copy className="w-3 h-3 mr-1" />
                        Duplicate
                      </Button>
                    </div>
                  </Card>
                ))}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;