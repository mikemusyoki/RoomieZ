import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Users, MessageCircle, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { announceToScreenReader } from '../utils/accessibility';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    announceToScreenReader('Starting the questionnaire to find roommate matches');
    navigate('/questionnaire');
  };

  const handleStartMatching = () => {
    announceToScreenReader('Navigating to matches page');
    navigate('/matches');
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="hero-section" aria-label="Hero section">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                Find Your Perfect Roommate.
                <br />
                <span className="highlight-stress">Stress-free.</span>
              </h1>
              <p className="hero-subtitle">
                Stop wasting time browsing endless profiles. Our AI-powered compatibility engine matches you with the most compatible roommates in seconds.
              </p>
              <div className="hero-buttons">
                <button 
                  className="btn-primary btn-large" 
                  onClick={handleGetStarted}
                  aria-label="Get started - begin questionnaire to find roommates"
                  title="Start the questionnaire process"
                >
                  Get Started
                </button>
                <button 
                  className="btn-secondary btn-large"
                  aria-label="Learn more about RoomieZ"
                  title="Learn more about our service"
                >
                  Learn More
                </button>
              </div>
              <p className="hero-stats" aria-label="Rating: 4.9 out of 5 stars from over 200 students">
                ⭐⭐⭐⭐⭐ 4.9/5 rating from 200+ students
              </p>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" 
                alt="Happy roommates smiling together in apartment"
                style={{ width: '100%', maxWidth: '500px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section" aria-label="Features section">
          <h2 className="section-title">Finding a roommate has never been this easy</h2>
          <p className="section-subtitle">Our smart matching process takes the stress out of finding your perfect living companion</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Complete Your Profile</h3>
            <p>Answer a quick questionnaire about your lifestyle and preferences. Takes just 5 minutes!</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Matching</h3>
            <p>Our algorithm analyzes compatibility across cleanliness, schedules, budget & personality.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Connect & Chat</h3>
            <p>Match with compatible roommates and start chatting instantly to get to know them better.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-section">
        <div className="why-container">
          <div className="why-image">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" 
              alt="Happy roommates"
              className="why-placeholder"
            />
          </div>
          <div className="why-content">
            <h2>More than just a roommate finder.</h2>
            <p>We understand that finding the right roommate is about more than just logistics. It's about finding someone you can actually live with.</p>
            
            <ul className="why-list">
              <li>
                <span className="check-icon">✓</span>
                <span><strong>AI Compatibility Filter</strong> - Smart matching based on 8 lifestyle factors</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span><strong>Budget Alignment</strong> - Find roommates in your price range</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span><strong>Real-time Chat</strong> - Connect instantly after matching</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What students are saying</h2>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">A</div>
              <div>
                <h4>Alice M.</h4>
                <p className="uni">Kenyatta University</p>
              </div>
            </div>
            <p className="testimonial-text">
              "RoomieZ helped me find someone I actually vibe with. No more awkward roommates!"
            </p>
            <p className="rating">⭐⭐⭐⭐⭐</p>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">B</div>
              <div>
                <h4>Ben K.</h4>
                <p className="uni">Nairobi Tech</p>
              </div>
            </div>
            <p className="testimonial-text">
              "The matching algorithm is spot on. Found my roommate immediately!"
            </p>
            <p className="rating">⭐⭐⭐⭐⭐</p>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">A</div>
              <div>
                <h4>Amy L.</h4>
                <p className="uni">Strathmore University</p>
              </div>
            </div>
            <p className="testimonial-text">
              "Super easy to use and the compatibility matching really works!"
            </p>
            <p className="rating">⭐⭐⭐⭐⭐</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to find your match?</h2>
        <p>Join hundreds of students who've already found their perfect roommate</p>
        <div className="cta-buttons">
          <button className="btn-primary btn-large" onClick={handleStartMatching}>
            Start Finding Matches
          </button>
          <button className="btn-secondary btn-large">View How It Works</button>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>RoomieZ</h4>
            <p>Making roommate matching easy, stress-free, and smart.</p>
            <div className="social-links">
              <a href="#" className="social-link">f</a>
              <a href="#" className="social-link">𝕏</a>
              <a href="#" className="social-link">in</a>
            </div>
          </div>
          <div className="footer-section">
            <h5>Product</h5>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 RoomieZ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
