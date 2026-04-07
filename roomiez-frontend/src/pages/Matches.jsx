import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const Matches = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [allMatches, setAllMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('best');
  const [budgetRange, setBudgetRange] = useState([400, 20000]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState(null);

  const matchesPerPage = 6;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    fetchMatches();
  }, [navigate]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/matches');
      let sorted = [...(res.data.matches || [])];
      if (sortBy === 'best') {
        sorted.sort((a, b) => b.compatibility - a.compatibility);
      }
      setAllMatches(sorted);
      setFilteredMatches(sorted);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to load matches';
      if (msg.includes('questionnaire') || msg.includes('profile')) {
        setError('complete-questionnaire');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = allMatches.filter(match => {
      if (!match.profile) return true;
      const budget = ((match.profile.budgetMin || 0) + (match.profile.budgetMax || 0)) / 2;
      return budget >= budgetRange[0] && budget <= budgetRange[1];
    });
    setFilteredMatches(filtered);
    setCurrentPage(1);
  }, [budgetRange, allMatches]);

  const handleLike = async (userId, idx) => {
    try {
      const res = await api.post(`/profile/like/${userId}`);
      // Update match status in local state
      setAllMatches(prev => prev.map(m => {
        if (m.user?._id === userId) {
          return {
            ...m,
            iLiked: true,
            matchStatus: res.data.status,
          };
        }
        return m;
      }));

      if (res.data.status === 'matched') {
        toast.success("It's a match! 🎉 You can now chat!");
      } else {
        toast.success('Liked! ❤️ They\'ll be notified.');
      }
    } catch (err) {
      toast.error('Failed to like user');
    }
  };

  const handleMessage = (matchData) => {
    if (matchData.matchStatus !== 'matched') {
      toast.error('You can only chat with mutual matches!');
      return;
    }
    navigate('/chat', { state: { match: matchData } });
  };

  const resetFilters = () => {
    setBudgetRange([400, 20000]);
    setSelectedTags([]);
  };

  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);
  const startIdx = (currentPage - 1) * matchesPerPage;
  const displayedMatches = filteredMatches.slice(startIdx, startIdx + matchesPerPage);

  const styles = {
    sidebar: { width: '250px', background: colors.bgCard, padding: '30px 20px', borderRight: `1px solid ${colors.borderLight}`, minHeight: 'calc(100vh - 70px)' },
    filterSection: { display: 'flex', flexDirection: 'column', gap: '25px' },
    filterHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    filterGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    filterLabel: { fontSize: '12px', fontWeight: '600', color: colors.textPrimary, textTransform: 'uppercase' },
    slider: { width: '100%', cursor: 'pointer' },
    budgetDisplay: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: colors.textSecondary },
    mainContent: { flex: 1, padding: '30px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' },
    sortSelect: { padding: '8px 12px', border: `1px solid ${colors.borderLight}`, borderRadius: '6px', cursor: 'pointer', fontSize: '14px', background: colors.bgCard, color: colors.textPrimary },
    matchesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' },
    matchCard: { background: colors.bgCard, borderRadius: '12px', overflow: 'hidden', boxShadow: colors.shadowMedium, transition: 'all 0.3s', border: colors.theme === 'high-contrast' ? `2px solid ${colors.border}` : 'none' },
    cardImageContainer: { position: 'relative', width: '100%', paddingBottom: '70%', background: colors.bgTertiary, overflow: 'hidden' },
    compatibilityBadge: { position: 'absolute', top: '12px', right: '12px', background: `${colors.sage}f2`, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', zIndex: 1 },
    matchedBadge: { position: 'absolute', top: '12px', left: '12px', background: `${colors.coral}f2`, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', zIndex: 1 },
    cardContent: { padding: '16px' },
    budget: { margin: '10px 0', paddingTop: '10px', borderTop: `1px solid ${colors.borderLighter}` },
    actionButtons: { display: 'flex', gap: '8px', marginTop: '12px' },
    actionBtn: { flex: 1, padding: '8px 12px', border: '1px solid', borderRadius: '6px', background: colors.bgCard, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '600', fontSize: '12px' },
    messageBtn: { flex: 1, padding: '8px 12px', color: 'white', border: 'none', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '600', fontSize: '12px' },
    pagination: { display: 'flex', justifyContent: 'center', gap: '8px', padding: '20px' },
    pageButton: { padding: '8px 12px', border: `1px solid ${colors.borderLight}`, borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bgSecondary }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p style={{ color: colors.textSecondary }}>Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  if (error === 'complete-questionnaire') {
    return (
      <div style={{ minHeight: '100vh', background: colors.bgSecondary }}>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '20px' }}>
          <p style={{ fontSize: '18px', color: colors.textSecondary }}>Please complete your profile and questionnaire first.</p>
          <button onClick={() => navigate('/questionnaire')}
            style={{ padding: '12px 32px', background: colors.coral, color: colors.textOnCoral, border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Complete Questionnaire
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bgSecondary }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p style={{ color: colors.coral }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bgSecondary }}>
      <Navbar />
      <main id="main-content" role="main">
        <div style={{ display: 'flex', maxWidth: '1600px', margin: '0 auto' }}>
          <aside style={styles.sidebar}>
            <div style={styles.filterSection}>
              <div style={styles.filterHeader}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: colors.textPrimary }}>Filters</h2>
                <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: colors.coral, cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  Reset
                </button>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Monthly Budget</label>
                <input type="range" min="300" max="20000" value={budgetRange[1]}
                  onChange={(e) => setBudgetRange([budgetRange[0], parseInt(e.target.value)])}
                  style={styles.slider} />
                <div style={styles.budgetDisplay}>
                  <span>KSh {budgetRange[0]}</span>
                  <span>KSh {budgetRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          <div style={styles.mainContent}>
            <div style={styles.header}>
              <div>
                <h1 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: '700', color: colors.textPrimary }}>Suggested Roommates</h1>
                <p style={{ margin: 0, color: colors.textSecondary, fontSize: '14px' }}>
                  {filteredMatches.length} potential roommates • Like profiles to match & chat
                </p>
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
                <option value="best">Best Match</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {displayedMatches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontSize: '16px', color: colors.textSecondary }}>No matches found yet. Invite friends to join RoomieZ!</p>
              </div>
            ) : (
              <div style={styles.matchesGrid}>
                {displayedMatches.map((match, idx) => {
                  const isMatched = match.matchStatus === 'matched';
                  const isLiked = match.iLiked;

                  return (
                    <div key={match.user?._id || idx} style={styles.matchCard}>
                      <div style={styles.cardImageContainer}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: colors.avatarGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: '700', color: 'white' }}>
                          {match.profile?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div style={styles.compatibilityBadge}>
                          ✓ {match.compatibility}% Match
                        </div>
                        {isMatched && (
                          <div style={styles.matchedBadge}>🤝 Matched!</div>
                        )}
                      </div>
                      <div style={styles.cardContent}>
                        <h3 style={{ margin: '12px 0 0 0', fontSize: '16px', fontWeight: '600', color: colors.textPrimary }}>
                          {match.profile?.name || 'Unknown'}
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: colors.textMuted }}>
                          {match.profile?.roomType ? match.profile.roomType.charAt(0).toUpperCase() + match.profile.roomType.slice(1) + ' room' : ''}
                        </p>
                        <div style={styles.budget}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: colors.coral }}>
                            KSh {match.profile?.budgetMin || 0} - {match.profile?.budgetMax || 0}/mo
                          </span>
                        </div>

                        {/* Like status indicator */}
                        {isLiked && !isMatched && (
                          <p style={{ margin: '4px 0 8px 0', fontSize: '12px', color: colors.coral, fontStyle: 'italic' }}>
                            💕 You liked this profile — waiting for them to like back
                          </p>
                        )}
                        {match.theyLiked && !isLiked && (
                          <p style={{ margin: '4px 0 8px 0', fontSize: '12px', color: colors.sage, fontStyle: 'italic' }}>
                            👀 This person liked your profile!
                          </p>
                        )}

                        <div style={styles.actionButtons}>
                          <button
                            onClick={() => handleLike(match.user?._id, idx)}
                            disabled={isLiked}
                            style={{
                              ...styles.actionBtn,
                              background: isLiked ? colors.coralLighter : colors.bgCard,
                              color: isLiked ? colors.coral : colors.textMuted,
                              borderColor: isLiked ? colors.coral : colors.borderLight,
                              cursor: isLiked ? 'default' : 'pointer',
                              opacity: isLiked ? 0.8 : 1,
                            }}
                            aria-label={isLiked ? 'Already liked' : `Like ${match.profile?.name}`}>
                            <Heart size={16} fill={isLiked ? colors.coral : 'none'} />
                            {isLiked ? 'Liked' : 'Like'}
                          </button>
                          <button
                            onClick={() => handleMessage(match)}
                            disabled={!isMatched}
                            style={{
                              ...styles.messageBtn,
                              background: isMatched ? colors.sage : colors.borderLight,
                              cursor: isMatched ? 'pointer' : 'not-allowed',
                            }}
                            aria-label={isMatched ? `Chat with ${match.profile?.name}` : 'Both must like to chat'}
                            title={isMatched ? 'Start chatting' : 'Both users must like each other to chat'}>
                            <MessageCircle size={16} />
                            {isMatched ? 'Chat' : 'Like to Chat'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div style={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    style={{ ...styles.pageButton, background: currentPage === page ? colors.coral : colors.bgCard, color: currentPage === page ? 'white' : colors.textSecondary }}>
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Matches;
