import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock Data for initial development
const initialCompanies = [
  { id: 1, name: 'SABIC', industry: 'Petrochemicals', contractStatus: 'active', contactEmail: 'info@sabic.com', createdAt: '2024-01-10' },
  { id: 2, name: 'Aramco Services', industry: 'Oil & Gas', contractStatus: 'active', contactEmail: 'serv@aramco.com', createdAt: '2024-02-15' },
  { id: 3, name: 'STC Solutions', industry: 'Technology', contractStatus: 'pending', contactEmail: 'sales@stc.com', createdAt: '2024-03-01' },
  { id: 4, name: 'Maaden', industry: 'Mining', contractStatus: 'expired', contactEmail: 'contact@maaden.com.sa', createdAt: '2023-11-20' },
  { id: 5, name: 'Almarai', industry: 'Food & Dairy', contractStatus: 'active', contactEmail: 'hr@almarai.com', createdAt: '2023-12-05' },
  { id: 6, name: 'Mayan Logistics', industry: 'Supply Chain', contractStatus: 'active', contactEmail: 'ops@mayanlogistics.sa', createdAt: '2024-01-28' },
  { id: 7, name: 'Neom Retail Labs', industry: 'Retail Innovation', contractStatus: 'active', contactEmail: 'hello@neomretail.sa', createdAt: '2024-02-07' },
  { id: 8, name: 'Bayan Facilities', industry: 'Facilities Management', contractStatus: 'pending', contactEmail: 'support@bayanfacilities.sa', createdAt: '2024-02-20' },
  { id: 9, name: 'Riyadh Medical Hub', industry: 'Healthcare', contractStatus: 'active', contactEmail: 'contracts@rmhub.sa', createdAt: '2024-03-09' },
  { id: 10, name: 'Desert Bloom Events', industry: 'Events & Exhibitions', contractStatus: 'expired', contactEmail: 'projects@desertbloom.sa', createdAt: '2023-10-17' },
  { id: 11, name: 'Atlas Construction Group', industry: 'Construction', contractStatus: 'active', contactEmail: 'bids@atlascg.sa', createdAt: '2024-03-18' },
  { id: 12, name: 'Noor Education Systems', industry: 'Education Technology', contractStatus: 'pending', contactEmail: 'admin@nooredu.sa', createdAt: '2024-03-25' },
];

let mockCompanies = [...initialCompanies];

// Fetch Companies List
const fetchCompanies = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockCompanies]), 600);
  });
};

// Create Company
const createCompany = async (newCompany) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const created = { ...newCompany, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
      mockCompanies = [created, ...mockCompanies];
      resolve(created);
    }, 800);
  });
};

// Update Company
const updateCompany = async (updatedCompany) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockCompanies = mockCompanies.map(c => c.id === updatedCompany.id ? { ...c, ...updatedCompany } : c);
      resolve(updatedCompany);
    }, 800);
  });
};

// Delete Company
const deleteCompany = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockCompanies = mockCompanies.filter(c => c.id !== id);
      resolve(id);
    }, 500);
  });
};

// Hooks
export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};
