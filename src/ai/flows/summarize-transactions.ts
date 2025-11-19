// Summarize Vodafone Cash Transactions

'use server';

/**
 * @fileOverview Summarizes Vodafone Cash transactions on a monthly and annual basis.
 *
 * - summarizeTransactions - A function that takes transaction data and returns a summary.
 * - SummarizeTransactionsInput - The input type for the summarizeTransactions function.
 * - SummarizeTransactionsOutput - The return type for the summarizeTransactions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTransactionsInputSchema = z.object({
  transactions: z
    .string()
    .describe("A string containing Vodafone Cash transaction data. Each transaction should include the date, type, amount, and any relevant details."),
  month: z.string().optional().describe('The month for which to summarize transactions.  If omitted, summarize all transactions.'),
  year: z.string().optional().describe('The year for which to summarize transactions. If omitted, summarize all transactions.'),
});
export type SummarizeTransactionsInput = z.infer<typeof SummarizeTransactionsInputSchema>;

const SummarizeTransactionsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the Vodafone Cash transactions for the specified period.'),
});
export type SummarizeTransactionsOutput = z.infer<typeof SummarizeTransactionsOutputSchema>;

export async function summarizeTransactions(input: SummarizeTransactionsInput): Promise<SummarizeTransactionsOutput> {
  return summarizeTransactionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTransactionsPrompt',
  input: {schema: SummarizeTransactionsInputSchema},
  output: {schema: SummarizeTransactionsOutputSchema},
  prompt: `You are a financial assistant tasked with summarizing Vodafone Cash transactions.

  Summarize the following transactions, highlighting key spending and income patterns. Be as concise as possible.

  Consider the month and year if provided, and only summarize transactions from that period. If the month and year is not provided, summarize all transactions.

  Transactions:
  {{transactions}}

  Month: {{month}}
  Year: {{year}}`,
});

const summarizeTransactionsFlow = ai.defineFlow(
  {
    name: 'summarizeTransactionsFlow',
    inputSchema: SummarizeTransactionsInputSchema,
    outputSchema: SummarizeTransactionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
