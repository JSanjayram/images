import { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getMobileApps } from './firebase';
import { ReactComponent as WebDevIcon } from './web-development-svgrepo-com.svg';
import { ReactComponent as MobileAppsIcon } from './mobileAppIcons.svg';
import { ReactComponent as UiUxIcon } from './vector.svg';
import { ReactComponent as ConsultingIcon } from './vector2.svg';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle, FaApple, FaAndroid } from 'react-icons/fa';

// Sample images
import featureImage from './Deepasree.jpg';
import cardImage1 from './card.jpg';
import cardImage2 from './card.jpg';
import cardImage3 from './card.jpg';
import cardImage4 from './card.jpg';

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
  return (
    <header className="app-header">
      <div className="logo-container">
        <img src={logo} className="app-logo" alt="logo" />
        <div className="brand-text">
          <span className="animated-o">O</span>
          <span>nlySkills</span>
        </div>
      </div>
      <nav className="app-nav">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a 
          href="#contact" 
          onClick={(e) => { 
            e.preventDefault(); 
            setShowContactModal(true); 
          }}
        >
          Contact
        </a>
      </nav>
    </header>
  );
};

// Hero Section Component
const HeroSection = ({ addToRefs, setShowJoinForm }) => {
  return (
    <section className="hero" ref={addToRefs}>
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
    <section className="image-description-section" ref={addToRefs}>
      <div className="description-content">
        <h2>Our Founder</h2>
        <p>
          <h3>J Sanjay Ram</h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <button className="secondary-button">Learn More</button>
      </div>
      <div className="image-container protected-image">
        <div className="image-protection-overlay"></div>
        <img src={featureImage} alt="Feature" className="rounded-image" />
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
    <section id="features" className="features-section" ref={addToRefs}>
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
const ServicesSection = ({ addToRefs, handleMobileAppsClick }) => {
  return (
    <section className="cards-section" ref={addToRefs}>
      <h2>Our Services</h2>
      <div className="cards-container">
        <div className="card">
          <WebDevIcon className="service-icon" />
          <h3>Web Development</h3>
          <p>Custom websites tailored to your needs</p>
        </div>
        <div className="card" onClick={handleMobileAppsClick} style={{ cursor: 'pointer' }}>
          <MobileAppsIcon className="service-icon" />
          <h3>Mobile Apps</h3>
          <p>iOS and Android applications</p>
        </div>
        <div className="card">
          <UiUxIcon className="service-icon"/>
          <h3>UI/UX Design</h3>
          <p>Beautiful and intuitive interfaces</p>
        </div>
        <div className="card">
          <ConsultingIcon className="service-icon"/>
          <h3>Consulting</h3>
          <p>Expert advice for your projects</p>
        </div>
      </div>
    </section>
  );
};

// Mobile Apps Section Component
const MobileAppsSection = ({ addToRefs, mobileAppss, loading, handleBackToServices }) => {
  const [platformFilter, setPlatformFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showAppDetails, setShowAppDetails] = useState(false);

  const filteredApps = mobileAppss.filter(app => {
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
        <button className="back-button" onClick={handleBackToServices}>
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
                    setSelectedApp(app);
                    setShowAppDetails(true);
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

      {showAppDetails && selectedApp && (
        <AppDetails 
          app={selectedApp} 
          onClose={() => setShowAppDetails(false)} 
        />
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
  return (
    <footer className="app-footer">
      <div className="footer-content">
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
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                setShowContactModal(true); 
              }}
            >
              Contact Us
            </a></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3>Contact Info</h3>
          <ul>
            <li><i className="fas fa-map-marker-alt"></i> 123 Tech Street, Bangalore, India</li>
            <li><i className="fas fa-phone"></i> +91 9876543210</li>
            <li><i className="fas fa-envelope"></i> contact@onlyskills.com</li>
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
            <label>Your Skills</label>
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

// Main App Component
function App() {
  const sections = useRef([]);
  const [showMobileApps, setShowMobileApps] = useState(false);
  const [mobileAppss, setMobileApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);

  const addNotification = (message, type = 'success', position = 'right') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, position }]);
    setTimeout(() => removeNotification(id), 5000);
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
    const fetchApps = async () => {
      try {
        const apps = await getMobileApps();
        setMobileApps(apps);
      } catch (error) {
        console.error("Error fetching apps:", error);
        addNotification('Failed to load apps', 'error', 'top');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApps();
  }, []);

  const addToRefs = (el) => {
    if (el && !sections.current.includes(el)) {
      sections.current.push(el);
    }
  };

  return (
    <div className="app">
      <NotificationContainer 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />

      <Header setShowContactModal={setShowContactModal} />

      <main className="app-main">
        <HeroSection 
          addToRefs={addToRefs} 
          setShowJoinForm={setShowJoinForm} 
        />
        
        <FounderSection addToRefs={addToRefs} />
        
        <WhoWeAreSection addToRefs={addToRefs} />
        
        <FeaturesSection addToRefs={addToRefs} />
        
        <ProductFeaturesSection addToRefs={addToRefs} />
        
        {!showMobileApps ? (
          <ServicesSection 
            addToRefs={addToRefs} 
            handleMobileAppsClick={() => setShowMobileApps(true)} 
          />
        ) : (
          <MobileAppsSection 
            addToRefs={addToRefs} 
            mobileAppss={mobileAppss}
            loading={loading}
            handleBackToServices={() => setShowMobileApps(false)}
          />
        )}
      </main>

      <Footer setShowContactModal={setShowContactModal} />

      {showJoinForm && <JoinForm 
        onClose={() => setShowJoinForm(false)} 
        addNotification={addNotification}
      />}
      
      {showContactModal && <ContactModal 
        onClose={() => setShowContactModal(false)} 
        addNotification={addNotification}
      />}
    </div>
  );
}

export default App;


