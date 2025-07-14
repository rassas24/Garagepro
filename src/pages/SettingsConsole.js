import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiCamera, 
  FiUsers, 
  FiBell, 
  FiShield,
  FiDatabase,
  FiCode,
  FiHelpCircle,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiUpload,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLink,
  FiMail,
  FiSmartphone,
  FiGlobe,
  FiSettings,
  FiBarChart2,
  FiHardDrive,
  FiZap,
  FiCheck,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api'; // Assuming api.js is in the parent directory

const SettingsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const SettingsSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}80;
    transform: translateY(-1px);
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  min-height: 100px;
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Switch = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const SwitchInput = styled.input`
  display: none;
`;

const SwitchSlider = styled.div`
  position: relative;
  width: 48px;
  height: 24px;
  background: ${({ theme, checked }) => checked ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ checked }) => checked ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: ${({ theme }) => theme.colors.textPrimary};
    border-radius: 50%;
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;

const SwitchLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TableHeader = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &.edit {
    background: ${({ theme }) => theme.colors.primary}20;
    color: ${({ theme }) => theme.colors.primary};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary}40;
    }
  }
  
  &.delete {
    background: ${({ theme }) => theme.colors.error}20;
    color: ${({ theme }) => theme.colors.error};
    
    &:hover {
      background: ${({ theme }) => theme.colors.error}40;
    }
  }
`;

const StatusBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  &.active {
    background: ${({ theme }) => theme.colors.success}20;
    color: ${({ theme }) => theme.colors.success};
  }
  
  &.inactive {
    background: ${({ theme }) => theme.colors.error}20;
    color: ${({ theme }) => theme.colors.error};
  }
`;

const StorageCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StorageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StorageName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StorageUsage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  width: ${({ percentage }) => percentage}%;
  transition: width ${({ theme }) => theme.transitions.fast};
`;

