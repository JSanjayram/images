import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation ,useParams } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { getMobileApps, getPartners, getTeamMembers, submitCareerApplication, getServices } from './firebase';
import { ReactComponent as WebDevIcon } from './web-development-svgrepo-com.svg';
import { ReactComponent as MobileAppsIcon } from './mobileAppIcons.svg';
import { ReactComponent as UiUxIcon } from './vector.svg';
import { ReactComponent as ConsultingIcon } from './vector2.svg';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle, FaApple, FaAndroid } from 'react-icons/fa';
import React from 'react';
import './TeamMembers.css'; // We'll create this CSS file
import AdminNav from './AdminNav';
import AdminLogin from './AdminLogin';
import './Admin.css'; // <-- Add this line to import the admin login styles
import AdminDashboard from './AdminDashboard';
import ServiceForm from './ServiceForm';
import CareersPage from './CareersPage';
import CareerApplicationsPage from './CareerApplicationsPage'; // <-- Create this new component

// Sample images
import featureImage from './Deepasree.jpg';
import cardImage1 from './card.jpg';
import cardImage2 from './card.jpg';
import cardImage3 from './card.jpg';

// Notification Component
const Notification = ({ message, type, onClose }) => {
  const icons = {
    success: <FaCheckCircle />,
    error: <FaTimesCircle />,
    info: <FaInfoCircle />,
    warning: <FaExclamationTriangle />
  };

  return (
    <div className={`notification ${type}`}>
      <div className="notification-icon">{icons[type]}</div>
      <div className="notification-content">
        <p>{message}</p>
      </div>
      <button className="notification-close" onClick={onClose}>×</button>
    </div>
  );
};

