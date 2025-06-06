import React, { useEffect, useState } from 'react';
import { getCareerApplications, getCareerApplicationById } from './firebase';
import './AdminDashboard.css'; // reuse styles
import AdminDashboard from './AdminDashboard'; // for nav/sidebar/footer if needed

const CareerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);

  // Get ?selected=ID from query string
  useEffect(() => {
    const fetchApplications = async () => {
      const apps = await getCareerApplications();
      setApplications(apps);
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedId = params.get('selected');
    if (selectedId) {
      handleApplicationClick(selectedId);
    }
    // eslint-disable-next-line
  }, [applications.length]);

  const handleApplicationClick = async (appId) => {
    const app = await getCareerApplicationById(appId);
    if (app) {
      setCurrentApplication(app);
      setShowModal(true);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Optionally, you can add your nav/sidebar/footer here */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Career Applications</h1>
        </header>
        <div className="admin-content">
          <div className="dashboard-overview">
            <div className="career-applications-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {applications.map(app => (
                <div
                  key={app.id}
                  className="career-application-notification"
                  style={{
                    background: '#23293a',
                    borderRadius: 8,
                    padding: 14,
                    minWidth: 260,
                    maxWidth: 320,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    cursor: 'pointer',
                    marginBottom: 12,
                    transition: 'box-shadow 0.2s',
                  }}
                  onClick={() => handleApplicationClick(app.id)}
                  title="Click to view full application"
                >
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#4facfe' }}>{app.name}</div>
                  <div style={{ fontSize: '0.98rem', color: '#eee', margin: '2px 0 6px 0' }}>
                    <span>{app.degree} - {app.stream}</span>
                  </div>
                  <div style={{ color: '#bbb', fontSize: '0.93rem', marginBottom: 2 }}>
                    <strong>Domain:</strong> {app.domain}
                  </div>
                  <div style={{ color: '#bbb', fontSize: '0.93rem', marginBottom: 2 }}>
                    <strong>Email:</strong> {app.email}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>
                    Submitted: {app.submittedAt && app.submittedAt.toDate ? app.submittedAt.toDate().toLocaleString() : ''}
                  </div>
                </div>
              ))}
            </div>
            {/* Modal for full application details */}
            {showModal && currentApplication && (
              <div className="modal-overlay" onClick={() => setShowModal(false)}>
                <div
                  className="modal-content"
                  style={{ maxWidth: 540, background: '#23293a', color: '#fff', borderRadius: 10, padding: 32 }}
                  onClick={e => e.stopPropagation()}
                >
                  <button className="close-button" onClick={() => setShowModal(false)}>×</button>
                  <h2 style={{ color: '#4facfe' }}>{currentApplication.name}</h2>
                  <div style={{ margin: '10px 0' }}>
                    <strong>Degree:</strong> {currentApplication.degree}<br />
                    <strong>Stream:</strong> {currentApplication.stream}<br />
                    <strong>Email:</strong> {currentApplication.email}<br />
                    <strong>Mobile:</strong> {currentApplication.mobile}<br />
                    <strong>Year Passed:</strong> {currentApplication.yearPassed}<br />
                    <strong>DOB:</strong> {currentApplication.dob}<br />
                    <strong>Domain:</strong> {currentApplication.domain}<br />
                    <strong>Abstract:</strong> {currentApplication.abstract}<br />
                    {currentApplication.valuation && (<><strong>Valuation:</strong> {currentApplication.valuation}<br /></>)}
                    {currentApplication.experience && (<><strong>Experience:</strong> {currentApplication.experience}<br /></>)}
                    {currentApplication.documentation && (
                      <>
                        <strong>Documentation:</strong>{' '}
                        <a
                          href={currentApplication.documentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#4facfe', textDecoration: 'underline' }}
                        >
                          View Document
                        </a>
                        <br />
                      </>
                    )}
                    <strong>Submitted:</strong> {currentApplication.submittedAt && currentApplication.submittedAt.toDate ? currentApplication.submittedAt.toDate().toLocaleString() : ''}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerApplicationsPage;