const SettingsConsole = () => {
  const [branches, setBranches] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [users, setUsers] = useState([]);
  const [storage, setStorage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/branches'),
      api.get('/cameras'),
      api.get('/users'),
      api.get('/storage'),
    ])
      .then(([branchesRes, camerasRes, usersRes, storageRes]) => {
        setBranches(branchesRes.data);
        setCameras(camerasRes.data);
        setUsers(usersRes.data);
        setStorage(storageRes.data);
      })
      .catch(() => toast.error('Failed to load settings data'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddBranch = () => {
    toast.success('Branch added successfully');
  };

  const handleAddCamera = () => {
    toast.success('Camera added successfully');
  };

  const handleAddUser = () => {
    toast.success('User invited successfully');
  };

  const handleExportData = () => {
    toast.success('Data export started');
  };

  return (
    <SettingsContainer>
      <PageHeader>
        <PageTitle>Settings Console</PageTitle>
        <PageSubtitle>Manage organization settings, users, cameras, and system configuration</PageSubtitle>
      </PageHeader>

      <SettingsGrid>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Organization & Branch Management */}
            <SettingsSection>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>
                    <FiHome size={16} />
                  </SectionIcon>
                  Organization & Branches
                </SectionTitle>
                <AddButton
                  onClick={handleAddBranch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlus size={14} />
                  Add Branch
                </AddButton>
              </SectionHeader>

              <FormGroup>
                <Label>Default Link TTL</Label>
                <Select defaultValue="24">
                  <option value="1">1 hour</option>
                  <option value="24">24 hours</option>
                  <option value="72">72 hours</option>
                  <option value="168">1 week</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Global Watermark Text</Label>
                <Input placeholder="Enter watermark text" defaultValue="GaragePro" />
              </FormGroup>

              <Table>
                <thead>
                  <tr>
                    <TableHeader>Branch</TableHeader>
                    <TableHeader>Address</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr key={branch.id}>
                      <TableCell>{branch.name}</TableCell>
                      <TableCell>{branch.address}</TableCell>
                      <TableCell>
                        <StatusBadge className={branch.status}>
                          {branch.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <ActionButton className="edit">
                            <FiEdit2 size={12} />
                            Edit
                          </ActionButton>
                          <ActionButton className="delete">
                            <FiTrash2 size={12} />
                            Delete
                          </ActionButton>
                        </div>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </SettingsSection>

            {/* Camera & Recording Policies */}
            <SettingsSection>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>
                    <FiCamera size={16} />
                  </SectionIcon>
                  Camera Management
                </SectionTitle>
                <AddButton
                  onClick={handleAddCamera}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlus size={14} />
                  Add Camera
                </AddButton>
              </SectionHeader>

              <FormGroup>
                <Label>Auto-Recording Trigger</Label>
                <Select defaultValue="job_start">
                  <option value="job_start">On Job Start</option>
                  <option value="status_change">On Status Change</option>
                  <option value="manual">Manual Only</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Retention Policy (days)</Label>
                <Input type="number" placeholder="30" defaultValue="30" />
              </FormGroup>

              <Table>
                <thead>
                  <tr>
                    <TableHeader>Camera</TableHeader>
                    <TableHeader>Branch</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {cameras.map((camera) => (
                    <tr key={camera.id}>
                      <TableCell>{camera.name}</TableCell>
                      <TableCell>{camera.branch}</TableCell>
                      <TableCell>
                        <StatusBadge className={camera.status}>
                          {camera.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <ActionButton className="edit">
                            <FiEdit2 size={12} />
                            Edit
                          </ActionButton>
                          <ActionButton className="delete">
                            <FiTrash2 size={12} />
                            Delete
                          </ActionButton>
                        </div>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </SettingsSection>

            {/* User & Role Administration */}
            <SettingsSection>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>
                    <FiUsers size={16} />
                  </SectionIcon>
                  User Management
                </SectionTitle>
                <AddButton
                  onClick={handleAddUser}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlus size={14} />
                  Invite User
                </AddButton>
              </SectionHeader>

              <FormGroup>
                <Label>Password Policy</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Switch>
                    <SwitchLabel>Minimum 8 characters</SwitchLabel>
                    <SwitchInput type="checkbox" defaultChecked />
                    <SwitchSlider checked={true} />
                  </Switch>
                  <Switch>
                    <SwitchLabel>Require uppercase</SwitchLabel>
                    <SwitchInput type="checkbox" defaultChecked />
                    <SwitchSlider checked={true} />
                  </Switch>
                  <Switch>
                    <SwitchLabel>Require numbers</SwitchLabel>
                    <SwitchInput type="checkbox" defaultChecked />
                    <SwitchSlider checked={true} />
                  </Switch>
                </div>
              </FormGroup>

              <Table>
                <thead>
                  <tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Role</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <StatusBadge className={user.status}>
                          {user.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <ActionButton className="edit">
                            <FiEdit2 size={12} />
                            Edit
                          </ActionButton>
                          <ActionButton className="delete">
                            <FiTrash2 size={12} />
                            Delete
                          </ActionButton>
                        </div>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </SettingsSection>

            {/* Notifications & Templates */}
            <SettingsSection>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>
                    <FiBell size={16} />
                  </SectionIcon>
                  Notifications & Templates
                </SectionTitle>
              </SectionHeader>

              <FormGroup>
                <Label>Twilio SMS Configuration</Label>
                <Input placeholder="API Key" type="password" />
                <Input placeholder="Sender ID" style={{ marginTop: '0.5rem' }} />
              </FormGroup>

              <FormGroup>
                <Label>SendGrid Email Configuration</Label>
                <Input placeholder="API Key" type="password" />
                <Input placeholder="From Email" style={{ marginTop: '0.5rem' }} />
              </FormGroup>

              <FormGroup>
                <Label>SMS Template</Label>
                <Textarea 
                  placeholder="Your garage job link: {{link}} (expires in {{ttl}})."
                  defaultValue="Your garage job link: {{link}} (expires in {{ttl}})."
                />
              </FormGroup>

              <FormGroup>
                <Label>Email Template</Label>
                <Textarea 
                  placeholder="HTML email template..."
                  defaultValue="<h2>Your Garage Job</h2><p>Click here to view: {{link}}</p>"
                />
              </FormGroup>
            </SettingsSection>

            {/* Security & Compliance */}
            <SettingsSection>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>
                    <FiShield size={16} />
                  </SectionIcon>
                  Security & Compliance
                </SectionTitle>
              </SectionHeader>

              <FormGroup>
                <Label>MFA Enforcement</Label>
                <Switch>
                  <SwitchLabel>Require 2FA for Admins</SwitchLabel>
                  <SwitchInput type="checkbox" defaultChecked />
                  <SwitchSlider checked={true} />
                </Switch>
              </FormGroup>

              <FormGroup>
                <Label>IP Whitelist (CIDR)</Label>
                <Input placeholder="192.168.1.0/24" />
              </FormGroup>

              <FormGroup>
                <Label>Data Retention</Label>
                <Select defaultValue="30">
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </Select>
              </FormGroup>

              <ActionButton
                className="edit"
                onClick={handleExportData}
                style={{ marginTop: '1rem' }}
              >
                <FiDownload size={14} />
                Export Audit Logs
              </ActionButton>
            </SettingsSection>

            {/* Storage & Analytics */}
            <SettingsSection>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>
                    <FiDatabase size={16} />
                  </SectionIcon>
                  Storage & Analytics
                </SectionTitle>
              </SectionHeader>

              {storage.map((item, index) => (
                <StorageCard key={index}>
                  <StorageInfo>
                    <StorageName>{item.branch}</StorageName>
                    <StorageUsage>{item.used}/{item.total} {item.unit}</StorageUsage>
                  </StorageInfo>
                  <ProgressBar>
                    <ProgressFill percentage={(item.used / item.total) * 100} />
                  </ProgressBar>
                </StorageCard>
              ))}

              <FormGroup>
                <Label>Report Schedule</Label>
                <Select defaultValue="weekly">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </Select>
              </FormGroup>

              <ActionButton
                className="edit"
                onClick={handleExportData}
                style={{ marginTop: '1rem' }}
              >
                <FiDownload size={14} />
                Export Analytics
              </ActionButton>
            </SettingsSection>

            {/* Integrations & API */}
            <SettingsSection>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>
                    <FiCode size={16} />
                  </SectionIcon>
                  Integrations & API
                </SectionTitle>
              </SectionHeader>

              <FormGroup>
                <Label>API Key</Label>
                <div style={{ position: 'relative' }}>
                  <Input 
                    type="password" 
                    placeholder="Generate new API key"
                    defaultValue="sk_live_1234567890abcdef"
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#8A8A8A',
                      cursor: 'pointer',
                    }}
                  >
                    <FiEye size={16} />
                  </button>
                </div>
              </FormGroup>

              <FormGroup>
                <Label>Webhook URL</Label>
                <Input placeholder="https://your-app.com/webhook" />
              </FormGroup>

              <FormGroup>
                <Label>Webhook Secret</Label>
                <Input type="password" placeholder="Enter webhook secret" />
              </FormGroup>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <ActionButton className="edit">
                  <FiLink size={12} />
                  View API Docs
                </ActionButton>
                <ActionButton className="edit">
                  <FiDownload size={12} />
                  Download SDK
                </ActionButton>
              </div>
            </SettingsSection>

            {/* Help & About */}
            <SettingsSection>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>
                    <FiHelpCircle size={16} />
                  </SectionIcon>
                  Help & About
                </SectionTitle>
              </SectionHeader>

              <FormGroup>
                <Label>Support Contact</Label>
                <Input placeholder="support@garagepro.com" defaultValue="support@garagepro.com" />
              </FormGroup>

              <FormGroup>
                <Label>Support Hours</Label>
                <Input placeholder="9 AM - 6 PM PST" defaultValue="9 AM - 6 PM PST" />
              </FormGroup>

              <div style={{ marginTop: '1rem' }}>
                <div style={{ color: '#8A8A8A', fontSize: '0.875rem' }}>
                  <div>Version: 1.0.0</div>
                  <div>Build: 2024.01.15</div>
                  <div>Last Updated: January 15, 2024</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <ActionButton className="edit">
                  <FiHelpCircle size={12} />
                  Documentation
                </ActionButton>
                <ActionButton className="edit">
                  <FiDownload size={12} />
                  Release Notes
                </ActionButton>
              </div>
            </SettingsSection>
          </>
        )}
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default SettingsConsole; 