// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, logout, uploadApkAndGetUrl, uploadScreenshotAndGetUrl } from './firebase';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import './AdminDashboard.css'; // Import your CSS file for styling
import TeamMembersAdmin from './TeamMembersAdmin'; // Import your TeamMembersAdmin component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [services, setServices] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [mobileApps, setMobileApps] = useState([]);
  const [careerApplications, setCareerApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showAppModal, setShowAppModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    icon: '',
    features: ['']
  });
  const [serviceFormLoading, setServiceFormLoading] = useState(false);
  const [serviceFormError, setServiceFormError] = useState('');
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    role: '',
    image: '',
    social: {
      linkedin: '',
      twitter: '',
      github: '',
      dribbble: ''
    }
  });
  const [teamFormLoading, setTeamFormLoading] = useState(false);
  const [teamFormError, setTeamFormError] = useState('');
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partnerFormData, setPartnerFormData] = useState({
    name: '',
    logo: '',
    website: ''
  });
  const [partnerFormLoading, setPartnerFormLoading] = useState(false);
  const [partnerFormError, setPartnerFormError] = useState('');
  const [showAppForm, setShowAppForm] = useState(false);
  const [appFormData, setAppFormData] = useState({
    name: '',
    description: '',
    platform: 'android',
    apkFile: null,
    apkUrl: '',
    version: '',
    size: '',
    rating: '',
    downloads: '',
    features: [''],
    screenshots: [''] // This will hold File objects or URLs
  });
  const [appFormLoading, setAppFormLoading] = useState(false);
  const [appFormError, setAppFormError] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const user = useAuth();
  const navigate = useNavigate();
  const [showAppDetails, setShowAppDetails] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [editAppId, setEditAppId] = useState(null);
  const [editPartnerId, setEditPartnerId] = useState(null);
  const [editTeamId, setEditTeamId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      try {
        // Fetch all data in parallel
        const [servicesSnap, teamSnap, partnersSnap, appsSnap, careersSnap] = await Promise.all([
          getDocs(collection(db, 'services')),
          getDocs(collection(db, 'teamMembers')),
          getDocs(collection(db, 'partners')),
          getDocs(collection(db, 'mobileApps')),
          getDocs(collection(db, 'careerApplications'))
        ]);

        setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setTeamMembers(teamSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setPartners(partnersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setMobileApps(appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCareerApplications(careersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/admin');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin');
    } catch (error) {
      // Optionally handle error
    }
  };

  // Add new service to Firestore
  const handleServiceFormSubmit = async (e) => {
    e.preventDefault();
    setServiceFormLoading(true);
    setServiceFormError('');
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'services'), {
        title: serviceFormData.title,
        description: serviceFormData.description,
        icon: serviceFormData.icon,
        features: serviceFormData.features.filter(f => f.trim() !== '')
      });
      setShowServiceForm(false);
      setServiceFormData({
        title: '',
        description: '',
        icon: '',
        features: ['']
      });
      // Refresh services list
      const servicesSnap = await getDocs(collection(db, 'services'));
      setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setServiceFormError('Failed to add service. Please try again.');
    } finally {
      setServiceFormLoading(false);
    }
  };

  // Add new team member to Firestore
  const handleTeamFormSubmit = async (e) => {
    e.preventDefault();
    setTeamFormLoading(true);
    setTeamFormError('');
    try {
      const db = getFirestore();
      if (editTeamId) {
        // Update existing team member
        await updateDoc(doc(db, 'teamMembers', editTeamId), {
          name: teamFormData.name,
          role: teamFormData.role,
          image: teamFormData.image,
          social: {
            linkedin: teamFormData.social.linkedin,
            twitter: teamFormData.social.twitter,
            github: teamFormData.social.github,
            dribbble: teamFormData.social.dribbble
          }
        });
      } else {
        // Add new team member
        await addDoc(collection(db, 'teamMembers'), {
          name: teamFormData.name,
          role: teamFormData.role,
          image: teamFormData.image,
          social: {
            linkedin: teamFormData.social.linkedin,
            twitter: teamFormData.social.twitter,
            github: teamFormData.social.github,
            dribbble: teamFormData.social.dribbble
          }
        });
      }
      setShowTeamForm(false);
      setEditTeamId(null);
      setTeamFormData({
        name: '',
        role: '',
        image: '',
        social: {
          linkedin: '',
          twitter: '',
          github: '',
          dribbble: ''
        }
      });
      // Refresh team members list
      const teamSnap = await getDocs(collection(db, 'teamMembers'));
      setTeamMembers(teamSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setTeamFormError('Failed to add/update team member. Please try again.');
    } finally {
      setTeamFormLoading(false);
    }
  };

  // Add new partner to Firestore
  const handlePartnerFormSubmit = async (e) => {
    e.preventDefault();
    setPartnerFormLoading(true);
    setPartnerFormError('');
    try {
      const db = getFirestore();
      if (editPartnerId) {
        // Update existing partner
        await updateDoc(doc(db, 'partners', editPartnerId), {
          name: partnerFormData.name,
          logo: partnerFormData.logo,
          website: partnerFormData.website
        });
      } else {
        // Add new partner
        await addDoc(collection(db, 'partners'), {
          name: partnerFormData.name,
          logo: partnerFormData.logo,
          website: partnerFormData.website
        });
      }
      setShowPartnerForm(false);
      setEditPartnerId(null);
      setPartnerFormData({
        name: '',
        logo: '',
        website: ''
      });
      // Refresh partners list
      const partnersSnap = await getDocs(collection(db, 'partners'));
      setPartners(partnersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setPartnerFormError('Failed to add/update partner. Please try again.');
    } finally {
      setPartnerFormLoading(false);
    }
  };

  // Move this function above any return statement (not inside any return)
  const handleScreenshotFileChange = (idx, file) => {
    const screenshots = [...appFormData.screenshots];
    screenshots[idx] = file;
    setAppFormData({ ...appFormData, screenshots });
  };

  // Fix: Ensure handleAppFormSubmit is not inside a conditional or after a return
  const handleAppFormSubmit = async (e) => {
    e.preventDefault();
    setAppFormLoading(true);
    setAppFormError('');
    try {
      const db = getFirestore();
      let apkUrl = appFormData.apkUrl;
      if (appFormData.apkFile) {
        apkUrl = await uploadApkAndGetUrl(appFormData.apkFile);
      }
      // Upload screenshots if they are File objects
      const screenshotsUrls = [];
      for (const s of appFormData.screenshots) {
        if (s && typeof s === 'object' && s instanceof File) {
          try {
            const url = await uploadScreenshotAndGetUrl(s);
            screenshotsUrls.push(url);
          } catch (uploadErr) {
            console.error('Screenshot upload error:', uploadErr, s);
            setAppFormError('Failed to upload screenshot: ' + (s.name || 'unknown'));
            setAppFormLoading(false);
            return;
          }
        } else if (typeof s === 'string' && s.trim() !== '') {
          screenshotsUrls.push(s);
        }
      }
      if (!appFormData.name || !appFormData.description || !appFormData.platform || !apkUrl) {
        setAppFormError('Please fill all required fields and upload APK.');
        setAppFormLoading(false);
        console.error('Validation failed', {
          name: appFormData.name,
          description: appFormData.description,
          platform: appFormData.platform,
          apkUrl
        });
        return;
      }
      // Log details before submit
      console.log('Submitting new app:', {
        name: appFormData.name,
        description: appFormData.description,
        platform: appFormData.platform,
        apkUrl,
        version: appFormData.version,
        size: appFormData.size,
        rating: appFormData.rating,
        downloads: appFormData.downloads,
        features: appFormData.features.filter(f => f.trim() !== ''),
        screenshots: screenshotsUrls
      });
      if (editAppId) {
        // Update existing app
        try {
          await updateDoc(doc(db, 'mobileApps', editAppId), {
            name: appFormData.name,
            description: appFormData.description,
            platform: appFormData.platform,
            apkUrl,
            version: appFormData.version,
            size: appFormData.size,
            rating: appFormData.rating,
            downloads: appFormData.downloads,
            features: appFormData.features.filter(f => f.trim() !== ''),
            screenshots: screenshotsUrls
          });
          console.log('App successfully updated in Firestore.');
        } catch (firestoreErr) {
          console.error('Firestore updateDoc error:', firestoreErr);
          setAppFormError('Failed to update app in Firestore.');
          setAppFormLoading(false);
          return;
        }
      } else {
        // Add new app to Firestore
        try {
          await addDoc(collection(db, 'mobileApps'), {
            name: appFormData.name,
            description: appFormData.description,
            platform: appFormData.platform,
            apkUrl,
            version: appFormData.version,
            size: appFormData.size,
            rating: appFormData.rating,
            downloads: appFormData.downloads,
            features: appFormData.features.filter(f => f.trim() !== ''),
            screenshots: screenshotsUrls
          });
          console.log('App successfully added to Firestore.');
        } catch (firestoreErr) {
          console.error('Firestore addDoc error:', firestoreErr);
          setAppFormError('Failed to save app to Firestore.');
          setAppFormLoading(false);
          return;
        }
      }
      setShowAppForm(false);
      setEditAppId(null);
      setAppFormData({
        name: '',
        description: '',
        platform: 'android',
        apkFile: null,
        apkUrl: '',
        version: '',
        size: '',
        rating: '',
        downloads: '',
        features: [''],
        screenshots: ['']
      });
      // Refresh mobile apps list
      const appsSnap = await getDocs(collection(db, 'mobileApps'));
      setMobileApps(appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setAppFormError('Failed to add app. Please try again.');
      console.error('App submit error:', err);
    } finally {
      setAppFormLoading(false);
    }
  };

  // Handle Delete button click
  const handleDeleteClick = () => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedItems([]);
    } else if (selectedItems.length > 0) {
      setShowDeleteModal(true);
    }
  };

  // Confirm deletion (implement actual deletion logic as needed)
  const handleConfirmDelete = async () => {
    const db = getFirestore();
    try {
      if (activeTab === 'services') {
        // Delete selected services
        for (const id of selectedItems) {
          await db.collection('services').doc(id).delete();
        }
        setServices(services.filter(s => !selectedItems.includes(s.id)));
      } else if (activeTab === 'team') {
        for (const id of selectedItems) {
          await db.collection('teamMembers').doc(id).delete();
        }
        setTeamMembers(teamMembers.filter(m => !selectedItems.includes(m.id)));
      } else if (activeTab === 'partners') {
        for (const id of selectedItems) {
          await db.collection('partners').doc(id).delete();
        }
        setPartners(partners.filter(p => !selectedItems.includes(p.id)));
      } else if (activeTab === 'apps') {
        for (const id of selectedItems) {
          await db.collection('mobileApps').doc(id).delete();
        }
        setMobileApps(mobileApps.filter(a => !selectedItems.includes(a.id)));
      }
    } catch (err) {
      // Optionally handle error
    }
    setShowDeleteModal(false);
    setSelectionMode(false);
    setSelectedItems([]);
  };

  // Handle selection toggle
  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Cancel selection mode
  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedItems([]);
    setShowDeleteModal(false);
  };

  // Open application details in a modal (not a new tab)
  const handleApplicationClick = async (appId) => {
    const db = getFirestore();
    const docRef = doc(db, 'careerApplications', appId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setCurrentApplication({ id: docSnap.id, ...docSnap.data() });
      setShowAppDetails(true);
    }
  };

  // Open application in a new tab with dashboard-style grid and popup
  const handleApplicationOpenTab = (appId) => {
    window.open(`/admin/career-applications?selected=${appId}`, '_blank');
  };

  // Define handleEditApp so it can be used in AppsSection
  const handleEditApp = async (appId) => {
    setEditAppId(appId);
    setShowAppForm(true);
    try {
      const db = getFirestore();
      const appDoc = await getDoc(doc(db, 'mobileApps', appId));
      if (appDoc.exists()) {
        const data = appDoc.data();
        setAppFormData({
          name: data.name || '',
          description: data.description || '',
          platform: data.platform || 'android',
          apkFile: null,
          apkUrl: data.apkUrl || '',
          version: data.version || '',
          size: data.size || '',
          rating: data.rating || '',
          downloads: data.downloads || '',
          features: Array.isArray(data.features) && data.features.length > 0 ? data.features : [''],
          screenshots: Array.isArray(data.screenshots) && data.screenshots.length > 0 ? data.screenshots : ['']
        });
      }
    } catch (err) {
      setAppFormError('Failed to load app for editing.');
      setShowAppForm(false);
    }
  };

  // Edit Partner Handler
  const handleEditPartner = async (partnerId) => {
    setEditPartnerId(partnerId);
    setShowPartnerForm(true);
    try {
      const db = getFirestore();
      const partnerDoc = await getDoc(doc(db, 'partners', partnerId));
      if (partnerDoc.exists()) {
        const data = partnerDoc.data();
        setPartnerFormData({
          name: data.name || '',
          logo: data.logo || '',
          website: data.website || ''
        });
      }
    } catch (err) {
      setPartnerFormError('Failed to load partner for editing.');
      setShowPartnerForm(false);
    }
  };

  // Edit Team Member Handler
  const handleEditTeam = async (teamId) => {
    setEditTeamId(teamId);
    setShowTeamForm(true);
    try {
      const db = getFirestore();
      const teamDoc = await getDoc(doc(db, 'teamMembers', teamId));
      if (teamDoc.exists()) {
        const data = teamDoc.data();
        setTeamFormData({
          name: data.name || '',
          role: data.role || '',
          image: data.image || '',
          social: {
            linkedin: data.social?.linkedin || '',
            twitter: data.social?.twitter || '',
            github: data.social?.github || '',
            dribbble: data.social?.dribbble || ''
          }
        });
      }
    } catch (err) {
      setTeamFormError('Failed to load team member for editing.');
      setShowTeamForm(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'services':
        return <ServicesSection services={services} selectionMode={selectionMode} selectedItems={selectedItems} handleSelectItem={handleSelectItem} />;
      case 'team':
        return <TeamSection teamMembers={teamMembers} selectionMode={selectionMode} selectedItems={selectedItems} handleSelectItem={handleSelectItem} handleEditTeam={handleEditTeam} />;
      case 'partners':
        return <PartnersSection partners={partners} selectionMode={selectionMode} selectedItems={selectedItems} handleSelectItem={handleSelectItem} handleEditPartner={handleEditPartner} />;
      case 'apps':
        return <AppsSection mobileApps={mobileApps} selectionMode={selectionMode} selectedItems={selectedItems} handleSelectItem={handleSelectItem} handleEditApp={handleEditApp} />;
      default:
        return (
          <div className="dashboard-overview">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <StatCard 
                title="Services" 
                count={services.length} 
                icon="laptop-code" 
                color="#6e8efb"
              />
              <StatCard 
                title="Team Members" 
                count={teamMembers.length} 
                icon="users" 
                color="#4CAF50"
              />
              <StatCard 
                title="Partners" 
                count={partners.length} 
                icon="handshake" 
                color="#FF9800"
              />
              <StatCard 
                title="Mobile Apps" 
                count={mobileApps.length} 
                icon="mobile-alt" 
                color="#9C27B0"
              />
            </div>
            {/* Show new career applications as notifications */}
            <div style={{ marginTop: 40 }}>
              <h3>New Career Applications</h3>
              {careerApplications.length === 0 ? (
                <div style={{ color: '#aaa', marginTop: 12 }}>No applications yet.</div>
              ) : (
                <div className="career-applications-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {careerApplications.map(app => (
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
                      onClick={() => handleApplicationOpenTab(app.id)}
                      title="Click to open application in new tab"
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
              )}
            </div>
            {/* Modal for full application details */}
            {showAppDetails && currentApplication && (
              <div className="modal-overlay" onClick={() => setShowAppDetails(false)}>
                <div
                  className="modal-content"
                  style={{ maxWidth: 540, background: '#23293a', color: '#fff', borderRadius: 10, padding: 32 }}
                  onClick={e => e.stopPropagation()}
                >
                  <button className="close-button" onClick={() => setShowAppDetails(false)}>×</button>
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
        );
    }
  };

  // Helper to determine if current tab has content
  const isCurrentTabEmpty = () => {
    switch (activeTab) {
      case 'services':
        return services.length === 0;
      case 'team':
        return teamMembers.length === 0;
      case 'partners':
        return partners.length === 0;
      case 'apps':
        return mobileApps.length === 0;
      default:
        return true;
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>OnlySkills</h2>
          <p>Admin Panel</p>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </li>
            <li 
              className={activeTab === 'services' ? 'active' : ''}
              onClick={() => setActiveTab('services')}
            >
              <i className="fas fa-laptop-code"></i>
              <span>Services</span>
            </li>
            <li 
              className={activeTab === 'team' ? 'active' : ''}
              onClick={() => setActiveTab('team')}
            >
              <i className="fas fa-users"></i>
              <span>Team Members</span>
            </li>
            <li 
              className={activeTab === 'partners' ? 'active' : ''}
              onClick={() => setActiveTab('partners')}
            >
              <i className="fas fa-handshake"></i>
              <span>Partners</span>
            </li>
            <li 
              className={activeTab === 'apps' ? 'active' : ''}
              onClick={() => setActiveTab('apps')}
            >
              <i className="fas fa-mobile-alt"></i>
              <span>Mobile Apps</span>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'services' && 'Services Management'}
            {activeTab === 'team' && 'Team Members Management'}
            {activeTab === 'partners' && 'Partners Management'}
            {activeTab === 'apps' && 'Mobile Apps Management'}
          </h1>
        </header>
        {/* Hide options row on dashboard overview. 
            Show both Add New and Delete only if not empty, 
            but always show Add New if not dashboard. */}
        {activeTab !== 'dashboard' && (
          <div className="admin-options-row">
            {!isCurrentTabEmpty() && (
              <button
                className={`admin-options-delete-btn${selectionMode ? ' delete-active' : ''}`}
                disabled={isCurrentTabEmpty()}
                onClick={handleDeleteClick}
                style={selectionMode ? { background: '#e53935', color: '#fff', border: 'none' } : {}}
              >
                {selectionMode ? "Delete" : "Delete"}
              </button>
            )}
            <button
              className="admin-options-add-btn"
              onClick={() => {
                if (activeTab === 'services') setShowServiceForm(true);
                else if (activeTab === 'team') setShowTeamForm(true);
                else if (activeTab === 'partners') setShowPartnerForm(true);
                else if (activeTab === 'apps') {
                  setShowAppForm(true);
                  console.log('Opening Add New Mobile App form');
                }
              }}
            >
              Add New
            </button>
            {selectionMode && (
              <button onClick={handleCancelSelection} style={{ marginLeft: 8 }}>
                Cancel
              </button>
            )}
          </div>
        )}
        <div className="admin-content">

          {/* ...existing modals... */}
          {showServiceForm && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: 500 }}>
                <button className="close-button" onClick={() => setShowServiceForm(false)}>×</button>
                <h2>Add New Service</h2>
                <form onSubmit={handleServiceFormSubmit}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={serviceFormData.title}
                      onChange={e => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={serviceFormData.description}
                      onChange={e => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Icon (emoji or text)</label>
                    <input
                      type="text"
                      value={serviceFormData.icon}
                      onChange={e => setServiceFormData({ ...serviceFormData, icon: e.target.value })}
                      placeholder="e.g. 💻"
                    />
                  </div>
                  {/* Add SVG upload */}
                  <div className="form-group">
                    <label>SVG Icon</label>
                    <input
                      type="file"
                      accept=".svg"
                      onChange={e => setServiceFormData({ ...serviceFormData, svgFile: e.target.files[0] })}
                      required
                    />
                    {serviceFormData.svgFile && (
                      <span style={{ marginLeft: 8 }}>{serviceFormData.svgFile.name}</span>
                    )}
                  </div>
                  {/* Add Status select */}
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={serviceFormData.status || 'available'}
                      onChange={e => setServiceFormData({ ...serviceFormData, status: e.target.value })}
                      required
                    >
                      <option value="available">Available</option>
                      <option value="coming-soon">Coming Soon</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Features</label>
                    {serviceFormData.features.map((feature, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                        <input
                          type="text"
                          value={feature}
                          onChange={e => {
                            const features = [...serviceFormData.features];
                            features[idx] = e.target.value;
                            setServiceFormData({ ...serviceFormData, features });
                          }}
                          required={idx === 0}
                          style={{ flex: 1 }}
                        />
                        {serviceFormData.features.length > 1 && (
                          <button
                            type="button"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              setServiceFormData({
                                ...serviceFormData,
                                features: serviceFormData.features.filter((_, i) => i !== idx)
                              });
                            }}
                          >−</button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setServiceFormData({
                          ...serviceFormData,
                          features: [...serviceFormData.features, '']
                        })
                      }
                      style={{ marginTop: 6 }}
                    >+ Add Feature</button>
                  </div>
                  {serviceFormError && (
                    <div className="form-error" style={{ marginBottom: 10 }}>{serviceFormError}</div>
                  )}
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={serviceFormLoading}
                    style={{ marginTop: 10 }}
                  >
                    {serviceFormLoading ? 'Adding...' : 'Add Service'}
                  </button>
                </form>
              </div>
            </div>
          )}
          {showTeamForm && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: 500 }}>
                <button className="close-button" onClick={() => setShowTeamForm(false)}>×</button>
                <h2>Add New Team Member</h2>
                <form onSubmit={handleTeamFormSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={teamFormData.name}
                      onChange={e => setTeamFormData({ ...teamFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      value={teamFormData.role}
                      onChange={e => setTeamFormData({ ...teamFormData, role: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={teamFormData.image}
                      onChange={e => setTeamFormData({ ...teamFormData, image: e.target.value })}
                      placeholder="Paste image URL"
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input
                      type="text"
                      value={teamFormData.social.linkedin}
                      onChange={e => setTeamFormData({ ...teamFormData, social: { ...teamFormData.social, linkedin: e.target.value } })}
                      placeholder="LinkedIn URL"
                    />
                  </div>
                  <div className="form-group">
                    <label>Twitter</label>
                    <input
                      type="text"
                      value={teamFormData.social.twitter}
                      onChange={e => setTeamFormData({ ...teamFormData, social: { ...teamFormData.social, twitter: e.target.value } })}
                      placeholder="Twitter URL"
                    />
                  </div>
                  <div className="form-group">
                    <label>GitHub</label>
                    <input
                      type="text"
                      value={teamFormData.social.github}
                      onChange={e => setTeamFormData({ ...teamFormData, social: { ...teamFormData.social, github: e.target.value } })}
                      placeholder="GitHub URL"
                    />
                  </div>
                  <div className="form-group">
                    <label>Dribbble</label>
                    <input
                      type="text"
                      value={teamFormData.social.dribbble}
                      onChange={e => setTeamFormData({ ...teamFormData, social: { ...teamFormData.social, dribbble: e.target.value } })}
                      placeholder="Dribbble URL"
                    />
                  </div>
                  {teamFormError && (
                    <div className="form-error" style={{ marginBottom: 10 }}>{teamFormError}</div>
                  )}
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={teamFormLoading}
                    style={{ marginTop: 10 }}
                  >
                    {teamFormLoading ? 'Adding...' : 'Add Team Member'}
                  </button>
                </form>
              </div>
            </div>
          )}
          {showPartnerForm && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: 500 }}>
                <button className="close-button" onClick={() => setShowPartnerForm(false)}>×</button>
                <h2>Add New Partner</h2>
                <form onSubmit={handlePartnerFormSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={partnerFormData.name}
                      onChange={e => setPartnerFormData({ ...partnerFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Logo URL</label>
                    <input
                      type="text"
                      value={partnerFormData.logo}
                      onChange={e => setPartnerFormData({ ...partnerFormData, logo: e.target.value })}
                      placeholder="Paste logo image URL"
                    />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="text"
                      value={partnerFormData.website}
                      onChange={e => setPartnerFormData({ ...partnerFormData, website: e.target.value })}
                      placeholder="Partner website URL"
                    />
                  </div>
                  {partnerFormError && (
                    <div className="form-error" style={{ marginBottom: 10 }}>{partnerFormError}</div>
                  )}
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={partnerFormLoading}
                    style={{ marginTop: 10 }}
                  >
                    {partnerFormLoading ? 'Adding...' : 'Add Partner'}
                  </button>
                </form>
              </div>
            </div>
          )}
          {showAppForm && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: 540 }}>
                <button className="close-button" onClick={() => setShowAppForm(false)}>×</button>
                <h2>Add New Mobile App</h2>
                <form onSubmit={handleAppFormSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={appFormData.name}
                      onChange={e => setAppFormData({ ...appFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={appFormData.description}
                      onChange={e => setAppFormData({ ...appFormData, description: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Platform</label>
                    <select
                      value={appFormData.platform}
                      onChange={e => setAppFormData({ ...appFormData, platform: e.target.value })}
                      required
                    >
                      <option value="android">Android</option>
                      <option value="ios">iOS</option>
                    </select>
                  </div>
                  {/* APK File Upload */}
                  <div className="form-group">
                    <label>APK File</label>
                    <input
                      type="file"
                      accept=".apk"
                      onChange={e => setAppFormData({ ...appFormData, apkFile: e.target.files[0] })}
                     // required={appFormData.platform === 'android'}
                    />
                    {appFormData.apkFile && (
                      <span style={{ marginLeft: 8 }}>{appFormData.apkFile.name}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Version</label>
                    <input
                      type="text"
                      value={appFormData.version}
                      onChange={e => setAppFormData({ ...appFormData, version: e.target.value })}
                      placeholder="e.g. 1.0.0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Size</label>
                    <input
                      type="text"
                      value={appFormData.size}
                      onChange={e => setAppFormData({ ...appFormData, size: e.target.value })}
                      placeholder="e.g. 20MB"
                    />
                  </div>
                  <div className="form-group">
                    <label>Rating</label>
                    <input
                      type="text"
                      value={appFormData.rating}
                      onChange={e => setAppFormData({ ...appFormData, rating: e.target.value })}
                      placeholder="e.g. 4.5"
                    />
                  </div>
                  <div className="form-group">
                    <label>Downloads</label>
                    <input
                      type="text"
                      value={appFormData.downloads}
                      onChange={e => setAppFormData({ ...appFormData, downloads: e.target.value })}
                      placeholder="e.g. 1000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Features</label>
                    {appFormData.features.map((feature, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                        <input
                          type="text"
                          value={feature}
                          onChange={e => {
                            const features = [...appFormData.features];
                            features[idx] = e.target.value;
                            setAppFormData({ ...appFormData, features });
                          }}
                          required={idx === 0}
                          style={{ flex: 1 }}
                        />
                        {appFormData.features.length > 1 && (
                          <button
                            type="button"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              setAppFormData({
                                ...appFormData,
                                features: appFormData.features.filter((_, i) => i !== idx)
                              });
                            }}
                          >−</button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setAppFormData({
                          ...appFormData,
                          features: [...appFormData.features, '']
                        })
                      }
                      style={{ marginTop: 6 }}
                    >+ Add Feature</button>
                  </div>
                  <div className="form-group">
                    <label>Screenshots (Images)</label>
                    {appFormData.screenshots.map((screenshot, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleScreenshotFileChange(idx, e.target.files[0])}
                        />
                        {typeof screenshot === 'object' && screenshot && (
                          <span style={{ marginLeft: 8 }}>{screenshot.name}</span>
                        )}
                        {typeof screenshot === 'string' && screenshot && (
                          <span style={{ marginLeft: 8 }}>{screenshot}</span>
                        )}
                        {appFormData.screenshots.length > 1 && (
                          <button
                            type="button"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              setAppFormData({
                                ...appFormData,
                                screenshots: appFormData.screenshots.filter((_, i) => i !== idx)
                              });
                            }}
                          >−</button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setAppFormData({
                          ...appFormData,
                          screenshots: [...appFormData.screenshots, '']
                        })
                      }
                      style={{ marginTop: 6 }}
                    >+ Add Screenshot</button>
                  </div>
                  {appFormError && (
                    <div className="form-error" style={{ marginBottom: 10 }}>{appFormError}</div>
                  )}
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={appFormLoading}
                    style={{ marginTop: 10 }}
                    onClick={() => console.log('Submit button clicked for Add App')}
                  >
                    {appFormLoading ? 'Adding...' : 'Add App'}
                  </button>
                </form>
              </div>
            </div>
          )}
          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: 420 }}>
                <button className="close-button" onClick={() => setShowDeleteModal(false)}>×</button>
                <h2>Confirm Delete</h2>
                <div style={{ marginBottom: 12 }}>
                  <p>Are you sure you want to delete the following {selectedItems.length} item(s)?</p>
                  <ul style={{ margin: '10px 0 16px 0', paddingLeft: 18 }}>
                    {selectedItems.map(id => {
                      let name = '';
                      if (activeTab === 'services') {
                        const item = services.find(s => s.id === id);
                        name = item ? item.title : id;
                      } else if (activeTab === 'team') {
                        const item = teamMembers.find(m => m.id === id);
                        name = item ? item.name : id;
                      } else if (activeTab === 'partners') {
                        const item = partners.find(p => p.id === id);
                        name = item ? item.name : id;
                      } else if (activeTab === 'apps') {
                        const item = mobileApps.find(a => a.id === id);
                        name = item ? item.name : id;
                      }
                      return <li key={id}>{name}</li>;
                    })}
                  </ul>
                </div>
                <button
                  className="submit-button"
                  style={{ background: '#e53935', color: '#fff', marginRight: 8 }}
                  onClick={handleConfirmDelete}
                >
                  Confirm Delete
                </button>
                <button
                  className="submit-button"
                  style={{ background: '#eee', color: '#222' }}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, count, icon, color }) => (
  <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
    <div className="stat-content">
      <h3>{count}</h3>
      <p>{title}</p>
    </div>
    <div className="stat-icon" style={{ color }}>
      <i className={`fas fa-${icon}`}></i>
    </div>
  </div>
);

// Sections Components
const ServicesSection = ({ services, selectionMode, selectedItems, handleSelectItem }) => (
  services.length > 0 ? (
    <div className="content-section">
      <div className="section-header">
        <h2>Services ({services.length})</h2>
      </div>
      <div className="items-grid">
        {services.map(service => (
          <div key={service.id} className="item-card">
            {/* Selection checkbox */}
            {selectionMode && (
              <input
                type="checkbox"
                checked={selectedItems.includes(service.id)}
                onChange={() => handleSelectItem(service.id)}
                style={{ position: 'absolute', left: 8, top: 8 }}
              />
            )}
            <h3>{service.title}</h3>
            <p>{service.description?.substring(0, 100) ?? ''}...</p>
            <div className="card-actions">
              <Link to={`/admin/services/edit/${service.id}`} className="edit-btn">
                <i className="fas fa-edit"></i> Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="admin-empty-center">
      <div className="empty-content-message">Nothing to show</div>
    </div>
  )
);

const PartnersSection = ({ partners, selectionMode, selectedItems, handleSelectItem, handleEditPartner }) => (
  partners.length > 0 ? (
    <div className="content-section">
      <div className="section-header">
        <h2>Partners ({partners.length})</h2>
      </div>
      <div className="items-grid">
        {partners.map(partner => (
          <div key={partner.id} className="item-card">
            {selectionMode && (
              <input
                type="checkbox"
                checked={selectedItems.includes(partner.id)}
                onChange={() => handleSelectItem(partner.id)}
                style={{ position: 'absolute', left: 8, top: 8 }}
              />
            )}
            <div className="partner-logo">
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} />
              ) : (
                <div className="logo-placeholder">
                  {partner.name?.charAt(0)}
                </div>
              )}
            </div>
            <h3>{partner.name}</h3>
            <div className="card-actions">
              <button
                className="edit-btn"
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleEditPartner(partner.id);
                }}
              >
                <i className="fas fa-edit"></i> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="admin-empty-center">
      <div className="empty-content-message">Nothing to show</div>
    </div>
  )
);

const TeamSection = ({ teamMembers, selectionMode, selectedItems, handleSelectItem, handleEditTeam }) => (
  teamMembers.length > 0 ? (
    <div className="content-section">
      <div className="section-header">
        <h2>Team Members ({teamMembers.length})</h2>
      </div>
      <div className="items-grid">
        {teamMembers.map(member => (
          <div key={member.id} className="item-card">
            {selectionMode && (
              <input
                type="checkbox"
                checked={selectedItems.includes(member.id)}
                onChange={() => handleSelectItem(member.id)}
                style={{ position: 'absolute', left: 8, top: 8 }}
              />
            )}
            <div className="member-avatar">
              {member.image ? (
                <img src={member.image} alt={member.name} />
              ) : (
                <div className="avatar-placeholder">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            <div className="card-actions">
              <button
                className="edit-btn"
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleEditTeam(member.id);
                }}
              >
                <i className="fas fa-edit"></i> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="admin-empty-center">
      <div className="empty-content-message">Nothing to show</div>
    </div>
  )
);

const AppsSection = ({ mobileApps, selectionMode, selectedItems, handleSelectItem, handleEditApp }) => (
  <div className="content-section">
    <div className="section-header">
      <h2>Mobile Apps ({mobileApps.length})</h2>
    </div>
    <div className="items-grid">
      {mobileApps.map(app => (
        <div key={app.id} className="item-card">
          {selectionMode && (
            <input
              type="checkbox"
              checked={selectedItems.includes(app.id)}
              onChange={() => handleSelectItem(app.id)}
              style={{ position: 'absolute', left: 8, top: 8 }}
            />
          )}
          <div className={`app-icon ${app.platform}`}>
            {app.platform === 'ios' ? (
              <i className="fab fa-apple"></i>
            ) : (
              <i className="fab fa-android"></i>
            )}
          </div>
          <h3>{app.name}</h3>
          <p>{app.description?.substring(0, 80)}...</p>
          <div className="card-actions">
            <button
              className="edit-btn"
              type="button"
              onClick={e => {
                e.stopPropagation(); // Prevent event bubbling
                handleEditApp(app.id);
              }}
            >
              <i className="fas fa-edit"></i> Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Example for a content section (e.g., Services, Partners)
const ContentSection = ({ title, items, onAddClick, children }) => (
  <div className="content-section">
    <div className="section-header">
      <h2>{title}</h2>
      <button className="add-btn" onClick={onAddClick}>Add New</button>
    </div>
    <div className="items-grid">
      {items && items.length > 0 ? (
        children
      ) : (
        <div className="empty-content-message">Nothing to show</div>
      )}
    </div>
  </div>
);

// Usage example in your AdminDashboard render logic:
// <ContentSection title="Partners" items={partners} onAddClick={handleAddPartner}>
//   {partners.map(...render partner cards...)}
// </ContentSection>

// <ContentSection title="Services" items={services} onAddClick={handleAddService}>
//   {services.map(...render service cards...)}
// </ContentSection>

export default AdminDashboard;