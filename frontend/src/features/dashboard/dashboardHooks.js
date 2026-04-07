import { useQuery } from '@tanstack/react-query';

// Simulated API call for dashboard stats
const fetchDashboardStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalCompanies: 148,
        companiesGrowth: 18,
        activeContracts: 94,
        outstandingPayments: 68200, // SAR
        pendingRequests: 19,
        revenueData: [
          { month: 'Jan', revenue: 4500 },
          { month: 'Feb', revenue: 5200 },
          { month: 'Mar', revenue: 4800 },
          { month: 'Apr', revenue: 6100 },
          { month: 'May', revenue: 5900 },
          { month: 'Jun', revenue: 7200 },
          { month: 'Jul', revenue: 8500 },
          { month: 'Aug', revenue: 9100 },
          { month: 'Sep', revenue: 10400 },
        ],
        serviceDistribution: [
          { type: 'Commercial Site License', value: 34 },
          { type: 'E-Commerce Auth', value: 18 },
          { type: 'Government Tendering', value: 16 },
          { type: 'Municipality & Baladiya', value: 14 },
          { type: 'HR & Labor Services', value: 11 },
          { type: 'Other', value: 7 },
        ],
        recentCompanies: [
          { id: 1, name: 'SABIC', industry: 'Petrochemicals', date: '2024-03-20' },
          { id: 2, name: 'Aramco Services', industry: 'Oil & Gas', date: '2024-03-18' },
          { id: 3, name: 'STC Solutions', industry: 'Technology', date: '2024-03-15' },
          { id: 4, name: 'Maaden', industry: 'Mining', date: '2024-03-10' },
          { id: 5, name: 'Almarai', industry: 'Food & Dairy', date: '2024-03-05' },
          { id: 6, name: 'Mayan Logistics', industry: 'Supply Chain', date: '2024-04-02' },
          { id: 7, name: 'Riyadh Medical Hub', industry: 'Healthcare', date: '2024-04-01' },
        ],
        spotlight: {
          title: 'لوحة تنفيذية جاهزة للعرض',
          subtitle: 'مؤشرات العملاء والعقود والتحصيل والطلبات في واجهة واحدة مصممة لإقناع العملاء بسرعة.',
          portfolioScore: 94,
          successRate: 88,
        },
        highlights: [
          { label: 'طلبات أنجزت هذا الأسبوع', value: 27, tone: 'green' },
          { label: 'عملاء تحت المتابعة المباشرة', value: 12, tone: 'blue' },
          { label: 'عقود بحاجة لتجديد قريب', value: 7, tone: 'gold' },
        ],
        topServices: [
          { id: 1, name: 'تجديد السجل التجاري', volume: 42, growth: '+15%' },
          { id: 2, name: 'إصدار وتجديد الرخص البلدية', volume: 31, growth: '+11%' },
          { id: 3, name: 'إدارة ملفات الموارد البشرية', volume: 24, growth: '+8%' },
          { id: 4, name: 'تقارير الامتثال والتشغيل', volume: 19, growth: '+18%' },
        ],
      });
    }, 800);
  });
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });
};
