import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReactComponent as WebDevIcon } from './web-development-svgrepo-com.svg';
import { ReactComponent as MobileAppsIcon } from './mobileAppIcons.svg';
import { ReactComponent as UiUxIcon } from './vector.svg';
import { ReactComponent as ConsultingIcon } from './vector2.svg';

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

export default ServicesPage;