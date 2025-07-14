import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import Modal from '../components/Modal';
import { useBranches } from '../context/BranchContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import examples from 'libphonenumber-js/examples.mobile.json';
import { getExampleNumber } from 'libphonenumber-js';
import { createGlobalStyle } from 'styled-components';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
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

const FullWidthGroup = styled(FormGroup)`
  grid-column: 1 / -1;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: border-color 0.15s;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.15s;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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

// Replace previous PhoneInputGroupGlobal with new styles for split layout
const PhoneInputGroupGlobal = createGlobalStyle`
  .phone-input-group {
    display: flex;
    align-items: stretch;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow: visible !important;
    background: ${({ theme }) => theme.colors.surface};
    height: 3rem;
    transition: box-shadow 0.2s, border-color 0.2s;
    box-shadow: none;
    position: relative;
  }
  .phone-input-group:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .phone-input-group:focus-within {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}88, ${({ theme }) => theme.shadows.glow};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }
  .phone-input-group .country-code-box {
    flex: 0 0 5.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.border};
    cursor: pointer;
    position: relative;
    z-index: 1;
    padding: 0 0.75rem;
    min-width: 0;
  }
  .phone-input-group .country-code-box .dropdown-arrow {
    position: absolute;
    right: 0.5rem;
    pointer-events: none;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
  .phone-input-group .country-code-box select,
  .phone-input-group .country-code-box .dropdown-menu {
    z-index: 9999;
  }
  .phone-input-group .country-code-box img.flag-icon {
    width: 1.25rem;
    height: auto;
    margin-right: 0.5rem;
    display: inline-block;
    vertical-align: middle;
  }
  .phone-input-group .country-code-box .country-code {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
    letter-spacing: 1px;
    margin-right: 0.5rem;
  }
  .phone-input-group .phone-number-box {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    background: transparent;
    min-width: 0;
  }
  .phone-input-group .phone-number-input {
    width: 100%;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1rem;
    padding: 0 0.75rem;
    line-height: 1.5;
    outline: none;
  }
  .phone-input-group .phone-number-input::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  @media (max-width: 480px) {
    .phone-input-group .country-code-box {
      flex: 0 0 4.5rem;
      padding: 0 0.5rem;
    }
    .phone-input-group .phone-number-input {
      font-size: 0.875rem;
      padding: 0 0.5rem;
    }
    .phone-input-group {
      height: 2.5rem;
    }
  }
`;

const PhoneHintFloating = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95em;
  pointer-events: none;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 0.2s;
`;

const PhoneHint = styled.span`
  position: absolute;
  left: 56px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95em;
  pointer-events: none;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 0.2s;
`;

const AddJobPage = () => {
  const navigate = useNavigate();
  const { branchId: branchIdParam } = useParams();
  const location = useLocation();
  const { currentBranch, loading: branchesLoading } = useBranches();
  const branchId = branchIdParam || (currentBranch && currentBranch.id);
  const [cameras, setCameras] = useState([]);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '', // Use a single field for phone
    car_model: '',
    car_year: '',
    entered_at: '',
    camera_id: '',
    issue_description: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCameraInUseModal, setShowCameraInUseModal] = useState(false);
  const [country, setCountry] = useState('');
  const [dialCode, setDialCode] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setCameras([]); // Reset camera list when branch changes
    if (!branchId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get(`/cameras?branchId=${branchId}`)
      .then((res) => setCameras(res.data))
      .catch(() => toast.error('Failed to load cameras'))
      .finally(() => setLoading(false));
  }, [branchId, location.key]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && branchId) {
        api.get(`/cameras?branchId=${branchId}`).then((res) => setCameras(res.data));
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [branchId]);

  if (branchesLoading && !branchIdParam) return <div>Loading branch information...</div>;
  if (!branchId) return <div>No branch selected or available.</div>;
  if (loading) return <div>Loading cameras...</div>;

  const validate = () => {
    const errs = {};
    if (!form.customer_name.trim()) errs.customer_name = 'Customer name is required.';
    if (!form.customer_phone.trim()) errs.customer_phone = 'Customer phone is required.';
    if (!form.car_model.trim()) errs.car_model = 'Car model is required.';
    if (!form.car_year.trim() || !/^[0-9]{4}$/.test(form.car_year)) errs.car_year = 'Valid car year is required.';
    if (!form.entered_at.trim()) errs.entered_at = 'Date & time entered is required.';
    if (!form.issue_description.trim()) errs.issue_description = 'Car issue/description is required.';
    if (!form.camera_id) errs.camera_id = 'Camera assignment is required.';
    return errs;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCountryChange = (value, countryData) => {
    setCountry(countryData.countryCode.toUpperCase());
    setDialCode('+' + countryData.dialCode);
    setPhone('');
    setForm(f => ({ ...f, customer_phone: '' }));
  };

  const handlePhoneChange = (value) => {
    setPhone(value.replace(dialCode, ''));
    setForm(f => ({ ...f, customer_phone: dialCode + value.replace(dialCode, '') }));
  };

  let phoneHint = '';
  if (country) {
    try {
      const example = getExampleNumber(country, examples);
      if (example) {
        phoneHint = example.formatInternational();
      }
    } catch {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      // Parse country code and phone number for backend
      const phoneMatch = form.customer_phone.match(/^(\+\d{1,4})(\d{6,})$/);
      let customer_phone_country_code = '';
      let customer_phone_number = '';
      if (phoneMatch) {
        customer_phone_country_code = phoneMatch[1];
        customer_phone_number = phoneMatch[2];
      } else {
        customer_phone_country_code = '';
        customer_phone_number = form.customer_phone;
      }
      const payload = {
        ...form,
        customer_phone_country_code,
        customer_phone_number,
        branch_id: branchId,
        status: 'in_progress',
      };
      delete payload.customer_phone;
      const res = await api.post('/jobs', payload);
      toast.success('Job added!');
      api.get(`/cameras?branchId=${branchId}`).then((res) => setCameras(res.data));
      navigate(`/dashboard/branch/${branchId}`, { state: { newJob: res.data } });
    } catch (err) {
      if (err.response && err.response.status === 409 && err.response.data && err.response.data.error === 'Camera already in use') {
        toast.error('Sorry, this camera is already in use. Please choose another one.', { duration: 5000, position: 'top-right' });
        setShowCameraInUseModal(true);
      } else {
        toast.error('Failed to add job');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Add New Job</Title>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <FormGroup>
          <Label>Customer Name *</Label>
          <Input name="customer_name" value={form.customer_name} onChange={handleChange} disabled={submitting} required />
          {errors.customer_name && <ErrorMsg>{errors.customer_name}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Customer Phone *</Label>
          <div className="phone-input-group">
            <div className="country-code-box">
              <PhoneInput
                country={country.toLowerCase() || 'sa'}
                value={dialCode}
                onChange={(value, countryData) => handleCountryChange(value, countryData)}
                enableSearch
                disableDropdown={false}
                inputStyle={{ display: 'none' }}
                buttonStyle={{
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  padding: 0,
                  margin: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                dropdownStyle={{ zIndex: 9999 }}
                containerStyle={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  padding: 0,
                  margin: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
            <div className="phone-number-box">
              <input
                type="tel"
                className="phone-number-input"
                aria-label="Customer phone number"
                value={phone}
                onChange={e => handlePhoneChange(e.target.value)}
                placeholder={country && phoneHint ? phoneHint : '+966 51 234 5678'}
                autoComplete="off"
                maxLength={20}
              />
            </div>
          </div>
          {errors.customer_phone && <ErrorMsg>{errors.customer_phone}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Car Model *</Label>
          <Input name="car_model" value={form.car_model} onChange={handleChange} disabled={submitting} required placeholder="e.g., Toyota Camry" />
          {errors.car_model && <ErrorMsg>{errors.car_model}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Car Year *</Label>
          <Input name="car_year" value={form.car_year} onChange={handleChange} disabled={submitting} required placeholder="e.g., 2020" inputMode="numeric" maxLength={4} />
          {errors.car_year && <ErrorMsg>{errors.car_year}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Date & Time Entered *</Label>
          <Input name="entered_at" type="datetime-local" value={form.entered_at} onChange={handleChange} disabled={submitting} required />
          {errors.entered_at && <ErrorMsg>{errors.entered_at}</ErrorMsg>}
        </FormGroup>
        <FormGroup>
          <Label>Assign Camera *</Label>
          <select
            name="camera_id"
            value={form.camera_id}
            onChange={handleChange}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#181c24', color: '#fff' }}
          >
            <option value="">Select a camera</option>
            {cameras.map((camera) => (
              <option 
                key={camera.id} 
                value={camera.id}
              >
                {camera.label} (Available)
              </option>
            ))}
          </select>
          {errors.camera_id && <ErrorMsg>{errors.camera_id}</ErrorMsg>}
        </FormGroup>
        <FullWidthGroup>
          <Label>Car Issue / Description *</Label>
          <Textarea name="issue_description" value={form.issue_description} onChange={handleChange} disabled={submitting} required rows={3} placeholder="Describe the issue..." />
          {errors.issue_description && <ErrorMsg>{errors.issue_description}</ErrorMsg>}
        </FullWidthGroup>
        <FullWidthGroup>
          <ButtonRow>
            <Button type="button" onClick={() => navigate(-1)} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </ButtonRow>
        </FullWidthGroup>
      </Form>
      {showCameraInUseModal && (
        <Modal onClose={() => {
          setShowCameraInUseModal(false);
          // Refresh camera list when modal closes
          api.get(`/cameras?branchId=${branchId}`).then((res) => setCameras(res.data));
        }}>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <h2>Camera Already In Use</h2>
            <p>The selected camera is already assigned to another active job. Please choose a different camera.</p>
            <button onClick={() => setShowCameraInUseModal(false)} style={{ marginTop: 16, padding: '8px 24px', borderRadius: 8, background: '#ff5252', color: '#fff', border: 'none', fontWeight: 600 }}>OK</button>
          </div>
        </Modal>
      )}
      <PhoneInputGroupGlobal />
    </Container>
  );
};

export default AddJobPage; 