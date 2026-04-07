import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, MessageCircle, ClipboardList, RefreshCw, LogOut, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const Admin = () => {
  const navigate = useNavigate();
  const { theme, cycleTheme, colors } = useTheme();
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({ users: 0, matches: 0, messages: 0, questionnaires: 0 });
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const themeIcon = theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '🔲';
  const themeLabel = theme === 'light' ? 'Light mode' : theme === 'dark' ? 'Dark mode' : 'High contrast mode';

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

  const styles = {
    adminNav: { background: colors.adminNavBg, borderBottom: `3px solid ${colors.adminNavBorder}`, position: 'sticky', top: 0, zIndex: 100 },
    adminNavContainer: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' },
    adminNavLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
    adminNavTitle: { color: colors.adminNavText, fontSize: '18px', fontWeight: '700' },
    logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'transparent', border: `1px solid ${colors.adminLogoutBorder}`, color: colors.adminLogoutText, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    themeToggle: {
      background: 'transparent',
      border: `1px solid ${colors.adminLogoutBorder}`,
      borderRadius: '8px',
      padding: '6px 10px',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '36px',
      height: '36px',
    },
    refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: colors.sage, color: colors.textOnSage, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' },
    statCard: { background: colors.bgCard, padding: '24px', borderRadius: '12px', boxShadow: colors.shadowMedium, display: 'flex', alignItems: 'center', gap: '16px', border: theme === 'high-contrast' ? `2px solid ${colors.border}` : 'none' },
    statIcon: { width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    tabs: { display: 'flex', gap: '4px', marginBottom: '20px', background: colors.bgCard, padding: '4px', borderRadius: '10px', boxShadow: colors.shadowMedium, border: theme === 'high-contrast' ? `2px solid ${colors.border}` : 'none' },
    tab: { flex: 1, padding: '12px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: colors.textSecondary, transition: 'all 0.2s' },
    activeTab: { background: colors.coral, color: colors.textOnCoral },
    tableContainer: { background: colors.bgCard, borderRadius: '12px', boxShadow: colors.shadowMedium, overflow: 'auto', border: theme === 'high-contrast' ? `2px solid ${colors.border}` : 'none' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', borderBottom: `2px solid ${colors.borderLighter}`, whiteSpace: 'nowrap' },
    tr: { borderBottom: `1px solid ${colors.borderLighter}` },
    td: { padding: '14px 16px', fontSize: '14px', color: colors.textPrimary },
    badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  };

  const StatCard = ({ icon, label, value, color }) => (
    <div style={styles.statCard}>
      <div style={{ ...styles.statIcon, background: `${color}15`, color }}>{icon}</div>
      <div>
        <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: colors.textPrimary }}>{value}</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.textMuted }}>{label}</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: colors.bgSecondary }}>
      {/* Admin-only header - no regular navbar */}
      <nav style={styles.adminNav}>
        <div style={styles.adminNavContainer}>
          <div style={styles.adminNavLeft}>
            <Shield size={22} color={colors.coral} />
            <span style={styles.adminNavTitle}>RoomieZ Admin</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              style={styles.themeToggle}
              onClick={cycleTheme}
              aria-label={`Current theme: ${themeLabel}. Click to switch theme.`}
              title={`Theme: ${themeLabel}`}
            >
              {themeIcon}
            </button>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '700', color: colors.textPrimary }}>Admin Dashboard</h1>
            <p style={{ margin: 0, color: colors.textSecondary, fontSize: '14px' }}>Manage all RoomieZ users, matches, and messages</p>
          </div>
          <button onClick={loadAll} style={styles.refreshBtn}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <StatCard icon={<Users size={24} />} label="Total Users" value={stats.users} color={colors.coral} />
          <StatCard icon={<ClipboardList size={24} />} label="Questionnaires" value={stats.questionnaires} color={colors.sage} />
          <StatCard icon={<Heart size={24} />} label="Matches" value={stats.matches} color={colors.coral} />
          <StatCard icon={<MessageCircle size={24} />} label="Messages" value={stats.messages} color={colors.sage} />
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
            <p style={{ padding: '40px', textAlign: 'center', color: colors.textMuted }}>Loading...</p>
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
                      <span style={{ ...styles.badge, background: u.hasQuestionnaire ? colors.badgeSuccess : colors.badgeDanger, color: u.hasQuestionnaire ? colors.badgeSuccessText : colors.badgeDangerText }}>
                        {u.hasQuestionnaire ? '✅ Done' : '❌ No'}
                      </span>
                    </td>
                    <td style={styles.td}>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: colors.textMuted }}>No users found</td></tr>
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
                      <span style={{ ...styles.badge, background: m.status === 'matched' ? colors.badgeSuccess : colors.badgeWarning, color: m.status === 'matched' ? colors.badgeSuccessText : colors.badgeWarningText }}>
                        {m.status}
                      </span>
                    </td>
                    <td style={styles.td}>{m.likes?.length || 0} / 2</td>
                    <td style={styles.td}>{formatDate(m.createdAt)}</td>
                  </tr>
                ))}
                {matches.length === 0 && (
                  <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: colors.textMuted }}>No matches found</td></tr>
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
                  <tr><td colSpan="4" style={{ ...styles.td, textAlign: 'center', color: colors.textMuted }}>No messages found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
