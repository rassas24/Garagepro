import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiBell, 
  FiMonitor, 
  FiShield,
  FiDatabase,
  FiHelpCircle,
  FiSettings,
  FiArrowRight,
  FiGlobe,
  FiSmartphone,
  FiMail
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const SettingsCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
`;

const CardContent = styled.div``;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
  line-height: 1.5;
`;

const CardAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const AdminCard = styled(SettingsCard)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}10, ${({ theme }) => theme.colors.secondary}10);
  border-color: ${({ theme }) => theme.colors.primary}30;
  
  &:hover {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20, ${({ theme }) => theme.colors.secondary}20);
  }
`;

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
  };

  const handleAdminConsole = () => {
    navigate('/settings-console');
  };

  const settingsCards = [
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Manage your personal information, avatar, and account preferences.',
      icon: FiUser,
      route: '/profile',
      color: '#00D4AA'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure email, SMS, and in-app notification preferences.',
      icon: FiBell,
      route: '/settings/notifications',
      color: '#FF6B6B'
    },
    {
      id: 'display',
      title: 'Display & Theme',
      description: 'Customize your interface appearance and theme preferences.',
      icon: FiMonitor,
      route: '/settings/display',
      color: '#4ECDC4'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Manage password, two-factor authentication, and session settings.',
      icon: FiShield,
      route: '/settings/security',
      color: '#45B7D1'
    },
    {
      id: 'data',
      title: 'Data & Privacy',
      description: 'Download your data, manage privacy settings, and account deletion.',
      icon: FiDatabase,
      route: '/settings/data',
      color: '#96CEB4'
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Access documentation, contact support, and view system information.',
      icon: FiHelpCircle,
      route: '/settings/help',
      color: '#FFEAA7'
    }
  ];

  return (
    <SettingsContainer>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account preferences and system configuration</PageSubtitle>
      </PageHeader>

      <SettingsGrid>
        {settingsCards.map((card) => (
          <SettingsCard
            key={card.id}
            onClick={() => handleCardClick(card.route)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CardHeader>
              <CardIcon style={{ background: `${card.color}20`, color: card.color }}>
                <card.icon size={24} />
              </CardIcon>
            </CardHeader>
            <CardContent>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardContent>
            <CardAction>
              <ActionText>Manage</ActionText>
              <FiArrowRight size={16} color="#00D4AA" />
            </CardAction>
          </SettingsCard>
        ))}

        {user?.role === 'admin' && (
          <AdminCard
            onClick={handleAdminConsole}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CardHeader>
              <CardIcon style={{ background: '#00D4AA20', color: '#00D4AA' }}>
                <FiSettings size={24} />
              </CardIcon>
            </CardHeader>
            <CardContent>
              <CardTitle>Settings Console</CardTitle>
              <CardDescription>
                Advanced system configuration for administrators. Manage branches, cameras, users, and organization settings.
              </CardDescription>
            </CardContent>
            <CardAction>
              <ActionText>Access Console</ActionText>
              <FiArrowRight size={16} color="#00D4AA" />
            </CardAction>
          </AdminCard>
        )}
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings; 