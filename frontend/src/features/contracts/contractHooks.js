import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

// Mock Contracts Data
const initialContracts = [
  { 
    id: 1001, 
    companyId: 1, 
    companyName: 'SABIC', 
    title: 'عقد الخدمات السنوية - 2024',
    startDate: '2024-01-01', 
    endDate: '2024-12-31', 
    value: 50000, 
    status: 'active',
    type: 'Annual'
  },
  { 
    id: 1002, 
    companyId: 2, 
    companyName: 'Aramco Services', 
    title: 'اشتراك بوابة تم',
    startDate: '2023-06-01', 
    endDate: '2024-05-31', 
    value: 12000, 
    status: 'active', // Will be calculated as warning soon
    type: 'Subscription'
  },
  { 
    id: 1003, 
    companyId: 3, 
    companyName: 'STC Solutions', 
    title: 'عقد توريد عمالة متخصص',
    startDate: '2023-01-01', 
    endDate: '2023-12-31', 
    value: 85000, 
    status: 'expired',
    type: 'Project'
  },
  {
    id: 1004,
    companyId: 6,
    companyName: 'Mayan Logistics',
    title: 'عقد تشغيل خدمات لوجستية متكاملة',
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    value: 68000,
    status: 'active',
    type: 'Managed Service'
  },
  {
    id: 1005,
    companyId: 8,
    companyName: 'Bayan Facilities',
    title: 'عقد إصدار وتجديد الرخص التشغيلية',
    startDate: '2024-03-10',
    endDate: '2025-03-09',
    value: 37000,
    status: 'active',
    type: 'Annual'
  },
  {
    id: 1006,
    companyId: 9,
    companyName: 'Riyadh Medical Hub',
    title: 'اشتراك منصة متابعة المعاملات الحكومية',
    startDate: '2024-03-01',
    endDate: '2024-11-30',
    value: 24500,
    status: 'active',
    type: 'Subscription'
  },
  {
    id: 1007,
    companyId: 11,
    companyName: 'Atlas Construction Group',
    title: 'عقد مشروع توثيق واعتماد الموردين',
    startDate: '2024-01-15',
    endDate: '2024-09-15',
    value: 92000,
    status: 'active',
    type: 'Project'
  },
  {
    id: 1008,
    companyId: 12,
    companyName: 'Noor Education Systems',
    title: 'اتفاقية اشتراك سنوي وإدارة التراخيص',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    value: 31500,
    status: 'active',
    type: 'Annual'
  },
];

let mockContracts = [...initialContracts];

// Helper to determine status based on dates
const getContractStatus = (endDate) => {
  const diffDays = dayjs(endDate).diff(dayjs(), 'day');
  if (diffDays < 0) return 'expired';
  if (diffDays <= 30) return 'warning';
  return 'active';
};

// Fetch Contracts
const fetchContracts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const processed = mockContracts.map(c => ({
        ...c,
        calculatedStatus: getContractStatus(c.endDate),
        daysRemaining: dayjs(c.endDate).diff(dayjs(), 'day')
      }));
      resolve(processed);
    }, 600);
  });
};

// Create/Renew Contract
const saveContract = async (contract) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newContract = {
        ...contract,
        id: contract.id || Date.now(),
        status: 'active'
      };
      if (contract.id) {
        mockContracts = mockContracts.map(c => c.id === contract.id ? newContract : c);
      } else {
        mockContracts = [newContract, ...mockContracts];
      }
      resolve(newContract);
    }, 800);
  });
};

// Fetch Subscription Summary
const fetchContractStats = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
            totalActiveValue: 147000,
            expiringSoon: 5,
            expiredThisMonth: 2,
            activeCount: 12
        });
      }, 400);
    });
};

// Hooks
export const useContracts = () => {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: fetchContracts,
  });
};

export const useContractStats = () => {
    return useQuery({
      queryKey: ['contractStats'],
      queryFn: fetchContractStats,
    });
};

export const useSaveContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveContract,
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts']);
      queryClient.invalidateQueries(['contractStats']);
    },
  });
};
