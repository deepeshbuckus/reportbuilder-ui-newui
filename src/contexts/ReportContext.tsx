import { createContext, useContext, useState, ReactNode } from 'react';

export interface Report {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  type: string;
  apiData?: {
    title: string;
    type: string;
    data: Record<string, any>[];
  };
}

interface ReportContextType {
  reports: Report[];
  currentReport: Report | null;
  messageId: string | null;
  conversationId: string | null;
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  setCurrentReport: (report: Report | null) => void;
  generateReportFromPrompt: (prompt: string, apiData?: { title: string; type: string; data: Record<string, any>[] }) => Promise<Report>;
  startNewChat: (content: string) => Promise<{ messageId: string; conversationId: string }>;
  setSessionData: (messageId: string, conversationId: string) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};

// Mock data for initial reports
const initialReports: Report[] = [
  {
    id: '1',
    title: 'Q4 Payroll Summary Report',
    description: 'Comprehensive quarterly payroll analysis including salary distributions, overtime costs, and tax withholdings.',
    content: 'Sample payroll content...',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
    status: 'published',
    type: 'Payroll'
  },
  {
    id: '2',
    title: 'Employee Benefits Analysis',
    description: 'Detailed breakdown of healthcare, retirement contributions, and other employee benefits costs.',
    content: 'Sample benefits content...',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16'),
    status: 'draft',
    type: 'Benefits'
  },
  {
    id: '3',
    title: 'Monthly Attendance Report',
    description: 'Analysis of employee attendance patterns, PTO usage, and overtime trends across departments.',
    content: 'Sample attendance content...',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
    status: 'published',
    type: 'Attendance'
  },
  {
    id: '4',
    title: 'Workforce Demographics Study',
    description: 'Comprehensive demographic analysis including diversity metrics, age distribution, and tenure statistics.',
    content: 'Sample demographics content...',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
    status: 'published',
    type: 'Demographics'
  },
  {
    id: '5',
    title: 'Compensation Benchmarking Report',
    description: 'Market comparison of salary ranges, bonus structures, and total compensation packages.',
    content: 'Sample compensation content...',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-09'),
    status: 'draft',
    type: 'Payroll'
  },
  {
    id: '6',
    title: 'Performance Review Analytics',
    description: 'Statistical analysis of performance ratings, goal completion rates, and promotion trends.',
    content: 'Sample performance content...',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-07'),
    status: 'published',
    type: 'Performance'
  }
];

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const addReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setReports(prev => [newReport, ...prev]);
    setCurrentReport(newReport);
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === id 
        ? { ...report, ...updates, updatedAt: new Date() }
        : report
    ));
    
    if (currentReport?.id === id) {
      setCurrentReport(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const generateReportFromPrompt = async (prompt: string, apiData?: { title: string; type: string; data: Record<string, any>[] }): Promise<Report> => {
    try {
      const response = await fetch('http://127.0.0.1:8000/nl2sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        credentials: 'include',
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reportData = await response.json();
      
      const reportTitle = reportData.title || 'AI Generated Report';
      const reportType = reportData.type || 'General';
      const reportContent = generateContentFromApiData(reportData, prompt);

      const newReport: Report = {
        id: Date.now().toString(),
        title: reportTitle,
        description: `Report generated from prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`,
        content: reportContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        type: reportType,
        apiData: reportData
      };

      setReports(prev => [newReport, ...prev]);
      setCurrentReport(newReport);
      return newReport;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  };

  const startNewChat = async (content: string): Promise<{ messageId: string; conversationId: string }> => {
    try {
      const response = await fetch('https://localhost:60400/api/reports/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const messageId = data.message_id;
      const conversationId = data.conversation_id;
      
      setMessageId(messageId);
      setConversationId(conversationId);

      // If there's data in the response, create a report
      if (data.result?.statement_response?.result?.data_array) {
        const apiData = transformApiResponse(data.result.statement_response, content);
        const newReport = createReportFromApiData(content, apiData);
        addReport(newReport);
        return { messageId, conversationId };
      }
      
      return { messageId, conversationId };
    } catch (error) {
      console.error('Error starting new chat:', error);
      throw error;
    }
  };

  const setSessionData = (messageId: string, conversationId: string) => {
    setMessageId(messageId);
    setConversationId(conversationId);
  };

  return (
    <ReportContext.Provider value={{
      reports,
      currentReport,
      messageId,
      conversationId,
      addReport,
      updateReport,
      setCurrentReport,
      generateReportFromPrompt,
      startNewChat,
      setSessionData
    }}>
      {children}
    </ReportContext.Provider>
  );
};

const transformApiResponse = (statementResponse: any, prompt: string) => {
  const columns = statementResponse.manifest.schema.columns;
  const dataArray = statementResponse.result.data_array;
  
  // Transform data array into objects
  const data = dataArray.map((row: any[]) => {
    const obj: Record<string, any> = {};
    columns.forEach((col: any, index: number) => {
      obj[col.name] = row[index];
    });
    return obj;
  });

  return {
    title: `Query Results: ${prompt.substring(0, 50)}...`,
    type: 'Query Results',
    data: data
  };
};

const createReportFromApiData = (prompt: string, apiData: { title: string; type: string; data: Record<string, any>[] }): Omit<Report, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    title: apiData.title,
    description: `Report generated from prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`,
    content: generateContentFromApiData(apiData, prompt),
    status: 'draft',
    type: apiData.type,
    apiData: apiData
  };
};

const generateContentFromApiData = (apiData: { title: string; type: string; data: Record<string, any>[] }, prompt: string): string => {
  return `
# ${apiData.title}

## Executive Summary
Based on your request: "${prompt}"

This report provides detailed insights from the provided data.

## Key Findings
- Total records analyzed: ${apiData.data.length}
- Data type: ${apiData.type}
- Generated insights based on the data patterns

## Data Analysis
The following table shows the complete dataset:

${generateTableFromApiData(apiData.data)}
  `;
};

const generateMockReportContent = (prompt: string, type: string): string => {
  const tableData = generateTableData(type);
  
  return `
# ${type} Report Analysis

## Executive Summary
Based on your request: "${prompt}"

This comprehensive ${type.toLowerCase()} report provides detailed insights and analysis tailored to your specific requirements.

## Key Metrics Table
${tableData}

## Key Findings
- **Performance Metrics**: Analysis shows positive trends across key indicators
- **Cost Analysis**: Detailed breakdown of expenses and optimization opportunities
- **Compliance Status**: All regulatory requirements are being met

## Detailed Analysis
The data indicates strong performance in several areas, with opportunities for optimization in others. Key metrics show:

- 15% improvement in efficiency
- Cost savings of $25,000 annually
- 98% compliance rate
- Employee satisfaction increased by 12%

## Conclusion
The analysis demonstrates positive outcomes based on the data provided.
  `;
};

const generateTableFromApiData = (data: Record<string, any>[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `|${headers.map(() => '----------').join('|')}|`;
  const dataRows = data.map(row => `| ${headers.map(header => row[header] || '').join(' | ')} |`);
  
  return [headerRow, separatorRow, ...dataRows].join('\n');
};

const generateTableData = (type: string): string => {
  switch (type) {
    case 'Payroll':
      return `| Department | Employee Count | Average Salary | Total Cost | Overtime Hours |
|------------|----------------|----------------|------------|----------------|
| Engineering | 45 | $95,000 | $4,275,000 | 1,250 |
| Sales | 32 | $75,000 | $2,400,000 | 890 |
| Marketing | 18 | $70,000 | $1,260,000 | 320 |
| HR | 12 | $65,000 | $780,000 | 150 |
| Finance | 15 | $80,000 | $1,200,000 | 200 |`;

    case 'Benefits':
      return `| Benefit Type | Enrolled Employees | Monthly Cost per Employee | Total Annual Cost | Utilization Rate |
|--------------|-------------------|---------------------------|-------------------|------------------|
| Health Insurance | 110 | $650 | $858,000 | 95% |
| Dental Insurance | 95 | $120 | $136,800 | 85% |
| Vision Insurance | 88 | $45 | $47,520 | 80% |
| 401(k) Match | 102 | $320 | $391,680 | 92% |
| Life Insurance | 122 | $25 | $36,600 | 100% |`;

    case 'Attendance':
      return `| Employee ID | Department | Days Present | Days Absent | PTO Used | Sick Leave | Attendance Rate |
|-------------|------------|--------------|-------------|----------|------------|-----------------|
| EMP001 | Engineering | 220 | 10 | 15 | 5 | 95.7% |
| EMP002 | Sales | 225 | 5 | 12 | 3 | 97.8% |
| EMP003 | Marketing | 215 | 15 | 20 | 8 | 93.5% |
| EMP004 | HR | 230 | 0 | 10 | 0 | 100% |
| EMP005 | Finance | 218 | 12 | 18 | 6 | 94.8% |`;

    case 'Demographics':
      return `| Age Group | Count | Percentage | Gender Distribution | Department Distribution |
|-----------|-------|------------|-------------------|-------------------------|
| 22-30 | 35 | 28.7% | M: 18, F: 17 | Eng: 15, Sales: 12, Other: 8 |
| 31-40 | 45 | 36.9% | M: 25, F: 20 | Eng: 20, Sales: 10, Other: 15 |
| 41-50 | 30 | 24.6% | M: 16, F: 14 | Eng: 8, Sales: 8, Other: 14 |
| 51+ | 12 | 9.8% | M: 7, F: 5 | Eng: 2, Sales: 2, Other: 8 |`;

    default:
      return `| Metric | Q1 | Q2 | Q3 | Q4 | YoY Change |
|--------|----|----|----|----|------------|
| Revenue | $2.1M | $2.3M | $2.5M | $2.8M | +15% |
| Expenses | $1.8M | $1.9M | $2.0M | $2.1M | +8% |
| Profit | $300K | $400K | $500K | $700K | +35% |
| ROI | 12% | 15% | 18% | 22% | +10% |`;
  }
};