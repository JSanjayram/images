import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { getMobileApps } from './firebase';
import { ReactComponent as WebDevIcon } from './web-development-svgrepo-com.svg';
import { ReactComponent as MobileAppsIcon } from './mobileAppIcons.svg';
import { ReactComponent as UiUxIcon } from './vector.svg';
import { ReactComponent as ConsultingIcon } from './vector2.svg';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

// Sample images
import featureImage from './Deepasree.jpg';
import cardImage1 from './card.jpg';
import cardImage2 from './card.jpg';
import cardImage3 from './card.jpg';
import cardImage4 from './card.jpg';

// Services Data
const servicesData = {
  web: {
    title: "Web Development",
    icon: <WebDevIcon className="service-icon" />,
    description: "We create responsive, high-performance websites tailored to your business needs.",
    details: [
      "Custom website development",
      "E-commerce solutions",
      "CMS integration (WordPress, Drupal)",
      "API development and integration",
      "Progressive Web Apps (PWAs)"
    ]
  },
  mobile: {
    title: "Mobile Apps",
    icon: <MobileAppsIcon className="service-icon" />,
    description: "Native and cross-platform mobile applications for iOS and Android.",
    details: [
      "iOS app development (Swift)",
      "Android app development (Kotlin)",
      "React Native cross-platform apps",
      "App store optimization",
      "App maintenance and updates"
    ]
  },
  uiux: {
    title: "UI/UX Design",
    icon: <UiUxIcon className="service-icon" />,
    description: "Beautiful, intuitive interfaces that enhance user experience.",
    details: [
      "User research and testing",
      "Wireframing and prototyping",
      "Interaction design",
      "Design systems",
      "Accessibility compliance"
    ]
  },
  consulting: {
    title: "Consulting",
    icon: <ConsultingIcon className="service-icon" />,
    description: "Expert guidance for your technology strategy and implementation.",
    details: [
      "Technology stack selection",
      "Architecture design",
      "Performance optimization",
      "Digital transformation",
      "Team training and mentoring"
    ]
  }
};

