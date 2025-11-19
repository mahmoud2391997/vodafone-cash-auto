'use server';

/**
 * @fileOverview Summarizes Vodafone Cash transactions on a monthly and annual basis.
 *
 * - summarizeTransactions - A function that takes transaction data and returns a summary.
 */

import {ai} from '@/ai/genkit';
import type { SummarizeTransactionsInput, SummarizeTransactionsOutput } from '@/ai/schemas/transactions';
import { SummarizeTransactionsInputSchema, SummarizeTransactionsOutputSchema } from '@/ai/schemas/transactions';


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
  {{{transactions}}}

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
