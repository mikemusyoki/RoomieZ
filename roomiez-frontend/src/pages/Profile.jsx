import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, Edit2, Check, X, ArrowLeft, DollarSign, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', budgetMin: '', budgetMax: '', roomType: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      setUserData(res.data.user);
      setProfileData(res.data.profile);
      setQuestionnaireData(res.data.questionnaire);
      if (res.data.profile) {
        setEditForm({
          name: res.data.profile.name || '',
          phone: res.data.profile.phone || '',
          budgetMin: res.data.profile.budgetMin || '',
          budgetMax: res.data.profile.budgetMax || '',
          roomType: res.data.profile.roomType || '',
        });
      }
    } catch (err) {
      toast.error('Failed to load profile');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!editForm.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    try {
      const res = await api.post('/profile/update', {
        name: editForm.name,
        phone: editForm.phone,
        budgetMin: Number(editForm.budgetMin),
        budgetMax: Number(editForm.budgetMax),
        roomType: editForm.roomType,
      });
      setProfileData(res.data);
      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <main id="main-content" role="main">
        <div style={styles.container}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <ArrowLeft size={20} /> Back
          </button>

          <div style={styles.profileCard}>
            {/* Header */}
            <div style={styles.profileHeader}>
              <div style={styles.profileAvatar}>
                {profileData?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
                  {profileData?.name || 'Unknown'}
                </h1>
                <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>{userData?.email}</p>
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                  <Edit2 size={18} /> Edit
                </button>
              )}
            </div>

            {/* Profile Details or Edit Form */}
            {!isEditing ? (
              <div style={styles.profileDetails}>
                <DetailItem icon={<User size={20} />} label="Full Name" value={profileData?.name || '—'} />
                <DetailItem icon={<Mail size={20} />} label="Email" value={userData?.email || '—'} />
                <DetailItem icon={<DollarSign size={20} />} label="Budget Range" value={profileData ? `KSh ${profileData.budgetMin} - ${profileData.budgetMax}/mo` : '—'} />
                <DetailItem icon={<Home size={20} />} label="Room Type" value={profileData?.roomType ? profileData.roomType.charAt(0).toUpperCase() + profileData.roomType.slice(1) : '—'} />
              </div>
            ) : (
              <div style={styles.editForm}>
                <FormField label="Full Name" name="name" value={editForm.name} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} />
                <FormField label="Phone" name="phone" value={editForm.phone} onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))} />
                <FormField label="Budget Min (KSh)" name="budgetMin" type="number" value={editForm.budgetMin} onChange={(e) => setEditForm(prev => ({ ...prev, budgetMin: e.target.value }))} />
                <FormField label="Budget Max (KSh)" name="budgetMax" type="number" value={editForm.budgetMax} onChange={(e) => setEditForm(prev => ({ ...prev, budgetMax: e.target.value }))} />
                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>Room Type</label>
                  <select value={editForm.roomType} onChange={(e) => setEditForm(prev => ({ ...prev, roomType: e.target.value }))}
                    style={{ ...styles.input, padding: '12px' }}>
                    <option value="">Select...</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="apartment">Apartment</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button onClick={handleSaveChanges} style={styles.saveButton}><Check size={18} /> Save</button>
                  <button onClick={() => setIsEditing(false)} style={styles.cancelButton}><X size={18} /> Cancel</button>
                </div>
              </div>
            )}

            {/* Questionnaire Status */}
            <div style={styles.statusBox}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700', color: '#4A7C7E', textTransform: 'uppercase' }}>Questionnaire Status</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
                {questionnaireData ? '✅ Completed' : '❌ Not completed'}
              </p>
              {!questionnaireData && (
                <button onClick={() => navigate('/questionnaire')}
                  style={{ padding: '8px 20px', background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  Complete Now
                </button>
              )}
            </div>

            {/* Actions */}
            <div style={styles.quickActions}>
              <button onClick={() => navigate('/matches')} style={styles.actionButton}>👥 View Matches</button>
              <button onClick={() => navigate('/questionnaire')} style={styles.actionButton}>📋 Update Preferences</button>
              <button onClick={handleLogout} style={{ ...styles.actionButton, background: '#FFE8E8', borderColor: '#FF6B6B', color: '#FF6B6B' }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', background: '#f9f9f9', borderRadius: '12px' }}>
    <div style={{ color: '#FF6B6B' }}>{icon}</div>
    <div>
      <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600', color: '#999', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>{value}</p>
    </div>
  </div>
);

const FormField = ({ label, name, value, onChange, type = 'text' }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange}
      style={{ width: '100%', padding: '12px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
  </div>
);

const styles = {
  pageContainer: { minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f5 0%, #fffdf5 100%)' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '40px 20px' },
  backButton: { display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#666', marginBottom: '20px' },
  profileCard: { background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '24px', paddingBottom: '32px', borderBottom: '1px solid #e5e5e5', marginBottom: '32px' },
  profileAvatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B 0%, #4A7C7E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', color: 'white', flexShrink: 0 },
  editButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  profileDetails: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' },
  editForm: { marginBottom: '32px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' },
  input: { width: '100%', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  saveButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#4A7C7E', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  cancelButton: { display: 'flex', alignItems: 'center', gap: '8px', background: '#e5e5e5', color: '#666', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  statusBox: { padding: '20px', background: '#f0f9f8', border: '1px solid #4A7C7E', borderRadius: '12px', marginBottom: '32px' },
  quickActions: { display: 'flex', flexDirection: 'column', gap: '12px' },
  actionButton: { padding: '12px 20px', background: 'white', border: '2px solid #FF6B6B', color: '#FF6B6B', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
};

export default Profile;
