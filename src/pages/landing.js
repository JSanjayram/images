import { useNavigate, useParams } from 'react-router-dom';

const ServiceDetailPage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  // Service data - you might want to move this to a separate file
  const services = {
    'web-development': {
      title: 'Web Development',
      description: 'Our custom web development services...',
      icon: '💻',
      features: ['Responsive Design', 'SEO Optimization', 'Performance Tuning']
    },
    'mobile-apps': {
      title: 'Mobile Apps',
      description: 'Our mobile application services...',
      icon: '📱',
      features: ['iOS Development', 'Android Development', 'Cross-platform']
    },
    'ui-ux-design': {
      title: 'UI/UX Design',
      description: 'Our design services...',
      icon: '🎨',
      features: ['User Research', 'Wireframing', 'Prototyping']
    },
    'consulting': {
      title: 'Consulting',
      description: 'Our consulting services...',
      icon: '📊',
      features: ['Technical Advisory', 'Architecture Review', 'Process Optimization']
    }
  };

  const service = services[serviceId];

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <section className="service-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Services
      </button>
      
      <div className="service-header">
        <div className="service-icon">{service.icon}</div>
        <h2>{service.title}</h2>
      </div>
      
      <div className="service-content">
        <p>{service.description}</p>
        
        <div className="service-features">
          <h3>Key Features</h3>
          <ul>
            {service.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        
        <div className="service-examples">
          <h3>Our Work</h3>
          {/* Add examples or case studies here */}
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailPage;