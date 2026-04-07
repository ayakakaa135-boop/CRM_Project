import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapListResponse } from '../../api/apiClient';

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/');
      return unwrapListResponse(data);
    },
  });
};

export const useToggleReportShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId) => {
      const { data } = await apiClient.patch(`/reports/${reportId}/share/`, {});
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const usePublicReport = (shareToken) => {
  return useQuery({
    queryKey: ['public-report', shareToken],
    enabled: Boolean(shareToken),
    retry: false,
    queryFn: async () => {
      const { data } = await apiClient.get(`/reports/share/${shareToken}/`);
      return data;
    },
  });
};
