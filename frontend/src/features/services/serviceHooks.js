import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock Services Data
const initialServices = [
  { 
    id: 101, 
    companyName: 'SABIC', 
    serviceType: 'Commercial Registration Renewal', 
    status: 'completed', 
    govId: 'CR-10293848', 
    progress: 100,
    requestDate: '2024-03-01' 
  },
  { 
    id: 102, 
    companyName: 'Aramco Services', 
    serviceType: 'Industrial License Update', 
    status: 'under_review', 
    govId: 'IL-55667788', 
    progress: 45,
    requestDate: '2024-03-25' 
  },
  { 
    id: 103, 
    companyName: 'STC Solutions', 
    serviceType: 'Chamber of Commerce Cert', 
    status: 'pending_payment', 
    govId: 'CC-99001122', 
    progress: 70,
    requestDate: '2024-03-28' 
  },
  { 
    id: 104, 
    companyName: 'Almarai', 
    serviceType: 'Baladiya License Issuance', 
    status: 'new', 
    govId: 'BL-88776655', 
    progress: 10,
    requestDate: '2024-03-30' 
  },
  {
    id: 105,
    companyName: 'Mayan Logistics',
    serviceType: 'Municipality Permit Renewal',
    status: 'completed',
    govId: 'MP-44556677',
    progress: 100,
    requestDate: '2024-03-12'
  },
  {
    id: 106,
    companyName: 'Bayan Facilities',
    serviceType: 'Labor Office File Update',
    status: 'under_review',
    govId: 'LO-22334455',
    progress: 60,
    requestDate: '2024-03-21'
  },
  {
    id: 107,
    companyName: 'Riyadh Medical Hub',
    serviceType: 'Health License Coordination',
    status: 'completed',
    govId: 'HL-77889911',
    progress: 100,
    requestDate: '2024-03-11'
  },
  {
    id: 108,
    companyName: 'Atlas Construction Group',
    serviceType: 'Vendor Registration Package',
    status: 'pending_payment',
    govId: 'VR-66778899',
    progress: 80,
    requestDate: '2024-03-29'
  },
  {
    id: 109,
    companyName: 'Noor Education Systems',
    serviceType: 'Education Permit Expansion',
    status: 'new',
    govId: 'EP-55664422',
    progress: 15,
    requestDate: '2024-04-01'
  },
];

let mockServices = [...initialServices];

// Fetch Services
const fetchServices = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockServices]), 700);
  });
};

// Create Service Request
const createServiceRequest = async (newRequest) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const created = { 
        ...newRequest, 
        id: Date.now(), 
        status: 'new', 
        progress: 10, 
        requestDate: new Date().toISOString().split('T')[0] 
      };
      mockServices = [created, ...mockServices];
      resolve(created);
    }, 800);
  });
};

// Hooks
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });
};
