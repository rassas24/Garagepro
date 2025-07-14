import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useBranches } from '../context/BranchContext';

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FullWidthGroup = styled.div`
  grid-column: 1 / -1;
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

const AddCameraPage = () => {
  const navigate = useNavigate();
  const { branches, loading: loadingBranches } = useBranches();
  const [form, setForm] = useState({
    name: '',
    ip: '',
    port: '',
    protocol: 'rtsp',
    url: '',
    username: '',
    password: '',
    branch: '',
    bay: '',
    model: '',
    notes: '',
    login_method: 'userpass',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);


  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Camera name is required.';
    if (!form.ip.trim()) {
      errs.ip = 'Camera IP is required.';
    } else if (!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(form.ip)) {
      errs.ip = 'Enter a valid IPv4 address.';
    }
    if (!form.branch) errs.branch = 'Branch assignment is required.';
    if (!form.protocol) errs.protocol = 'Protocol is required.';
    if (form.login_method === 'userpass') {
      if (!form.username.trim()) errs.username = 'Username is required.';
      if (!form.password.trim()) errs.password = 'Password is required.';
    } else if (form.login_method === 'url') {
      if (!form.port.trim()) {
        errs.port = 'Port is required.';
      } else if (!/^\d+$/.test(form.port) || Number(form.port) < 1 || Number(form.port) > 65535) {
        errs.port = 'Enter a valid port (1-65535).';
      }
      if (!form.url.trim()) {
        errs.url = 'Stream URL is required.';
      } else if (!/^https?:\/\//.test(form.url) && !/^rtsp:/.test(form.url)) {
        errs.url = 'Enter a valid RTSP/HLS/HTTP URL.';
      }
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleLoginMethodChange = (e) => {
    const method = e.target.value;
    setForm((f) => ({
      ...f,
      login_method: method,
      // Reset fields not used by the other method
      username: method === 'userpass' ? f.username : '',
      password: method === 'userpass' ? f.password : '',
      url: method === 'url' ? f.url : '',
      port: method === 'url' ? f.port : '',
      // protocol is always kept
    }));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      const payload = {
        label: form.name,
        ip_address: form.ip,
        branch_id: Number(form.branch),
        bay_zone: form.bay,
        model: form.model,
        notes: form.notes,
        login_method: form.login_method,
        protocol: form.protocol.toUpperCase(),
      };
      if (form.login_method === 'userpass') {
        payload.username = form.username;
        payload.password_encrypted = form.password;
      } else if (form.login_method === 'url') {
        payload.port = Number(form.port);
        payload.stream_url = form.url;
      }
      await api.post('/cameras', payload);
      toast.success('Camera added');
      navigate('/cameras');
    } catch (err) {
      toast.error('Failed to add camera');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Add New Camera</Title>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <FormGroup>
          <Label>Login Method *</Label>
          <Select
            name="login_method"
            value={form.login_method}
            onChange={handleLoginMethodChange}
            disabled={submitting}
            required
          >
            <option value="userpass">Username & Password</option>
            <option value="url">Stream URL (RTSP/HTTP/HLS)</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Camera Name/Label *</Label>
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
          <Label>Camera IP *</Label>
          <Input
            name="ip"
            value={form.ip}
            onChange={handleChange}
            disabled={submitting}
            required
            placeholder="e.g., 192.168.1.100"
            inputMode="decimal"
          />
          {errors.ip && <ErrorMsg>{errors.ip}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Protocol *</Label>
          <Select
            name="protocol"
            value={form.protocol}
            onChange={handleChange}
            disabled={submitting}
            required
          >
            <option value="rtsp">RTSP</option>
            <option value="http">HTTP</option>
            <option value="https">HTTPS</option>
            <option value="hls">HLS</option>
            <option value="onvif">ONVIF</option>
          </Select>
          {errors.protocol && <ErrorMsg>{errors.protocol}</ErrorMsg>}
        </FormGroup>
        {form.login_method === 'url' && (
          <>
            <FormGroup>
              <Label>Port *</Label>
              <Input
                name="port"
                value={form.port}
                onChange={handleChange}
                disabled={submitting}
                required
                placeholder="e.g., 554"
                inputMode="numeric"
              />
              {errors.port && <ErrorMsg>{errors.port}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label>Stream URL (RTSP/HLS/HTTP) *</Label>
              <Input
                name="url"
                value={form.url}
                onChange={handleChange}
                disabled={submitting}
                required
                placeholder="rtsp://... or http(s)://..."
              />
              {errors.url && <ErrorMsg>{errors.url}</ErrorMsg>}
            </FormGroup>
          </>
        )}
        {form.login_method === 'userpass' && (
          <>
            <FormGroup>
              <Label>Username *</Label>
              <Input
                name="username"
                value={form.username}
                onChange={handleChange}
                disabled={submitting}
                required
                autoComplete="username"
              />
              {errors.username && <ErrorMsg>{errors.username}</ErrorMsg>}
            </FormGroup>
            <FormGroup>
              <Label>Password *</Label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                disabled={submitting}
                required
                autoComplete="current-password"
              />
              {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
            </FormGroup>
          </>
        )}
        <FormGroup>
          <Label>Branch Assignment *</Label>
          <Select
            name="branch"
            value={form.branch}
            onChange={handleChange}
            disabled={submitting || loadingBranches}
            required
          >
            <option value="">{loadingBranches ? 'Loading branches...' : 'Select branch'}</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </Select>
          {errors.branch && <ErrorMsg>{errors.branch}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Bay/Zone</Label>
          <Input
            name="bay"
            value={form.bay}
            onChange={handleChange}
            disabled={submitting}
          />
        </FormGroup>
        <FormGroup>
          <Label>Camera Model/Type</Label>
          <Input
            name="model"
            value={form.model}
            onChange={handleChange}
            disabled={submitting}
            placeholder="e.g., Hikvision DS-2CD2042WD-I"
          />
        </FormGroup>
        <FormGroup>
          <Label>Notes</Label>
          <Input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Any additional info..."
          />
        </FormGroup>
        <FullWidthGroup>
          <ButtonRow>
            <Button type="button" onClick={() => navigate(-1)} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>Save</Button>
          </ButtonRow>
        </FullWidthGroup>
      </Form>
    </Container>
  );
};

export default AddCameraPage; 