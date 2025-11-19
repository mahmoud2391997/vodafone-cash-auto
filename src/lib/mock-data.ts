export type Transaction = {
  id: string;
  date: string;
  type: 'Payment Received' | 'Payment Sent' | 'Withdrawal' | 'Airtime';
  amount: number;
  balance: number;
  phone?: string;
};

export const mockTransactions: Transaction[] = [
  { id: 'FT240728.1234.567890', date: '2024-07-28', type: 'Payment Received', amount: 50.00, balance: 250.75, phone: '233200000000' },
  { id: 'FT240727.1122.334455', date: '2024-07-27', type: 'Payment Sent', amount: 25.50, balance: 200.75, phone: '233551112233' },
  { id: 'FT240726.1010.987654', date: '2024-07-26', type: 'Withdrawal', amount: 100.00, balance: 226.25, phone: 'Agent' },
  { id: 'FT240725.0987.654321', date: '2024-07-25', type: 'Airtime', amount: 10.00, balance: 326.25 },
  { id: 'FT240724.5555.666777', date: '2024-07-24', type: 'Payment Received', amount: 150.00, balance: 336.25, phone: '233249876543' },
  { id: 'FT240723.4321.876543', date: '2024-07-23', type: 'Payment Sent', amount: 75.00, balance: 186.25, phone: '233501234567' },
];

export const mockTransactionText = mockTransactions
  .map(t => 
    `Transaction ID: ${t.id}, Date: ${t.date}, Type: ${t.type}, Amount: GHS ${t.amount.toFixed(2)}, ${t.phone ? (t.type === 'Payment Received' ? 'From' : 'To') + ': ' + t.phone + ', ' : ''}New Balance: GHS ${t.balance.toFixed(2)}.`
  )
  .join('\n');
