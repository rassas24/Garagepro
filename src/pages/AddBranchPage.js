import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useBranches } from '../context/BranchContext';

const Container = styled.div`
  max-width: 480px;
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
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const FileInput = styled.input`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  background: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.surfaceHover};
  color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.textPrimary : theme.colors.textSecondary};
  border: 1px solid ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.border};
  transition: all 0.15s;
  &:hover {
    background: ${({ theme, variant }) =>
      variant === 'primary' ? theme.colors.primary + 'CC' : theme.colors.surface};
  }
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.95em;
`;

const AddBranchPage = () => {
  const navigate = useNavigate();
  const { addBranch } = useBranches();
  const [form, setForm] = useState({
    name: '',
    address: '',
    timezone: '',
    phone: '',
    logo: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney'
  ];

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Branch name is required.';
    if (!form.address.trim()) errs.address = 'Address is required.';
    if (!form.timezone) errs.timezone = 'Time zone is required.';
    if (!form.phone.trim()) errs.phone = 'Contact phone is required.';
    // Optionally: validate phone format
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      setForm((f) => ({ ...f, logo: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      const phoneRegex = /^\+(\d{1,3})\s?(\d{6,14})$/;
      const phoneMatch = form.phone.match(phoneRegex);
      
      const payload = {
        name: form.name,
        address: form.address,
        time_zone: form.timezone,
        contact_phone_country_code: phoneMatch ? `+${phoneMatch[1]}` : '',
        contact_phone_number: phoneMatch ? phoneMatch[2] : form.phone,
        // logo: form.logo, // handle file upload separately if needed
      };
      const { data: newBranch } = await api.post('/branches', payload);
      addBranch(newBranch);
      toast.success('Branch created');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to create branch');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Add New Branch</Title>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <FormGroup>
          <Label>Branch Name *</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={submitting}
            required
          />
          {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Address *</Label>
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={submitting}
            required
          />
          {errors.address && <ErrorMsg>{errors.address}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Time Zone *</Label>
          <Select
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            disabled={submitting}
            required
          >
            <option value="">Select time zone</option>
            {timezones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </Select>
          {errors.timezone && <ErrorMsg>{errors.timezone}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Contact Phone *</Label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={submitting}
            required
          />
          {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Logo / Thumbnail (optional)</Label>
          <FileInput
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={submitting}
          />
        </FormGroup>
        <ButtonRow>
          <Button type="button" onClick={() => navigate(-1)} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={submitting}>Save</Button>
        </ButtonRow>
      </Form>
    </Container>
  );
};

export default AddBranchPage; 