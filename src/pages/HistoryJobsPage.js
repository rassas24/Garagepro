import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import api from '../api';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 1100px;
  margin: 40px auto;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
`;

const Th = styled.th`
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  padding: 1rem 0.75rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  text-align: left;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BackButton = styled.button`
  margin-bottom: 2rem;
  padding: 0.5rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: ${({ theme }) => theme.colors.primary}20;
  }
`;

const HistoryJobsPage = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = branchId ? `/jobs/history?branchId=${branchId}` : '/jobs/history';
    api.get(url)
      .then((res) => setJobs(res.data))
      .catch(() => toast.error('Failed to load jobs history'))
      .finally(() => setLoading(false));
  }, [branchId]);

  return (
    <Container>
      <BackButton onClick={() => navigate(branchId ? `/dashboard/branch/${branchId}` : '/dashboard')}>
        <FiChevronLeft /> Back to Dashboard
      </BackButton>
      <Title>Completed Jobs History</Title>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Customer Name</Th>
              <Th>Phone</Th>
              <Th>Car Model</Th>
              <Th>Car Year</Th>
              <Th>Date/Time</Th>
              <Th>Issue</Th>
              <Th>Assigned Camera</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr><Td colSpan={8} style={{ textAlign: 'center', color: '#888' }}>No completed jobs yet.</Td></tr>
            ) : jobs.map((job) => (
                <tr key={job.id}>
                  <Td>{job.customer_name}</Td>
                  <Td>{job.customer_phone_country_code} {job.customer_phone_number}</Td>
                  <Td>{job.car_model}</Td>
                  <Td>{job.car_year}</Td>
                  <Td>{job.entered_at}</Td>
                  <Td>{job.issue_description}</Td>
                  <Td>{job.camera_id}</Td>
                  <Td>{job.status}</Td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default HistoryJobsPage; 