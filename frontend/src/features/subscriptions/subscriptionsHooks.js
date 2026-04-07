import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapListResponse } from '../../api/apiClient';

export const useSubscriptions = () => {
    return useQuery({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            const { data } = await apiClient.get('/contracts/subscriptions/');
            return unwrapListResponse(data);
        },
    });
};

export const useCreateSubscription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newSubscription) => {
            const { data } = await apiClient.post('/contracts/subscriptions/', newSubscription);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
    });
};

export const useUpdateSubscription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updatedData }) => {
            const { data } = await apiClient.put(`/contracts/subscriptions/${id}/`, updatedData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
    });
};
