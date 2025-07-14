import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiBarChart2, 
  FiDownload, 
  FiCalendar, 
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiFilter
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';

const ReportsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const ExportButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, variant }) => {
    if (variant === 'success') return theme.colors.success + '20';
    if (variant === 'warning') return theme.colors.warning + '20';
    if (variant === 'error') return theme.colors.error + '20';
    return theme.colors.primary + '20';
  }};
  color: ${({ theme, variant }) => {
    if (variant === 'success') return theme.colors.success;
    if (variant === 'warning') return theme.colors.warning;
    if (variant === 'error') return theme.colors.error;
    return theme.colors.primary;
  }};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  &.positive {
    color: ${({ theme }) => theme.colors.success};
  }
  
  &.negative {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ReportCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ReportHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ReportTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Table = styled.div`
  width: 100%;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

const StatusBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  
  &.active {
    background: ${({ theme }) => theme.colors.success}20;
    color: ${({ theme }) => theme.colors.success};
  }
  
  &.expired {
    background: ${({ theme }) => theme.colors.error}20;
    color: ${({ theme }) => theme.colors.error};
  }
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(0, 179, 255, 0.1) 50%, transparent 70%);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [stats, setStats] = useState([]);
  const [shareLinks, setShareLinks] = useState([]);
  const [usageStats, setUsageStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/reports/stats?period=' + selectedPeriod),
      api.get('/reports/share-links?period=' + selectedPeriod),
      api.get('/reports/usage?period=' + selectedPeriod),
    ])
      .then(([statsRes, shareLinksRes, usageStatsRes]) => {
        setStats(statsRes.data);
        setShareLinks(shareLinksRes.data);
        setUsageStats(usageStatsRes.data);
      })
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, [selectedPeriod]);

  const handleExport = (format) => {
    toast.success(`Exporting report as ${format.toUpperCase()}`);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    toast.success(`Updated period to ${period}`);
  };

  return (
    <ReportsContainer>
      <PageHeader>
        <PageTitle>Reports & Analytics</PageTitle>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <FilterButton onClick={() => handlePeriodChange('7d')}>
            <FiFilter size={16} />
            7 Days
          </FilterButton>
          <FilterButton onClick={() => handlePeriodChange('30d')}>
            <FiFilter size={16} />
            30 Days
          </FilterButton>
          <FilterButton onClick={() => handlePeriodChange('90d')}>
            <FiFilter size={16} />
            90 Days
          </FilterButton>
          
          <ExportButton
            onClick={() => handleExport('csv')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload size={16} />
            Export CSV
          </ExportButton>
        </div>
      </PageHeader>

      <StatsGrid>
        {loading ? (
          <div>Loading...</div>
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon; // Create a component from the function
            return (
              <StatCard
                key={stat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <StatHeader>
                  <StatIcon variant={stat.variant}>
                    <Icon size={24} />
                  </StatIcon>
                  <StatChange className={stat.changeType}>
                    {stat.changeType === 'positive' ? (
                      <FiTrendingUp size={16} />
                    ) : (
                      <FiTrendingDown size={16} />
                    )}
                    {stat.change}
                  </StatChange>
                </StatHeader>
                
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            );
          })
        )}
      </StatsGrid>

      <ReportsGrid>
        <ReportCard>
          <ReportHeader>
            <ReportTitle>Share Link Analytics</ReportTitle>
            <FilterButton>
              <FiEye size={16} />
              View All
            </FilterButton>
          </ReportHeader>
          
          <Table>
            <TableHeader>
              <div>Customer</div>
              <div>Vehicle</div>
              <div>Clicks</div>
              <div>Status</div>
            </TableHeader>
            
            {loading ? (
              <div>Loading share links...</div>
            ) : (
              shareLinks.map((link) => (
                <TableRow key={link.id}>
                  <div>{link.customer}</div>
                  <div>{link.vehicle}</div>
                  <div>{link.clicks}</div>
                  <div>
                    <StatusBadge className={link.status}>
                      {link.status}
                    </StatusBadge>
                  </div>
                </TableRow>
              ))
            )}
          </Table>
        </ReportCard>

        <ReportCard>
          <ReportHeader>
            <ReportTitle>Usage Statistics</ReportTitle>
            <FilterButton>
              <FiBarChart2 size={16} />
              Details
            </FilterButton>
          </ReportHeader>
          
          <Table>
            <TableHeader>
              <div>Metric</div>
              <div>Value</div>
              <div>Change</div>
              <div>Trend</div>
            </TableHeader>
            
            {loading ? (
              <div>Loading usage stats...</div>
            ) : (
              usageStats.map((stat) => (
                <TableRow key={stat.id}>
                  <div>{stat.metric}</div>
                  <div>{stat.value}</div>
                  <div>{stat.change}</div>
                  <div>
                    <StatChange className={stat.changeType}>
                      {stat.changeType === 'positive' ? (
                        <FiTrendingUp size={16} />
                      ) : (
                        <FiTrendingDown size={16} />
                      )}
                      {stat.change}
                    </StatChange>
                  </div>
                </TableRow>
              ))
            )}
          </Table>
        </ReportCard>
      </ReportsGrid>

      <div style={{ marginTop: '2rem' }}>
        <ReportCard>
          <ReportHeader>
            <ReportTitle>System Performance</ReportTitle>
            <FilterButton>
              <FiCalendar size={16} />
              Last 30 Days
            </FilterButton>
          </ReportHeader>
          
          <ChartPlaceholder>
            📊 Performance Chart Placeholder
          </ChartPlaceholder>
        </ReportCard>
      </div>
    </ReportsContainer>
  );
};

export default Reports; 