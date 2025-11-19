"use client";

import { useState, useTransition } from 'react';
import { summarizeTransactions } from '@/ai/flows/summarize-transactions';
import { useToast } from "@/hooks/use-toast";
import { mockTransactions, mockTransactionText } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Scale, Wallet, Loader2, Sparkles } from 'lucide-react';

export function Dashboard() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState('');
  const [transactionInput, setTransactionInput] = useState(mockTransactionText);

  const stats = {
    totalIncome: mockTransactions.filter(t => t.type === 'Payment Received').reduce((acc, t) => acc + t.amount, 0),
    totalSpent: mockTransactions.filter(t => t.type !== 'Payment Received').reduce((acc, t) => acc + t.amount, 0),
    balance: mockTransactions.length > 0 ? mockTransactions[0].balance : 0,
  };
  stats.netFlow = stats.totalIncome - stats.totalSpent;

  const handleSummarize = () => {
    startTransition(async () => {
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
            <div className={`text-2xl font-bold ${stats.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>GHS {stats.netFlow.toFixed(2)}</div>
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

      <div className="grid gap-6 lg:grid-cols-2">
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
              AI-Powered Summary
            </CardTitle>
            <CardDescription>Paste your SMS data below or use the demo data to get an instant summary of your financial activity.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Textarea
              placeholder="Paste your transaction data here..."
              value={transactionInput}
              onChange={(e) => setTransactionInput(e.target.value)}
              className="min-h-[150px] text-xs"
            />
             <Button onClick={handleSummarize} disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Summary'
              )}
            </Button>
            {summary && (
               <div className="mt-4 rounded-lg border bg-secondary/50 p-4">
                <h4 className="mb-2 font-headline font-semibold">Summary:</h4>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
