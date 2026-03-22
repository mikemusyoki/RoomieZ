import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, MessageCircle, ClipboardList, RefreshCw, LogOut, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({ users: 0, matches: 0, messages: 0, questionnaires: 0 });
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email !== 'admin@ku.ac.ke') {
      toast.error('Admin access only');
      navigate('/');
      return;
    }
    loadAll();
  }, [navigate]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, matchesRes, msgsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/matches'),
        api.get('/admin/messages'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setMatches(matchesRes.data);
      setMessages(msgsRes.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out');
    navigate('/');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Admin-only header - no regular navbar */}
      <nav style={styles.adminNav}>
        <div style={styles.adminNavContainer}>
          <div style={styles.adminNavLeft}>
            <Shield size={22} color="#FF6B6B" />
            <span style={styles.adminNavTitle}>RoomieZ Admin</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>Admin Dashboard</h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage all RoomieZ users, matches, and messages</p>
          </div>
          <button onClick={loadAll} style={styles.refreshBtn}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <StatCard icon={<Users size={24} />} label="Total Users" value={stats.users} color="#FF6B6B" />
          <StatCard icon={<ClipboardList size={24} />} label="Questionnaires" value={stats.questionnaires} color="#4A7C7E" />
          <StatCard icon={<Heart size={24} />} label="Matches" value={stats.matches} color="#FF6B6B" />
          <StatCard icon={<MessageCircle size={24} />} label="Messages" value={stats.messages} color="#4A7C7E" />
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['users', 'matches', 'messages'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={styles.tableContainer}>
          {loading ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</p>
          ) : activeTab === 'users' ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Budget</th>
                  <th style={styles.th}>Room Type</th>
                  <th style={styles.th}>Questionnaire</th>
                  <th style={styles.th}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={styles.tr}>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.profile?.name || '—'}</td>
                    <td style={styles.td}>{u.profile ? `KSh ${u.profile.budgetMin}-${u.profile.budgetMax}` : '—'}</td>
                    <td style={styles.td}>{u.profile?.roomType || '—'}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: u.hasQuestionnaire ? '#e8f5e9' : '#fce4ec', color: u.hasQuestionnaire ? '#2e7d32' : '#c62828' }}>
                        {u.hasQuestionnaire ? '✅ Done' : '❌ No'}
                      </span>
                    </td>
                    <td style={styles.td}>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#999' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          ) : activeTab === 'matches' ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User 1</th>
                  <th style={styles.th}>User 2</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Likes</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(m => (
                  <tr key={m._id} style={styles.tr}>
                    <td style={styles.td}>{m.users?.[0]?.email || '—'}</td>
                    <td style={styles.td}>{m.users?.[1]?.email || '—'}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: m.status === 'matched' ? '#e8f5e9' : '#fff3e0', color: m.status === 'matched' ? '#2e7d32' : '#e65100' }}>
                        {m.status}
                      </span>
                    </td>
                    <td style={styles.td}>{m.likes?.length || 0} / 2</td>
                    <td style={styles.td}>{formatDate(m.createdAt)}</td>
                  </tr>
                ))}
                {matches.length === 0 && (
                  <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#999' }}>No matches found</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Sender</th>
                  <th style={styles.th}>Message</th>
                  <th style={styles.th}>Match ID</th>
                  <th style={styles.th}>Sent At</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(m => (
                  <tr key={m._id} style={styles.tr}>
                    <td style={styles.td}>{m.senderId?.email || '—'}</td>
                    <td style={{ ...styles.td, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.text}</td>
                    <td style={{ ...styles.td, fontSize: '11px', fontFamily: 'monospace' }}>{m.matchId}</td>
                    <td style={styles.td}>{formatDate(m.createdAt)}</td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr><td colSpan="4" style={{ ...styles.td, textAlign: 'center', color: '#999' }}>No messages found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIcon, background: `${color}15`, color }}>{icon}</div>
    <div>
      <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>{value}</p>
      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#999' }}>{label}</p>
    </div>
  </div>
);

const styles = {
  adminNav: { background: '#1a1a1a', borderBottom: '3px solid #FF6B6B', position: 'sticky', top: 0, zIndex: 100 },
  adminNavContainer: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' },
  adminNavLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  adminNavTitle: { color: 'white', fontSize: '18px', fontWeight: '700' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'transparent', border: '1px solid #555', color: '#ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#4A7C7E', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' },
  statCard: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' },
  statIcon: { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tabs: { display: 'flex', gap: '4px', marginBottom: '20px', background: 'white', padding: '4px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tab: { flex: 1, padding: '12px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#666', transition: 'all 0.2s' },
  activeTab: { background: '#FF6B6B', color: 'white' },
  tableContainer: { background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#999', textTransform: 'uppercase', borderBottom: '2px solid #f0f0f0', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
};

export default Admin;
