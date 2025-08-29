import { useState } from "react";
import { useReports } from "@/contexts/ReportContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  Eye
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

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Hero Chat Section */}
      <div className="pt-16 pb-8">
        <div className="max-w-6xl mx-auto text-center px-4">
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-primary mb-2">
              Powperpay Reporting
            </h1>
            <p className="text-black text-xl font-medium mb-4">
              Payroll Intelligence Platform (Custom Reporting)
            </p>
          </div>
          
          <h2 className="text-3xl font-bold text-black mb-4">
            Build payroll reports with AI
          </h2>
          <p className="text-black text-lg mb-6">
            Generate comprehensive HR and payroll reports by chatting with AI
          </p>
          
          {/* Chat Input */}
          <div className="max-w-3xl mx-auto">
            <Card className="p-1 bg-white/95 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3 p-4">
                <div className="flex-1">
                  <Input
                    placeholder="Ask AI to create a payroll summary report for Q4..."
                    className="border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 px-0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="w-full space-y-8">
          {/* Custom Reports Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Custom Reports</h2>
                <p className="text-muted-foreground mt-1">
                  Manage and edit your AI-generated payroll and HR reports
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <Card className="p-4">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    All ({reports.length})
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Published ({reports.filter(r => r.status === 'published').length})
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Drafts ({reports.filter(r => r.status === 'draft').length})
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="p-6 shadow-elegant hover:shadow-lg hover:border-primary transition-smooth group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <Badge className={getStatusColor(report.status)}>
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
                          Remix
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
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

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Created {report.createdAt.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Edit className="w-3 h-3" />
                        Updated {report.updatedAt.toLocaleDateString()}
                      </div>
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
                      Remix
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
                <Link to="/">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Report
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Prebuilt Reports Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Prebuilt Report Templates</h2>
                <p className="text-muted-foreground mt-1">
                  Ready-to-use HR and payroll report templates to get you started quickly
                </p>
              </div>
            </div>

            {/* Prebuilt Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prebuiltReports.map((report) => (
                <Card key={report.id} className="p-6 shadow-elegant hover:shadow-lg hover:border-primary transition-smooth group border-primary/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        Template
                      </Badge>
                    </div>
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
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                      <Copy className="w-3 h-3 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;