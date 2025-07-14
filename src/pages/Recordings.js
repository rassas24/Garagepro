import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiPlay, 
  FiPause, 
  FiDownload, 
  FiShare2, 
  FiTrash2,
  FiCalendar,
  FiClock,
  FiUser,
  FiTruck,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';

const RecordingsContainer = styled.div`
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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  max-width: 400px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: none;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  
  &:focus {
    outline: none;
  }
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

const RecordingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const RecordingCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const VideoPreview = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
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

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.colors.primary}CC;
  border: none;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 2;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const Duration = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface}CC;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const RecordingInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const RecordingHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const RecordingTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  flex: 1;
`;

const RecordingDate = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: right;
`;

const RecordingDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, variant }) => {
    if (variant === 'danger') return theme.colors.error + '20';
    if (variant === 'success') return theme.colors.success + '20';
    return theme.colors.surfaceHover;
  }};
  border: 1px solid ${({ theme, variant }) => {
    if (variant === 'danger') return theme.colors.error;
    if (variant === 'success') return theme.colors.success;
    return theme.colors.border;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, variant }) => {
    if (variant === 'danger') return theme.colors.error;
    if (variant === 'success') return theme.colors.success;
    return theme.colors.textSecondary;
  }};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.textMuted};
  
  .icon {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    opacity: 0.5;
  }
  
  .title {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const Recordings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/recordings')
      .then(res => setRecordings(res.data))
      .catch(() => toast.error('Failed to load recordings'))
      .finally(() => setLoading(false));
  }, []);

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recording.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recording.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || recording.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handlePlay = (recording) => {
    toast.success(`Playing: ${recording.title}`);
  };

  const handleDownload = (recording) => {
    toast.success(`Downloading: ${recording.title}`);
  };

  const handleShare = (recording) => {
    const shareUrl = `https://garagepro.com/view/${recording.id}-${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
  };

  const handleDelete = (recording) => {
    toast.success(`Deleted: ${recording.title}`);
  };

  return (
    <RecordingsContainer>
      <PageHeader>
        <PageTitle>Recordings</PageTitle>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SearchBar>
            <FiSearch size={20} color="#8A8A8A" />
            <SearchInput
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <FilterButton onClick={() => setSelectedFilter('all')}>
            <FiFilter size={16} />
            All
          </FilterButton>
        </div>
      </PageHeader>

      {loading ? (
        <div>Loading...</div>
      ) : filteredRecordings.length === 0 ? (
        <EmptyState>
          <div className="icon">📹</div>
          <div className="title">No recordings found</div>
          <div>Try adjusting your search or filter criteria</div>
        </EmptyState>
      ) : (
        <RecordingsGrid>
          {filteredRecordings.map((recording) => (
            <RecordingCard
              key={recording.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <VideoPreview>
                <PlayButton onClick={() => handlePlay(recording)}>
                  <FiPlay size={24} />
                </PlayButton>
                <Duration>{recording.duration}</Duration>
              </VideoPreview>
              
              <RecordingInfo>
                <RecordingHeader>
                  <RecordingTitle>{recording.title}</RecordingTitle>
                  <RecordingDate>
                    <FiCalendar size={14} />
                    {new Date(recording.date).toLocaleDateString()}
                  </RecordingDate>
                </RecordingHeader>
                
                <RecordingDetails>
                  <DetailItem>
                    <FiUser size={14} />
                    {recording.customer}
                  </DetailItem>
                  <DetailItem>
                    <FiTruck size={14} />
                    {recording.vehicle}
                  </DetailItem>
                  <DetailItem>
                    <FiClock size={14} />
                    {recording.duration} • {recording.size}
                  </DetailItem>
                </RecordingDetails>
                
                <ActionButtons>
                  <ActionButton
                    onClick={() => handleDownload(recording)}
                    variant="success"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiDownload size={16} />
                    Download
                  </ActionButton>
                  
                  <ActionButton
                    onClick={() => handleShare(recording)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiShare2 size={16} />
                    Share
                  </ActionButton>
                  
                  <ActionButton
                    onClick={() => handleDelete(recording)}
                    variant="danger"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </ActionButton>
                </ActionButtons>
              </RecordingInfo>
            </RecordingCard>
          ))}
        </RecordingsGrid>
      )}
    </RecordingsContainer>
  );
};

export default Recordings; 