import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import api from '../api/axios';
import socket from '../services/socket';

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [matchedUsers, setMatchedUsers] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    loadMatchedUsers();

    if (location.state?.match) {
      setSelectedMatch(location.state.match);
    }
  }, [navigate, location.state]);

  const loadMatchedUsers = async () => {
    try {
      setLoadingMatches(true);
      const res = await api.get('/matches');
      const matches = res.data.matches || [];
      // Only show users where both have liked each other (status = 'matched')
      const mutualMatches = matches.filter(m => m.matchStatus === 'matched');
      setMatchedUsers(mutualMatches);
    } catch (err) {
      setMatchedUsers([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    if (!selectedMatch) return;
    const targetUserId = selectedMatch.user?._id;
    if (!targetUserId) return;

    const loadChat = async () => {
      try {
        // Use deterministic room ID
        const ids = [currentUser.id, targetUserId].sort();
        const roomId = ids.join('_');
        setMatchId(roomId);

        socket.emit('join_room', roomId);

        try {
          setLoadingMessages(true);
          const msgRes = await api.get(`/chat/${roomId}`);
          setMessages(msgRes.data || []);
        } catch {
          setMessages([]);
        } finally {
          setLoadingMessages(false);
        }
      } catch (err) {
        console.error('Error loading chat:', err);
      }
    };

    loadChat();
  }, [selectedMatch, currentUser.id]);

  useEffect(() => {
    const handleReceive = (data) => {
      setMessages(prev => [...prev, data]);
    };
    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !matchId) return;
    socket.emit('send_message', {
      matchId,
      senderId: currentUser.id,
      text: newMessage,
    });
    setNewMessage('');
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <div style={styles.chatLayout}>
        {/* Sidebar: only mutually matched users */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <Users size={20} />
            <h3 style={{ margin: 0, fontSize: '16px' }}>Matched Chats</h3>
          </div>
          {loadingMatches ? (
            <p style={{ padding: '20px', color: '#999', fontSize: '14px' }}>Loading...</p>
          ) : matchedUsers.length === 0 ? (
            <div style={{ padding: '20px', color: '#999', fontSize: '14px', textAlign: 'center' }}>
              <p>No mutual matches yet.</p>
              <p style={{ fontSize: '12px', marginTop: '8px' }}>Like profiles and wait for them to like you back to start chatting!</p>
              <button onClick={() => navigate('/matches')}
                style={{ padding: '8px 16px', background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px', fontSize: '13px', fontWeight: '600' }}>
                Find Matches
              </button>
            </div>
          ) : (
            <div style={styles.userList}>
              {matchedUsers.map(m => (
                <button key={m.user?._id}
                  onClick={() => setSelectedMatch(m)}
                  style={{
                    ...styles.userItem,
                    background: selectedMatch?.user?._id === m.user?._id ? '#FFF0F0' : 'white',
                    borderLeft: selectedMatch?.user?._id === m.user?._id ? '3px solid #FF6B6B' : '3px solid transparent',
                  }}>
                  <div style={styles.userAvatar}>
                    {m.profile?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>
                      {m.profile?.name || 'Unknown'}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#4CAF50' }}>
                      🤝 {m.compatibility}% match
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main chat area */}
        <div style={styles.chatArea}>
          {!selectedMatch ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
              <MessageCircleIcon />
              <p style={{ fontSize: '16px', marginTop: '16px' }}>Select a matched user to start chatting</p>
            </div>
          ) : (
            <>
              <div style={styles.chatHeader}>
                <div style={styles.chatHeaderLeft}>
                  <div style={styles.chatAvatar}>
                    {selectedMatch.profile?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>
                      {selectedMatch.profile?.name}
                    </h2>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#4CAF50' }}>
                      🤝 Matched • {selectedMatch.compatibility}% compatible
                    </p>
                  </div>
                </div>
              </div>

              <div style={styles.messagesContainer}>
                {loadingMessages ? (
                  <p style={{ textAlign: 'center', color: '#999' }}>Loading messages...</p>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                    <p>No messages yet. Say hello! 👋</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: msg.senderId === currentUser.id ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                      <div style={{ ...styles.messageBubble, background: msg.senderId === currentUser.id ? '#FF6B6B' : '#e5e5e5', color: msg.senderId === currentUser.id ? 'white' : '#333', maxWidth: '70%' }}>
                        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>{msg.text}</p>
                        {msg.createdAt && (
                          <span style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px', display: 'block' }}>
                            {formatTime(msg.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div style={styles.inputContainer}>
                <input
                  type="text" value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  style={styles.input}
                />
                <button onClick={handleSendMessage} style={styles.sendButton}>
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MessageCircleIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const styles = {
  chatLayout: { display: 'flex', height: 'calc(100vh - 70px)' },
  sidebar: { width: '300px', background: 'white', borderRight: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '10px', padding: '20px', borderBottom: '1px solid #e5e5e5', color: '#1a1a1a' },
  userList: { flex: 1, overflowY: 'auto' },
  userItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', width: '100%', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
  userAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B, #4A7C7E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0 },
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa' },
  chatHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e5e5e5', background: 'white' },
  chatHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  chatAvatar: { width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B, #4A7C7E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '18px' },
  messagesContainer: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' },
  messageBubble: { padding: '12px 16px', borderRadius: '12px', wordWrap: 'break-word' },
  inputContainer: { display: 'flex', gap: '10px', padding: '16px 20px', borderTop: '1px solid #e5e5e5', background: 'white' },
  input: { flex: 1, padding: '12px 16px', border: '1px solid #e5e5e5', borderRadius: '24px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  sendButton: { background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

export default Chat;
