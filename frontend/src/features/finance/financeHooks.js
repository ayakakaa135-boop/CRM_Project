import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';

// Mock Financial Transactions
const initialTransactions = [
  { id: 501, companyId: 1, companyName: 'SABIC', type: 'receipt', amount: 5000, vat: 750, total: 5750, method: 'Bank Transfer', date: '2024-03-10', status: 'paid' },
  { id: 502, companyId: 2, companyName: 'Aramco Services', type: 'payment', amount: 1200, vat: 180, total: 1380, method: 'Cash', date: '2024-03-12', status: 'paid' },
  { id: 503, companyId: 3, companyName: 'STC Solutions', type: 'receipt', amount: 15000, vat: 2250, total: 17250, method: 'Mada', date: '2024-03-20', status: 'pending' },
  { id: 504, companyId: 6, companyName: 'Mayan Logistics', type: 'receipt', amount: 9800, vat: 1470, total: 11270, method: 'Bank Transfer', date: '2024-03-22', status: 'paid' },
  { id: 505, companyId: 8, companyName: 'Bayan Facilities', type: 'payment', amount: 2650, vat: 397.5, total: 3047.5, method: 'Cheque', date: '2024-03-24', status: 'paid' },
  { id: 506, companyId: 9, companyName: 'Riyadh Medical Hub', type: 'receipt', amount: 21000, vat: 3150, total: 24150, method: 'Bank Transfer', date: '2024-03-26', status: 'paid' },
  { id: 507, companyId: 11, companyName: 'Atlas Construction Group', type: 'receipt', amount: 13250, vat: 1987.5, total: 15237.5, method: 'Cheque', date: '2024-03-27', status: 'paid' },
  { id: 508, companyId: 12, companyName: 'Noor Education Systems', type: 'payment', amount: 3200, vat: 480, total: 3680, method: 'Bank Transfer', date: '2024-03-30', status: 'pending' },
];

let mockTransactions = [...initialTransactions];

// Fetch Transactions
const fetchTransactions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockTransactions]), 600);
  });
};

// Create Transaction (Receipt/Payment)
const createTransaction = async (newTx) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const amount = parseFloat(newTx.amount);
      const vat = amount * 0.15; // Standard Saudi VAT
      const created = { 
        ...newTx, 
        id: Date.now(), 
        vat, 
        total: amount + vat,
        status: 'paid',
        date: new Date().toISOString().split('T')[0] 
      };
      mockTransactions = [created, ...mockTransactions];
      resolve(created);
    }, 800);
  });
};

// Customer Wallet Stats (Mock)
const fetchWalletStats = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
            totalIncome: 155000,
            totalExpenses: 42000,
            pendingReceivables: 12500,
            vatCollected: 23250
        });
      }, 500);
    });
  };

// Hooks
export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });
};

export const useWalletStats = () => {
    return useQuery({
      queryKey: ['walletStats'],
      queryFn: fetchWalletStats,
    });
  };

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['walletStats'] });
    },
  });
};

export const useCreateReceiptVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post('/finance/receipts/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
    },
  });
};

export const useCreatePaymentVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post('/finance/payments/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};
