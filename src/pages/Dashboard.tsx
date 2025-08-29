import { useState } from "react";
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleChatRedirect = () => {
    navigate("/");
  };

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
          <Card className="p-1 shadow-lg">
            <div className="flex items-center gap-3 p-3">
              <div className="flex-1">
                <Input
                  placeholder="Ask for a custom payroll report"
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
      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.slice(0, 6).map((report) => (
              <Card key={report.id} className="p-6 hover:shadow-lg transition-smooth hover:border-blue-500 hover:border-2 cursor-pointer">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">
                      {report.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="text-xs text-muted-foreground">
                      Last run on {report.updatedAt.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit' 
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit report
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Run report
                      </Button>
                    </div>
                  </div>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