function ServicesPage() {
  const { serviceId } = useParams();
  const selectedService = servicesData[serviceId];
  const otherServices = Object.keys(servicesData).filter(key => key !== serviceId);

  return (
    <div className="services-page">
      {selectedService ? (
        <>
          <div className="service-detail">
            <div className="service-header">
              {selectedService.icon}
              <h1>{selectedService.title}</h1>
            </div>
            <p className="service-description">{selectedService.description}</p>
            
            <div className="service-features">
              <h2>What We Offer</h2>
              <ul>
                {selectedService.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="other-services">
            <h2>Our Other Services</h2>
            <div className="services-grid">
              {otherServices.map(serviceKey => (
                <Link to={`/services/${serviceKey}`} key={serviceKey} className="service-card">
                  {servicesData[serviceKey].icon}
                  <h3>{servicesData[serviceKey].title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="all-services">
          <h1>Our Services</h1>
          <div className="services-grid">
            {Object.keys(servicesData).map(serviceKey => (
              <Link to={`/services/${serviceKey}`} key={serviceKey} className="service-card">
                {servicesData[serviceKey].icon}
                <h3>{servicesData[serviceKey].title}</h3>
                <p>{servicesData[serviceKey].description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const sections = useRef([]);
  const [showMobileApps, setShowMobileApps] = useState(false);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showAppDetails, setShowAppDetails] = useState(false);
  const [mobileAppss, setMobileApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showWebDev, setShowWebDev] = useState(false);
  const [webDevFilter, setWebDevFilter] = useState('all');
  const [webDevSearchQuery, setWebDevSearchQuery] = useState('');
  const [isWebDevFadingOut, setIsWebDevFadingOut] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [showWebsiteDetails, setShowWebsiteDetails] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    mobile: '',
    skills: '',
    experience: ''
  });

  const addNotification = (message, type = 'success', position = 'right') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, position }]);
    
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addToRefs = (el) => {
    if (el && !sections.current.includes(el)) {
      sections.current.push(el);
    }
  };

  const handleMobileAppsClick = () => {
    setShowMobileApps(true);
    setTimeout(() => {
      document.getElementById('mobile-apps-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleBackToServices = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowMobileApps(false);
      setPlatformFilter('all');
      setSearchQuery('');
      setIsFadingOut(false);
    }, 300);
  };

  const handleWebDevClick = () => {
    setShowWebDev(true);
    setTimeout(() => {
      document.getElementById('web-dev-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleBackToServicesFromWebDev = () => {
    setIsWebDevFadingOut(true);
    setTimeout(() => {
      setShowWebDev(false);
      setWebDevFilter('all');
      setWebDevSearchQuery('');
      setIsWebDevFadingOut(false);
    }, 300);
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchApps();
  }, []);

  const filteredApps = mobileAppss.filter(app => {
    const matchesPlatform = platformFilter === 'all' || app.platform === platformFilter;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const webDevProjects = [
    {
      id: 1,
      name: 'E-Commerce Platform',
      type: 'fullstack',
      description: 'Complete online shopping solution with payment integration',
      technologies: ['React', 'Node.js', 'MongoDB'],
      features: [
        'Product catalog',
        'Shopping cart',
        'User authentication',
        'Payment gateway integration'
      ],
      image: cardImage1
    },
    // ... other web projects
  ];

  const filteredWebProjects = webDevProjects.filter(project => {
    const matchesType = webDevFilter === 'all' || project.type === webDevFilter;
    const matchesSearch = project.name.toLowerCase().includes(webDevSearchQuery.toLowerCase()) || 
                         project.description.toLowerCase().includes(webDevSearchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const productFeatures = [
    {
      title: "Intuitive Design",
      description: "Our product features a clean, user-friendly interface that makes navigation effortless for users of all skill levels.",
      icon: "🎨"
    },
    // ... other features
  ];

  return (
    <Router>
      <div className="app">
        {/* SVG Background Animation */}
        <NotificationContainer notifications={notifications} removeNotification={removeNotification} />

        <div className="svg-background">
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
            {/* ... SVG content ... */}
          </svg>
        </div>
        
        <header className="app-header">
          <div className="logo-container">
            <img src={logo} className="app-logo" alt="logo" />
            <div className="brand-text">
              <span className="animated-o">O</span>
              <span>nlySkills</span>
            </div>
          </div>
          <nav className="app-nav">
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/about">About</Link>
            <a href="#contact" onClick={(e) => { e.preventDefault(); setShowContactModal(true); }}>Contact</a>
          </nav>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <>
                {/* Hero Section */}
                <section className="hero" ref={addToRefs}>
                  <h1>Welcome to OnlySkills!</h1>
                  <p>Our Technology Meets Innovation and Respect to True Engineers.....</p>
                  <button className="cta-button" onClick={() => setShowJoinForm(true)}>Join Us</button>
                </section>

                {/* ... rest of your home page content ... */}
                {/* Image + Description Section */}
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
                  
                                {/* Who Are We Section */}
                                <section id="about" className="who-are-we-section" ref={addToRefs}>
                                  <h2>Who Are We</h2>
                                  <div className="who-are-we-staggered-grid">
                                    {[
                                      {
                                        title: "Innovative Team",
                                        description: "A group of passionate engineers and designers dedicated to creating cutting-edge solutions",
                                        icon: "👨‍💻"
                                      },
                                      // ... (rest of your who-are-we items)
                                    ].map((item, index) => (
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
                  
                                {/* Features Section */}
                                <section id="features" className="features-section" ref={addToRefs}>
                                  <h2>Key Features</h2>
                                  <div className="features-grid">
                                    <div className="feature-item">
                                      <div className="feature-icon">🚀</div>
                                      <h3>Fast Performance</h3>
                                      <p>Optimized for speed and efficiency</p>
                                    </div>
                                    {/* ... (rest of your feature items) */}
                                  </div>
                                </section>
                  
                                {/* Product Features Section */}
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
                  
                                {/* Services Section */}
                                <section className="cards-section" ref={addToRefs}>
                                  <h2>Our Services</h2>
                                  <div className="cards-container">
                                    <Link to="/services/web" className="card">
                                      <WebDevIcon className="service-icon" />
                                      <h3>Web Development</h3>
                                      <p>Custom websites tailored to your needs</p>
                                    </Link>
                                    <Link to="/services/mobile" className="card">
                                      <MobileAppsIcon className="service-icon" />
                                      <h3>Mobile Apps</h3>
                                      <p>iOS and Android applications</p>
                                    </Link>
                                    {/* ... (rest of your service cards) */}
                                  </div>
                                </section>
              </>
            } />

            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:serviceId" element={<ServicesPage />} />
            <Route path="/about" element={
              <section className="about-page">
                {/* About page content */}
              </section>
            } />
          </Routes>

          {/* Modals */}
          {showAppDetails && selectedApp && (
            <AppDetails app={selectedApp} onClose={() => setShowAppDetails(false)} />
          )}
          {showJoinForm && <JoinForm onClose={() => setShowJoinForm(false)} />}
          {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
          {showWebsiteDetails && selectedWebsite && (
            <WebsiteDetails website={selectedWebsite} onClose={() => setShowWebsiteDetails(false)} />
          )}
        </main>
        
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section about">
              <h3>About OnlySkills</h3>
              <p>We are a technology company dedicated to creating innovative solutions...</p>
              <div className="social-icons">
                <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                {/* ... (rest of your social icons) */}
              </div>
            </div>
            
            <div className="footer-section links">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setShowContactModal(true); }}>Contact Us</a></li>
              </ul>
            </div>
            
            <div className="footer-section contact">
              <h3>Contact Info</h3>
              <ul>
                <li><i className="fas fa-map-marker-alt"></i> 123 Tech Street, Bangalore, India</li>
                {/* ... (rest of your contact info) */}
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} OnlySkills. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Component definitions moved outside of App
function JoinForm({ onClose }) {
  const [localFormData, setLocalFormData] = useState({
    name: '',
    email: '',
    dob: '',
    mobile: '',
    skills: '',
    experience: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', localFormData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
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
                value={localFormData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Email*</label>
              <input 
                type="email" 
                name="email" 
                value={localFormData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Date of Birth*</label>
              <input 
                type="date" 
                name="dob" 
                value={localFormData.dob} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Mobile Number*</label>
              <input 
                type="tel" 
                name="mobile" 
                value={localFormData.mobile} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Your Skills</label>
              <input 
                type="text" 
                name="skills" 
                value={localFormData.skills} 
                onChange={handleChange} 
                placeholder="Separate skills with commas"
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Years of Experience</label>
              <select 
                name="experience" 
                value={localFormData.experience} 
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
}

function Notification({ message, type, onClose }) {
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
}

function NotificationContainer({ notifications, removeNotification }) {
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
}

function ContactModal({ onClose }) {
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
}

function AppDetails({ app, onClose }) {
  if (!app) return null;
  
  return (
    <div className="app-details-modal">
        <div className="app-details-content">
          <button className="close-button" onClick={onClose}>×</button>
          
          <div className="app-details-header">
            <div className="app-icon">
              <div className={`platform-icon ${app.platform}`}>
                {app.platform === 'ios' ? 'iOS' : 'Android'}
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
            <button className="download-button"onClick={() => window.open(app.apkUrl, '_blank')}>
              {app.platform === 'ios' ? 'Download on App Store' : 'Download APK (Android)'}
              
            </button>
          </div>
          
          <div className="app-screenshots">
            <h3>Screenshots</h3>
            <div className="screenshot-container">
              {app.screenshots?.map((screenshot, index) => (
                <img key={index} src={screenshot} alt={`Screenshot ${index + 1}`} />
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
}

function WebsiteDetails({ website, onClose }) {
  if (!website) return null;
  
  return (
    <div className="website-details-modal">
      <div className="website-details-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="website-details-header">
          <div className="website-image-container">
            <img src={website.image} alt={website.name} />
          </div>
          <div className="website-header-info">
            <h2>{website.name}</h2>
            <div className="website-meta">
              <span className={`project-type ${website.type}`}>
                {website.type === 'frontend' ? 'Frontend' : 'Fullstack'}
              </span>
              <div className="technologies">
                {website.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="website-description">
          <h3>Project Description</h3>
          <p>{website.description}</p>
        </div>
        
        <div className="website-features">
          <h3>Key Features</h3>
          <ul>
            {website.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        
        <div className="action-buttons">
          <button className="demo-button">View Demo</button>
          <button className="contact-button" onClick={() => {
            onClose();
            setShowContactModal(true);
          }}>Contact for Similar Project</button>
        </div>
      </div>
    </div>
  );
}

export default App;