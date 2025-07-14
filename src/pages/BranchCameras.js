// Branch-specific camera management page. Shows all cameras for the current branch and their assignment status.
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiCamera, FiEdit2, FiTrash2, FiPlus, FiMapPin, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useBranches } from '../context/BranchContext';

const CamerasContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const AddButton = styled.button`
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

const CamerasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CameraCard = styled.div`
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

const CameraPreview = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const CameraIcon = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 3rem;
  z-index: 1;
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.surface}CC;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  z-index: 2;
`;

const CameraInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CameraHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CameraName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const CameraActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
  &.danger:hover {
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const CameraDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const BranchCameras = () => {
  const { currentBranch, loading: branchesLoading } = useBranches();
  const [cameras, setCameras] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentBranch) return;
    setLoading(true);
    Promise.all([
      api.get(`/cameras?branchId=${currentBranch.id}`),
      api.get(`/jobs?branchId=${currentBranch.id}`)
    ])
      .then(([camerasRes, jobsRes]) => {
        setCameras(camerasRes.data);
        setJobs(jobsRes.data);
      })
      .catch(() => toast.error('Failed to load cameras or jobs'))
      .finally(() => setLoading(false));
  }, [currentBranch]);

  if (branchesLoading || loading) return <div>Loading...</div>;

  return (
    <CamerasContainer>
      <PageHeader>
        <PageTitle>Branch Cameras</PageTitle>
        <AddButton onClick={() => navigate('/cameras/new')}>
          <FiPlus size={16} />
          Add Camera
        </AddButton>
      </PageHeader>
      <CamerasGrid>
        {cameras.map((camera) => {
          const assignedJob = jobs.find(j => j.camera_id === camera.id && j.status !== 'completed');
          return (
            <CameraCard key={camera.id}>
              <CameraPreview>
                <CameraIcon>
                  <FiCamera />
                </CameraIcon>
                <StatusIndicator>
                  {assignedJob ? 'In Use' : 'Available'}
                </StatusIndicator>
              </CameraPreview>
              <CameraInfo>
                <CameraHeader>
                  <CameraName>{camera.label}</CameraName>
                  <CameraActions>
                    <ActionButton onClick={() => toast.info('Edit camera coming soon!')}>
                      <FiEdit2 size={16} />
                    </ActionButton>
                    <ActionButton className="danger" onClick={() => toast.info('Delete camera coming soon!')}>
                      <FiTrash2 size={16} />
                    </ActionButton>
                  </CameraActions>
                </CameraHeader>
                <CameraDetails>
                  <DetailItem>
                    <FiMapPin size={14} />
                    {currentBranch?.name}
                  </DetailItem>
                  <DetailItem>
                    <FiActivity size={14} />
                    {camera.stream_url}
                  </DetailItem>
                  <DetailItem>
                    {assignedJob ? (
                      <span style={{ color: 'red' }}>Assigned to job #{assignedJob.id}</span>
                    ) : (
                      <span style={{ color: 'green' }}>Available</span>
                    )}
                  </DetailItem>
                </CameraDetails>
              </CameraInfo>
            </CameraCard>
          );
        })}
      </CamerasGrid>
    </CamerasContainer>
  );
};

export default BranchCameras; 