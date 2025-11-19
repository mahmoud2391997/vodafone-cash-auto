'use server';

/**
 * @fileOverview Generates a daily financial report from transaction data.
 *
 * - generateDailyReport - A function that takes transaction data and returns a structured daily report.
 */

import {ai} from '@/ai/genkit';
import type { GenerateDailyReportInput, GenerateDailyReportOutput } from '@/ai/schemas/transactions';
import { GenerateDailyReportInputSchema, GenerateDailyReportOutputSchema } from '@/ai/schemas/transactions';

export async function generateDailyReport(input: GenerateDailyReportInput): Promise<GenerateDailyReportOutput> {
  return generateDailyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyReportPrompt',
  input: {schema: GenerateDailyReportInputSchema},
  output: {schema: GenerateDailyReportOutputSchema},
  prompt: `You are a financial assistant. Analyze the provided transactions for the most recent day and generate a daily report in Arabic.

  - The currency is 'جنيه'.
  - The monthly limit is 150,000.
  - Calculate the totals and counts for 'transfer' (sent payments, withdrawals, airtime) and 'receive' (received payments) operations.
  - 'reportDate' should be the most recent date from the transactions.
  - 'monthlyTotal' is the cumulative total for the month. Assume the provided transactions are all for the same month.
  - Calculate 'achievementPercentage' as (monthlyTotal / monthlyLimit) * 100.
  - The output should be JSON only.

  Transactions:
  {{{transactions}}}
  `,
});


const generateDailyReportFlow = ai.defineFlow(
  {
    name: 'generateDailyReportFlow',
    inputSchema: GenerateDailyReportInputSchema,
    outputSchema: GenerateDailyReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
