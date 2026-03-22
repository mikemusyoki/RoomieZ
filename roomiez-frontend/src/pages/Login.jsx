import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, EyeOff, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleLoginChange = (e) => {
    setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUpChange = (e) => {
    setSignUpForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email: loginForm.email,
        password: loginForm.password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login successful!');

      // Admin goes straight to admin page
      if (res.data.user.email === 'admin@ku.ac.ke') {
        navigate('/admin');
        return;
      }

      // Check if user already completed questionnaire
      try {
        const meRes = await api.get('/auth/me');
        if (meRes.data.questionnaire) {
          navigate('/matches');
        } else {
          navigate('/questionnaire');
        }
      } catch {
        navigate('/questionnaire');
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signUpForm.name || !signUpForm.email || !signUpForm.password || !signUpForm.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (signUpForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Register
      await api.post('/auth/register', {
        email: signUpForm.email,
        password: signUpForm.password,
      });

      // Auto-login after register
      const res = await api.post('/auth/login', {
        email: signUpForm.email,
        password: signUpForm.password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Update profile name
      await api.post('/profile/update', { name: signUpForm.name });

      toast.success('Account created! Welcome to RoomieZ!');
      navigate('/questionnaire');
    } catch (error) {
      const msg = error.response?.data?.error || 'Sign up failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setLoginForm({ email: '', password: '' });
    setSignUpForm({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <main id="main-content" role="main">
        <div style={styles.container}>
          <div style={styles.formWrapper}>
            <div style={styles.header}>
              <h1 style={styles.title}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p style={styles.subtitle}>
                {isSignUp
                  ? 'Join us and find your perfect roommate'
                  : 'Login to your RoomieZ account'}
              </p>
            </div>

            <form onSubmit={isSignUp ? handleSignUp : handleLogin} noValidate>
              {isSignUp && (
                <div style={styles.formGroup}>
                  <label htmlFor="name" style={styles.label}>Full Name</label>
                  <div style={styles.inputWrapper}>
                    <User size={18} style={styles.inputIcon} />
                    <input
                      id="name" type="text" name="name"
                      value={signUpForm.name} onChange={handleSignUpChange}
                      placeholder="Enter your full name"
                      style={styles.input} disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} style={styles.inputIcon} />
                  <input
                    id="email" type="email" name="email"
                    value={isSignUp ? signUpForm.email : loginForm.email}
                    onChange={isSignUp ? handleSignUpChange : handleLoginChange}
                    placeholder="yourname@ku.ac.ke"
                    style={styles.input} disabled={loading}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.inputIcon} />
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} name="password"
                    value={isSignUp ? signUpForm.password : loginForm.password}
                    onChange={isSignUp ? handleSignUpChange : handleLoginChange}
                    placeholder="Enter your password"
                    style={styles.input} disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div style={styles.formGroup}>
                  <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
                  <div style={styles.inputWrapper}>
                    <Lock size={18} style={styles.inputIcon} />
                    <input
                      id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                      value={signUpForm.confirmPassword} onChange={handleSignUpChange}
                      placeholder="Confirm your password"
                      style={styles.input} disabled={loading}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}>
                      {showConfirmPassword ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} style={styles.submitButton}>
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Login'}
              </button>
            </form>

            <div style={styles.toggleSection}>
              <p style={styles.toggleText}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button onClick={toggleMode} style={styles.toggleButton} disabled={loading}>
                  {isSignUp ? 'Login here' : 'Sign up here'}
                </button>
              </p>
            </div>
          </div>

          <div style={styles.infoSection}>
            <div style={styles.infoContent}>
              <h2 style={styles.infoTitle}>Why Choose RoomieZ?</h2>
              <div style={styles.featureList}>
                {[
                  { icon: '✓', title: 'AI-Powered Matching', desc: 'Get matched with compatible roommates instantly' },
                  { icon: '💬', title: 'Real-Time Chat', desc: 'Message potential roommates immediately' },
                  { icon: '🔒', title: 'Safe & Secure', desc: 'Your data is encrypted and secure' },
                  { icon: '⭐', title: 'Trusted Community', desc: 'Join thousands of happy roommates' },
                ].map((f, i) => (
                  <div key={i} style={styles.feature}>
                    <div style={styles.featureIcon}>{f.icon}</div>
                    <div>
                      <h3 style={styles.featureTitle}>{f.title}</h3>
                      <p style={styles.featureDesc}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p style={styles.infoFooter}>Join 200+ students who found their perfect roommate</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  pageContainer: { minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f5 0%, #fffdf5 100%)' },
  container: { display: 'flex', maxWidth: '1400px', margin: '0 auto', minHeight: 'calc(100vh - 70px)', alignItems: 'stretch' },
  formWrapper: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px', background: 'white', boxShadow: '-2px 0 8px rgba(0,0,0,0.05)' },
  header: { marginBottom: '40px', textAlign: 'center' },
  title: { margin: '0 0 12px 0', fontSize: '32px', fontWeight: '700', color: '#1a1a1a' },
  subtitle: { margin: 0, fontSize: '14px', color: '#666', fontWeight: '500' },
  formGroup: { marginBottom: '24px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '16px', color: '#999', pointerEvents: 'none' },
  input: { width: '100%', padding: '12px 12px 12px 48px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  eyeButton: { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' },
  submitButton: { width: '100%', padding: '12px 24px', background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '24px', transition: 'all 0.3s' },
  toggleSection: { textAlign: 'center', marginBottom: '20px' },
  toggleText: { margin: 0, fontSize: '14px', color: '#666' },
  toggleButton: { background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontWeight: '600', padding: '4px 0' },
  infoSection: { flex: 1, background: 'linear-gradient(135deg, #FF6B6B 0%, #4A7C7E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 50px', color: 'white' },
  infoContent: { maxWidth: '400px' },
  infoTitle: { margin: '0 0 40px 0', fontSize: '28px', fontWeight: '700', lineHeight: '1.3' },
  featureList: { marginBottom: '40px' },
  feature: { display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' },
  featureIcon: { fontSize: '24px', minWidth: '32px', textAlign: 'center' },
  featureTitle: { margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' },
  featureDesc: { margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: '1.4' },
  infoFooter: { margin: 0, fontSize: '14px', opacity: 0.8, textAlign: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' },
};

export default Login;
