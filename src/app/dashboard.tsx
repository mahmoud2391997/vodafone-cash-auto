"use client";

import { useState, useTransition } from 'react';
import { summarizeTransactions } from '@/ai/flows/summarize-transactions';
import { generateDailyReport } from '@/ai/flows/generate-daily-report';
import type { GenerateDailyReportOutput } from '@/ai/schemas/transactions';
import { useToast } from "@/hooks/use-toast";
import { mockTransactions, mockTransactionText } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Scale, Wallet, Loader2, Sparkles, Newspaper, Bell, Target, TrendingUp as TrendingUpIcon, DollarSign, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function Dashboard() {
  const { toast } = useToast();
  const [summarizePending, startSummarizeTransition] = useTransition();
  const [reportPending, startReportTransition] = useTransition();
  const [summary, setSummary] = useState('');
  const [dailyReport, setDailyReport] = useState<GenerateDailyReportOutput | null>(null);
  const [transactionInput, setTransactionInput] = useState(mockTransactionText);

  const stats = {
    totalIncome: mockTransactions.filter(t => t.type === 'Payment Received').reduce((acc, t) => acc + t.amount, 0),
    totalSpent: mockTransactions.filter(t => t.type !== 'Payment Received').reduce((acc, t) => acc + t.amount, 0),
    balance: mockTransactions.length > 0 ? mockTransactions[0].balance : 0,
  };
  const netFlow = stats.totalIncome - stats.totalSpent;
  
  const isPending = summarizePending || reportPending;

  const handleSummarize = () => {
    startSummarizeTransition(async () => {
      setSummary('');
      try {
        if (!transactionInput.trim()) {
           toast({
            variant: "destructive",
            title: "Error",
            description: "Transaction data cannot be empty.",
          });
          return;
        }
        const result = await summarizeTransactions({ transactions: transactionInput });
        setSummary(result.summary);
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to generate summary. Please try again later.",
        });
      }
    });
  };

  const handleGenerateReport = () => {
    startReportTransition(async () => {
      setDailyReport(null);
      try {
        if (!transactionInput.trim()) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Transaction data cannot be empty.",
          });
          return;
        }
        const result = await generateDailyReport({ transactions: transactionInput });
        
        const reportDate = new Date(result.reportDate);
        const formattedDate = format(reportDate, 'eeee d MMMM yyyy', { locale: ar });

        setDailyReport({...result, reportDate: formattedDate });

      } catch (e) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to generate daily report. Please try again later.",
        });
      }
    });
  };
  
  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'Payment Received': return 'default';
      case 'Payment Sent': return 'destructive';
      case 'Withdrawal': return 'outline';
      case 'Airtime': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>GHS {netFlow.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Income minus expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">As of last transaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Here's a list of your recent transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>
                       <Badge variant={getBadgeVariant(tx.type)}>{tx.type}</Badge>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${tx.type === 'Payment Received' ? 'text-green-600' : ''}`}>
                      {tx.type === 'Payment Received' ? '+' : '-'}GHS {tx.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              AI-Powered Tools
            </CardTitle>
            <CardDescription>Paste your SMS data below or use the demo data to get an instant summary of your financial activity.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Textarea
              placeholder="Paste your transaction data here..."
              value={transactionInput}
              onChange={(e) => setTransactionInput(e.target.value)}
              className="min-h-[200px] text-xs"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSummarize} disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {summarizePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Summary'
                )}
              </Button>
              <Button onClick={handleGenerateReport} disabled={isPending} className="w-full">
                {reportPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                  <Newspaper className="mr-2 h-4 w-4" />
                  Daily Report
                  </>
                )}
              </Button>
            </div>
            {summary && (
               <div className="mt-4 rounded-lg border bg-secondary/50 p-4">
                <h4 className="mb-2 font-headline font-semibold">Summary:</h4>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                Daily Report
              </CardTitle>
              <CardDescription>Your AI-generated daily transaction report.</CardDescription>
            </CardHeader>
            <CardContent>
              {reportPending && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {dailyReport && (
                <div className="space-y-4 text-sm font-arabic" dir="rtl">
                  <div className="text-center font-bold text-lg mb-4">
                    <p>
                      التقرير اليومي - {dailyReport.reportDate}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-base flex items-center">
                      <Send className="ml-2 h-4 w-4" /> عمليات التحويل:
                    </p>
                    <p> العدد: {dailyReport.transferCount} عملية</p>
                    <p> الإجمالي: {dailyReport.transferTotal.toLocaleString('en-US')} جنيه</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-base flex items-center">
                      <DollarSign className="ml-2 h-4 w-4" /> عمليات الاستلام:
                    </p>
                    <p> العدد: {dailyReport.receiveCount} عملية</p>
                    <p> الإجمالي: {dailyReport.receiveTotal.toLocaleString('en-US')} جنيه</p>
                  </div>
                  
                  <div className="border-t my-4"></div>

                  <div className="space-y-2">
                     <p className="flex items-center"><TrendingUpIcon className="ml-2 h-4 w-4" /> إجمالي اليوم: {dailyReport.dailyTotal.toLocaleString('en-US')} جنيه</p>
                     <p className="flex items-center"><Target className="ml-2 h-4 w-4" /> الإجمالي الشهري: {dailyReport.monthlyTotal.toLocaleString('en-US')} جنيه</p>
                     <p className="flex items-center"><TrendingUpIcon className="ml-2 h-4 w-4" /> نسبة الإنجاز: {dailyReport.achievementPercentage.toFixed(1)}% من الحد الشهري</p>
                  </div>

                  <div className="border-t my-4"></div>

                  <div className="flex items-center text-yellow-600">
                    <Bell className="ml-2 h-4 w-4" />
                    <p>تذكير: الحد الشهري {dailyReport.monthlyLimit.toLocaleString('en-US')} جنيه</p>
                  </div>
                </div>
              )}
              {!dailyReport && !reportPending && (
                <div className="text-center text-muted-foreground p-8">
                  <p>Generate a report to see it here.</p>
                </div>
              )}
            </CardContent>
          </Card>

      </div>
    </div>
  );
}
