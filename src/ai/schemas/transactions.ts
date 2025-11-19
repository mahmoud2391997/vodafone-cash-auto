import {z} from 'genkit';

/**
 * @fileOverview Zod schemas for transaction-related AI flows.
 */

export const SummarizeTransactionsInputSchema = z.object({
  transactions: z
    .string()
    .describe("A string containing Vodafone Cash transaction data. Each transaction should include the date, type, amount, and any relevant details."),
  month: z.string().optional().describe('The month for which to summarize transactions.  If omitted, summarize all transactions.'),
  year: z.string().optional().describe('The year for which to summarize transactions. If omitted, summarize all transactions.'),
});
export type SummarizeTransactionsInput = z.infer<typeof SummarizeTransactionsInputSchema>;

export const SummarizeTransactionsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the Vodafone Cash transactions for the specified period.'),
});
export type SummarizeTransactionsOutput = z.infer<typeof SummarizeTransactionsOutputSchema>;


export const GenerateDailyReportInputSchema = z.object({
  transactions: z.string().describe('A string containing transaction data. Each transaction should include the date, type, and amount.'),
});
export type GenerateDailyReportInput = z.infer<typeof GenerateDailyReportInputSchema>;

export const GenerateDailyReportOutputSchema = z.object({
  reportDate: z.string().describe('The date of the report in "Day, D MMMM YYYY" format.'),
  transferCount: z.number().describe('The total number of outgoing transactions (sent/withdrawal/airtime).'),
  transferTotal: z.number().describe('The total amount of outgoing transactions.'),
  receiveCount: z.number().describe('The total number of incoming transactions (received).'),
  receiveTotal: z.number().describe('The total amount of incoming transactions.'),
  dailyTotal: z.number().describe('The sum of all transaction amounts for the day.'),
  monthlyTotal: z.number().describe('The total for the month so far based on the transactions provided.'),
  monthlyLimit: z.number().describe('A fixed monthly limit, which should be set to 150000.'),
  achievementPercentage: z.number().describe('The percentage of the monthly total relative to the monthly limit.'),
});
export type GenerateDailyReportOutput = z.infer<typeof GenerateDailyReportOutputSchema>;
