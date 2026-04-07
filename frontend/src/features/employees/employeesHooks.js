import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapListResponse } from '../../api/apiClient';

// --- Commissions ---
export const useCommissions = () => {
    return useQuery({
        queryKey: ['commissions'],
        queryFn: async () => {
            const { data } = await apiClient.get('/employees/commissions/');
            return unwrapListResponse(data);
        },
    });
};

export const useCreateCommission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCommission) => {
            const { data } = await apiClient.post('/employees/commissions/', newCommission);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['commissions'] });
        },
    });
};

// --- Employee Requests ---
export const useEmployeeRequests = () => {
    return useQuery({
        queryKey: ['employeeRequests'],
        queryFn: async () => {
            const { data } = await apiClient.get('/employees/requests/');
            return unwrapListResponse(data);
        },
    });
};

export const useReviewRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }) => {
            const { data } = await apiClient.patch(`/employees/requests/${id}/review/`, { status });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employeeRequests'] });
        },
    });
};

// --- User Management (Staff) ---
export const useStaff = () => {
    return useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            const { data } = await apiClient.get('/auth/users/');
            return unwrapListResponse(data);
        },
    });
};

export const useCreateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newStaff) => {
            const payload = {
                ...newStaff,
                password2: newStaff.password,
            };
            const { data } = await apiClient.post('/auth/users/', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
        },
    });
};

export const useUpdateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            const { data } = await apiClient.patch(`/auth/users/${id}/`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
        },
    });
};

export const useResetStaffPassword = () => {
    return useMutation({
        mutationFn: async ({ id, new_password, confirm_password }) => {
            const { data } = await apiClient.patch(`/auth/users/${id}/set-password/`, {
                new_password,
                confirm_password,
            });
            return data;
        },
    });
};

export const useDeleteStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await apiClient.delete(`/auth/users/${id}/`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
        },
    });
};