// Notification Container Component
const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <>
      <div className="notification-container top-center">
        {notifications
          .filter(n => n.position === 'top' && n.type === 'error')
          .map(notification => (
            <Notification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
      </div>

      <div className="notification-container bottom-right">
        {notifications
          .filter(n => n.position === 'right' && n.type === 'success')
          .map(notification => (
            <Notification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
      </div>
    </>
  );
};

// Header Component
const Header = ({ setShowContactModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Listen for scroll to highlight nav
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'features', label: 'Features' },
        { id: 'about', label: 'About' },
        { id: 'services', label: 'Services' },
        { id: 'team', label: 'Team' }
      ];
      let found = '';
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            found = sec.id;
            break;
          }
        }
      }
      setActiveSection(found);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMenuOpen(false);
    
    // If we're not on the home page, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for the navigation to complete before scrolling
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="app-header">
      <div className="logo-container">
        {/*<img src={logo} className="app-logo" alt="logo" />*/}
        <div className="brand-text">
          <span>D</span>
          <span className="animated-o">O</span>
          <span>LITE</span>
        </div>
      </div>
      <button 
        className="menu-toggle" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>
      <nav className={`app-nav ${menuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className={location.pathname === '/' && !activeSection ? 'active' : ''}
        >
          Home
        </Link>
        <a
          href="#features"
          onClick={e => handleNavClick(e, 'features')}
          className={activeSection === 'features' ? 'active' : ''}
        >
          Features
        </a>
        <a
          href="#about"
          onClick={e => handleNavClick(e, 'about')}
          className={activeSection === 'about' ? 'active' : ''}
        >
          About
        </a>
        <a
          href="#services"
          onClick={e => handleNavClick(e, 'services')}
          className={activeSection === 'services' ? 'active' : ''}
        >
          Services
        </a>
        <a
          href="/careers"
          onClick={e => {
            e.preventDefault();
            setMenuOpen(false);
            navigate('/careers');
          }}
          className={location.pathname === '/careers' ? 'active' : ''}
        >
          Careers
        </a>
        <a
          href="#contact"
          onClick={e => {
            e.preventDefault();
            setMenuOpen(false);
            setShowContactModal(true);
          }}
        >
          Contact
        </a>
        <Link
          to="/admin"
          className={`admin-nav-link${location.pathname.startsWith('/admin') ? ' active' : ''}`}
          onClick={() => setMenuOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '1.5rem',
            fontWeight: 500,
            color: 'white',
            textDecoration: 'none'
          }}
        >
          <i className="" style={{ marginRight: 6 }}></i> Admin
        </Link>
      </nav>
    </header>
  );
};

// Hero Section Component
const HeroSection = ({ addToRefs, setShowJoinForm }) => {
  return (
    <section className="hero fade-in" ref={addToRefs}>
      <h1>Welcome to OnlySkills!</h1>
      <p>Our Technology Meets Innovation and Respects True Engineers.....</p>
      <button 
        className="cta-button" 
        onClick={() => setShowJoinForm(true)}
      >
        Join Us
      </button>
    </section>
  );
};

// Founder Section Component
const FounderSection = ({ addToRefs }) => {
  return (
    <section className="image-description-section fade-in" ref={addToRefs}>
      <div className="description-content fade-in">
        <h2>Our Founder</h2>
        <p>
          <span><h3>J Sanjay Ram</h3></span>
          Founder and lead developer of OnlySkills, J Sanjay Ram is dedicated to driving innovation and excellence in technology, with a passion for empowering engineers and delivering impactful solutions.
        </p>
       {/* <button className="secondary-button">Learn More</button>*/}
      </div>
      <div className="image-container protected-image">
        <div className="image-protection-overlay"></div>
        <img src={featureImage} alt="Feature" className="rounded-image" />
      </div>
    </section>
  );
};


// TeamMembers.js

const TeamMembers = ({ partners, teamMembers }) => {
  return (
    <section id="team" className="team-section fade-in">
      {/* Team Members Section */}
      <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
        <h2 >Our Team</h2>
        <p >
          The talented people behind our success
        </p>
      </div>
      <div className="team-grid">
        {teamMembers && teamMembers.length > 0 ? teamMembers.map(member => (
          <div key={member.id} className="team-card">
            <div className="team-card-inner">
              <div className="team-card-front">
                <div className="team-image">
                  <img src={member.image} alt={member.name} className="protected-image" />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
              <div className="team-card-back">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
               {/* <div className="social-links">
                  {member.social?.linkedin && (
                    <a href={member.social.linkedin} aria-label={`${member.name} LinkedIn`}>
                      <i className="fab fa-linkedin"></i>
                    </a>
                  )}
                  {member.social?.twitter && (
                    <a href={member.social.twitter} aria-label={`${member.name} Twitter`}>
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {member.social?.github && (
                    <a href={member.social.github} aria-label={`${member.name} GitHub`}>
                      <i className="fab fa-github"></i>
                    </a>
                  )}
                  {member.social?.dribbble && (
                    <a href={member.social.dribbble} aria-label={`${member.name} Dribbble`}>
                      <i className="fab fa-dribbble"></i>
                    </a>
                  )}
                </div>*/}
              </div>
            </div>
          </div>
        )) : (
          <div>No team members found.</div>
        )}
      </div>
      {/* Partners Section */}
      <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '60px 0 40px 0' }}>
        <h2 >Our Partners</h2>
        <p >
          Companies we collaborate with
        </p>
      </div>
      <div className="partners-grid">
        {partners && partners.length > 0 ? partners.map(partner => (
          <div key={partner.id} className="partner-card">
            <a href={partner.website} target="_blank" rel="noopener noreferrer">
              <img src={partner.logo} alt={partner.name} />
            </a>
          </div>
        )) : (
          <div>No partners found.</div>
        )}
      </div>
    </section>
  );
};

// Who We Are Section Component
const WhoWeAreSection = ({ addToRefs }) => {
  const teamInfo = [
    {
      title: "Innovative Team",
      description: "A group of passionate engineers and designers dedicated to creating cutting-edge solutions",
      icon: "👨‍💻"
    },
    {
      title: "Industry Experts",
      description: "Years of experience across multiple domains including web, mobile, and cloud technologies",
      icon: "🏆"
    },
    {
      title: "Client Focused",
      description: "We prioritize understanding your needs to deliver solutions that drive real business value",
      icon: "🤝"
    },
    {
      title: "Quality Driven",
      description: "Committed to excellence with rigorous testing and quality assurance processes",
      icon: "🔍"
    },
    {
      title: "Continuous Learners",
      description: "Constantly updating our skills to stay ahead in the rapidly evolving tech landscape",
      icon: "📚"
    },
    {
      title: "True Engineers",
      description: "Always Respects and Welcomes the engineers to stay ahead in the Innovative Technology",
      icon: "🤖"
    }
  ];

  return (
    <section id="about" className="who-are-we-section" ref={addToRefs}>
      <h2>Who Are We</h2>
      <div className="who-are-we-staggered-grid">
        {teamInfo.map((item, index) => (
          <div key={index} className="who-are-we-card fade-in" ref={addToRefs}>
            <div className="who-are-we-card-icon">{item.icon}</div>
            <div className="who-are-we-card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = ({ addToRefs }) => {
  return (
    <section id="features" className="features-section fade-in" ref={addToRefs}>
      <h2>Key Features</h2>
      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon">🚀</div>
          <h3>Fast Performance</h3>
          <p>Optimized for speed and efficiency</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🔒</div>
          <h3>Secure</h3>
          <p>Enterprise-grade security</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🔄</div>
          <h3>Reliable</h3>
          <p>99.9% uptime guarantee</p>
        </div>
      </div>
    </section>
  );
};

// Product Features Section Component
const ProductFeaturesSection = ({ addToRefs }) => {
  const productFeatures = [
    {
      title: "Intuitive Design",
      description: "Our product features a clean, user-friendly interface that makes navigation effortless for users of all skill levels.",
      icon: "🎨"
    },
    {
      title: "Advanced Security",
      description: "Built with enterprise-grade security protocols to ensure your data is always protected.",
      icon: "🔒"
    },
    {
      title: "Real-time Analytics",
      description: "Get instant insights with our powerful real-time analytics dashboard.",
      icon: "📊"
    },
    {
      title: "Cross-platform Support",
      description: "Works seamlessly across all devices and operating systems.",
      icon: "🔄"
    },
    {
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock to assist you.",
      icon: "🛟"
    }
  ];

  return (
    <section className="product-description-section" ref={addToRefs}>
      <h2>Our Product Features</h2>
      {productFeatures.map((feature, index) => (
        <div 
          key={index} 
          className={`product-component ${index % 2 === 0 ? 'left-aligned' : 'right-aligned'} fade-in`}
          ref={addToRefs}
        >
          <div className="product-content">
            <div className="product-icon">{feature.icon}</div>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

// Services Section Component
const ServicesSection = ({ addToRefs, services }) => {
  return (
    <section id="services" className="cards-section fade-in" ref={addToRefs}>
      <h2 style={{ textDecoration: 'none' }}>Our Services</h2>
      <div className="cards-container">
        {services && services.length > 0 ? (
          services.map(service => {
            const status = (service.status || '').toLowerCase();
            const isAvailable = status === 'available';
            let statusLabel = '';
            if (status === 'coming-soon') statusLabel = 'Coming Soon';
            else if (status === 'maintenance') statusLabel = 'Maintenance';
            else if (!isAvailable && service.status) statusLabel = service.status;

            return (
              <div
                key={service.id}
                className={`card${!isAvailable ? ' card-disabled' : ''}`}
                style={{ pointerEvents: isAvailable ? 'auto' : 'none', opacity: isAvailable ? 1 : 0.5, position: 'relative' }}
              >
                {service.svgUrl ? (
                  <img src={service.svgUrl} className="service-icon" alt={service.title} />
                ) : (
                  <span className="service-icon" style={{ fontSize: 48 }}>{service.icon || '🛠️'}</span>
                )}
                <h3>{service.title}</h3>
                <p>{service.shortDescription || service.description}</p>
                {!isAvailable && statusLabel && (
                  <div className="service-status-label">
                    {statusLabel}
                  </div>
                )}
                {isAvailable && (
                  <Link to={`/services/${service.id}`} className="card-link" style={{ position: 'absolute', inset: 0, zIndex: 2 }} />
                )}
              </div>
            );
          })
        ) : (
          <>
            <div className="card"><div className="service-icon" /> <h3>Loading...</h3></div>
          </>
        )}
      </div>
    </section>
  );
};

// Mobile Apps Section Component
const MobileAppsSection = ({ addToRefs, mobileApps, loading, onAppSelect }) => {
  const [platformFilter, setPlatformFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const handleBackButtonClick = () => {
    navigate('/', { state: { scrollToServices: true } });
  };
  const filteredApps = mobileApps.filter(app => {
    const matchesPlatform = platformFilter === 'all' || app.platform === platformFilter;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <section 
      id="mobile-apps-section" 
      className="mobile-apps-section fade-in" 
      ref={addToRefs}
    >
      <div className="mobile-apps-header">
        <h2>Our Mobile Applications</h2>
        <button className="back-button" onClick={handleBackButtonClick}>
          ← Back to Services
        </button>
      </div>
      
      <div className="mobile-apps-controls">
        <div className="platform-filter">
          <label>Platform:</label>
          <select 
            value={platformFilter} 
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <p>Loading apps...</p>
        </div>
      ) : (  
        <div className="mobile-apps-grid">
          {filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <div key={app.id} className="mobile-app-card">
                <div className={`app-platform ${app.platform}`}>
                  {app.platform === 'ios' ? <FaApple /> : <FaAndroid />}
                </div>
                <h3>{app.name}</h3>
                <p>{app.description}</p>
                <button 
                  className="app-details-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAppSelect(app);
                  }}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No apps found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

// App Details Component
const AppDetails = ({ app, onClose }) => {
  if (!app) return null;
  
  return (
    <div className="app-details-modal">
      <div className="app-details-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="app-details-header">
          <div className="app-icon">
            <div className={`platform-icon ${app.platform}`}>
              {app.platform === 'ios' ? <FaApple /> : <FaAndroid />}
            </div>
          </div>
          <div className="app-header-info">
            <h2>{app.name}</h2>
            <p className="app-developer">OnlySkills</p>
            <div className="app-meta">
              <span>{app.rating || 'N/A'} ★</span>
              <span>{app.downloads || 'N/A'} downloads</span>
              <span>Version {app.version || 'N/A'}</span>
              <span>{app.size || 'N/A'}</span>
            </div>
          </div>
          <button 
            className="download-button"
            onClick={() => window.open(app.apkUrl, '_blank')}
          >
            {app.platform === 'ios' ? 'Download on App Store' : 'Download APK (Android)'}
          </button>
        </div>
        
        <div className="app-screenshots">
          <h3>Screenshots</h3>
          <div className="screenshot-container">
            {app.screenshots?.map((screenshot, index) => (
              <img 
                key={index} 
                src={screenshot} 
                alt={`Screenshot ${index + 1}`} 
                className="protected-image"
              />
            ))}
          </div>
        </div>
        
        <div className="app-description">
          <h3>About this app</h3>
          <p>{app.description}</p>
        </div>
        
        <div className="app-features">
          <h3>Features</h3>
          <ul>
            {app.features?.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = ({ setShowContactModal }) => {
  const navigate = useNavigate();

  // Helper to scroll to section from anywhere in the app
  const handleSectionLink = (e, sectionId) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollToSection: sectionId } });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="app-footer">
      <div className="footer-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', textAlign: 'center' }}>
        <div className="footer-section about">
          <h3>About OnlySkills</h3>
          <p>We are a technology company dedicated to creating innovative solutions that empower businesses and individuals through cutting-edge software development.</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#home" onClick={e => { e.preventDefault(); navigate('/'); }}>
                Home
              </a>
            </li>
            <li>
              <a href="#features" onClick={e => handleSectionLink(e, 'features')}>
                Features
              </a>
            </li>
            <li>
              <a href="#about" onClick={e => handleSectionLink(e, 'about')}>
                About Us
              </a>
            </li>
            <li>
              <a
                href="/careers"
                onClick={e => {
                  e.preventDefault();
                  navigate('/careers');
                }}
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={e => {
                  e.preventDefault();
                  setShowContactModal(true);
                }}
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3>Contact Info</h3>
          <ul>
            <li><i className="fas fa-map-marker-alt"></i> Salem,Tamil Nadu,India.</li>
            <li><i className="fas fa-phone"></i> +91 9876543210</li>
            <li><i className="fas fa-envelope"></i> Contactdoliteofficial@protonmail.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} OnlySkills. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

// Contact Modal Component
const ContactModal = ({ onClose, addNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@gmail.com')) {
      newErrors.email = 'Only Gmail addresses are accepted';
    }
    if (!formData.message) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formData);
      addNotification('Your message has been sent successfully!', 'success');
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Contact Us</h2>
        <p className="modal-intro">
          We're here to help!<br />
          Please note that we will only be able to respond to questions that are not currently listed in our FAQ section.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Full Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label>Email Address* (Gmail only)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>How Can We Help You?*</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
            ></textarea>
            {errors.message && <span className="error">{errors.message}</span>}
          </div>
          
          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

// Join Form Component
const JoinForm = ({ onClose, addNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    mobile: '',
    skills: '',
    experience: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    addNotification('Your application has been submitted successfully!', 'success');
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="join-form-modal">
      <div className="join-form-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Join Our Community</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name*</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Email*</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Date of Birth*</label>
            <input 
              type="date" 
              name="dob" 
              value={formData.dob} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Mobile Number*</label>
            <input 
              type="tel" 
              name="mobile" 
              value={formData.mobile} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Your Preference</label>
            <input 
              type="text" 
              name="skills" 
              value={formData.skills} 
              onChange={handleChange} 
              placeholder="Separate skills with commas"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Years of Experience</label>
            <select 
              name="experience" 
              value={formData.experience} 
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>
          
          <button type="submit" className="submit-button">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

// Service Detail Page Component
const ServiceDetailPage = ({ mobileApps, loading, services }) => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const addToRefs = () => {};
  const [selectedApp, setSelectedApp] = useState(null);
  const [showAppDetails, setShowAppDetails] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceList = services || [];
  const service = serviceList.find(s => s.id === serviceId);

  const handleBackButtonClick = () => {
    navigate('/', { state: { scrollToServices: true } });
  };

  // Show mobile apps if the service is "mobile-apps" or has a title "Mobile Apps"
  if (service && (service.id === 'mobile-apps' || (service.title && service.title.toLowerCase().includes('mobile app')))) {
    return (
      <section className="service-detail-page">
        <button className="back-button" onClick={handleBackButtonClick}>
          ← Back to Services
        </button>
        <div className="service-header">
          {service.svgUrl ? (
            <img src={service.svgUrl} alt={service.title} className="service-icon" />
          ) : (
            <span className="service-icon" style={{ fontSize: 48 }}>{service.icon || '🛠️'}</span>
          )}
          <h2>{service.title}</h2>
        </div>
        <div className="service-content">
          <p>{service.description}</p>
          <div className="service-features">
            <h3>Key Features</h3>
            <ul>
              {service.features && service.features.length > 0 ? (
                service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))
              ) : (
                <li>No features listed.</li>
              )}
            </ul>
          </div>
          <div className="service-examples">
            <h3>Available Mobile Apps</h3>
            <MobileAppsSection 
              addToRefs={addToRefs} 
              mobileApps={mobileApps} 
              loading={loading} 
              onAppSelect={(app) => {
                setSelectedApp(app);
                setShowAppDetails(true);
              }}
            />
            {showAppDetails && selectedApp && (
              <AppDetails 
                app={selectedApp} 
                onClose={() => setShowAppDetails(false)} 
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!service) {
    return (
      <section className="service-detail-page">
        <button className="back-button" onClick={handleBackButtonClick}>
          ← Back to Services
        </button>
        <h2>Service not found</h2>
      </section>
    );
  }

  return (
    <section className="service-detail-page">
      <button className="back-button" onClick={handleBackButtonClick}>
        ← Back to Services
      </button>
      <div className="service-header">
        {service.svgUrl ? (
          <img src={service.svgUrl} alt={service.title} className="service-icon" />
        ) : (
          <span className="service-icon" style={{ fontSize: 48 }}>{service.icon || '🛠️'}</span>
        )}
        <h2>{service.title}</h2>
      </div>
      <div className="service-content">
        <p>{service.description}</p>
        <div className="service-features">
          <h3>Key Features</h3>
          <ul>
            {service.features && service.features.length > 0 ? (
              service.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))
            ) : (
              <li>No features listed.</li>
            )}
          </ul>
        </div>
        <div className="service-examples">
          <h3>Our Work</h3>
          {service.exampleImages && service.exampleImages.length > 0 ? (
            service.exampleImages.map((img, idx) => (
              <img src={img} alt={`Project example ${idx + 1}`} className="protected-image" key={idx} />
            ))
          ) : (
            <div>We’re currently developing a top-tier consulting experience along with a free web application tailored just for you. Thank you for your patience as we work to bring you the best — it’ll be worth the wait!</div>
          )}
        </div>
      </div>
    </section>
  );
};

// Home Page Component
// HomePage component
// HomePage component
const HomePage = ({ addToRefs, setShowJoinForm, setShowContactModal, mobileApps, loading, partners, teamMembers, services }) => {
  const location = useLocation();
  const servicesRef = useRef(null);

  useEffect(() => {
    // Scroll to section if requested via navigation state
    if (location.state?.scrollToSection) {
      const sectionId = location.state.scrollToSection;
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        window.history.replaceState({}, document.title);
      }, 500);
    }
  }, [location.state]);

  return (
    <>
      <HeroSection addToRefs={addToRefs} setShowJoinForm={setShowJoinForm} />
      <FounderSection addToRefs={addToRefs} />
      <TeamMembers addToRefs={addToRefs} partners={partners} teamMembers={teamMembers} />
      <WhoWeAreSection addToRefs={addToRefs} />
      <FeaturesSection addToRefs={addToRefs} />
      <ProductFeaturesSection addToRefs={addToRefs} />
      <ServicesSection addToRefs={addToRefs} services={services} />
    </>
  );
};

// Main App Component
function App() {
  const sections = useRef([]);
  const [mobileApps, setMobileApps] = useState([]);
  const [partners, setPartners] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);

  // Notification for all application submissions
  const addNotification = (message, type = 'success', position = 'right') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, position }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  // Careers application submission handler
  const handleCareerApplicationSubmit = async (form, onSuccess, onError) => {
    try {
      setLoading(true);
      await submitCareerApplication(form);
      addNotification('Your application has been submitted successfully!', 'success');
      if (onSuccess) onSuccess();
    } catch (err) {
      addNotification('Failed to submit application. Please try again.', 'error', 'top');
      if (onError) onError();
    } finally {
      setLoading(false);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    }, { threshold: 0.1 });

    sections.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Disable right-click and drag for protected images
    const handleContextMenu = (e) => {
      if (e.target.closest('.protected-image')) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e) => {
      if (e.target.closest('.protected-image')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchApps = async () => {
      try {
        const apps = await getMobileApps();
        setMobileApps(apps);
      } catch (error) {
        addNotification('Failed to load apps', 'error', 'top');
      }
    };

    const fetchPartners = async () => {
      try {
        const partnersData = await getPartners();
        setPartners(partnersData);
      } catch (error) {
        addNotification('Failed to load partners', 'error', 'top');
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const teamData = await getTeamMembers();
        setTeamMembers(teamData);
      } catch (error) {
        addNotification('Failed to load team members', 'error', 'top');
      }
    };

    const fetchServices = async () => {
      try {
        const servicesData = await getServices();
        setServices(servicesData);
      } catch (error) {
        addNotification('Failed to load services', 'error', 'top');
      }
    };

    Promise.all([fetchApps(), fetchPartners(), fetchTeamMembers(), fetchServices()]).finally(() => setLoading(false));
  }, []);
  const addToRefs = (el) => {
    if (el && !sections.current.includes(el)) {
      sections.current.push(el);
    }
  };

  return (
    <Router>
      <div className="app">
        <NotificationContainer 
          notifications={notifications} 
          removeNotification={removeNotification} 
        />

        <div className="svg-background">
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7e5f" />
                <stop offset="50%" stopColor="#feb47b" />
                <stop offset="100%" stopColor="#ff6b6b" />
              </linearGradient>
              <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4facfe" />
                <stop offset="50%" stopColor="#00f2fe" />
                <stop offset="100%" stopColor="#a6c1ee" />
              </linearGradient>
            </defs>
            
            <rect x="0" y="0" width="1000" height="1000" fill="url(#grad1)" opacity="0.3" />
            
            <circle cx="200" cy="200" r="150" fill="url(#grad2)" opacity="0.2">
              <animate attributeName="r" values="150;200;150" dur="15s" repeatCount="indefinite" />
            </circle>
            
            <circle cx="800" cy="800" r="120" fill="#f093fb" opacity="0.2">
              <animate attributeName="cx" values="800;850;800" dur="20s" repeatCount="indefinite" />
            </circle>
            
            <polygon points="500,100 600,300 400,300" fill="#4facfe" opacity="0.3">
              <animateTransform attributeName="transform" type="rotate" from="0 500 200" to="360 500 200" dur="30s" repeatCount="indefinite" />
            </polygon>
          </svg>
        </div>

        <Header setShowContactModal={setShowContactModal} />

        <main className="app-main">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  addToRefs={addToRefs} 
                  setShowJoinForm={setShowJoinForm} 
                  setShowContactModal={setShowContactModal}
                  mobileApps={mobileApps}
                  loading={loading}
                  partners={partners}
                  teamMembers={teamMembers}
                  services={services}
                />
              } 
            />
            <Route 
              path="/services/:serviceId" 
              element={
                <ServiceDetailPage
                  mobileApps={mobileApps}
                  loading={loading}
                  services={services}
                />
              } 
            />
                      {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
            <Route path="/admin/services/new" element={<ServiceForm />} />
            <Route path="/admin/services/edit/:id" element={<ServiceForm />} />
            <Route path="/admin/career-applications" element={
              <CareerApplicationsPage
                loading={loading}
                addNotification={addNotification}
              />
            } />
            <Route path="/careers" element={
              <CareersPage
                onSubmit={handleCareerApplicationSubmit}
                loading={loading}
              />
            } />
            {/* Add similar routes for team members, partners, and apps */}
          </Routes>
        </main>

        <Footer setShowContactModal={setShowContactModal} />

        {showJoinForm && (
          <JoinForm 
            onClose={() => setShowJoinForm(false)} 
            addNotification={addNotification}
          />
        )}
        
        {showContactModal && (
          <ContactModal 
            onClose={() => setShowContactModal(false)} 
            addNotification={addNotification}
          />
        )}
      </div>
    </Router>
  );
}

export default App;