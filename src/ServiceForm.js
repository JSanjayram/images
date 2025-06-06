// ServiceForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc ,collection} from 'firebase/firestore';
import { uploadSvgAndGetUrl } from './firebase'; // Make sure this function exists in your firebase utils

const ServiceForm = ({ onSuccess, addNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const db = getFirestore();
  const [service, setService] = useState({
    title: '',
    shortDescription: '',
    description: '',
    icon: '',
    features: '',
    svgFile: null,
    svgUrl: '',        // <-- add this line
    status: 'available', // <-- add this line
  });
  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        const docRef = doc(db, 'services', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setService({
            ...data,
            svgFile: null, // don't set file object from db
            svgUrl: data.svgUrl || '', // ensure svgUrl is present
            status: data.status || 'available', // ensure status is present
          });
        }
        setLoading(false);
      };
      fetchService();
    }
  }, [id, db]);

  // Handle SVG file selection
  const handleFileChange = (e) => {
    setService({ ...service, svgFile: e.target.files[0] });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setService(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setService(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let svgUrl = service.svgUrl || '';
    if (service.svgFile) {
      svgUrl = await uploadSvgAndGetUrl(service.svgFile);
    }
    const featuresArr = typeof service.features === 'string'
      ? service.features.split(',').map(f => f.trim()).filter(Boolean)
      : service.features;
    const serviceData = {
      title: service.title,
      shortDescription: service.shortDescription,
      description: service.description,
      icon: service.icon,
      features: featuresArr,
      svgUrl,                // <-- ensure this is saved
      status: service.status // <-- ensure this is saved
    };
    try {
      if (id) {
        // Update existing service
        await setDoc(doc(db, 'services', id), serviceData);
      } else {
        // Add new service
        await setDoc(doc(collection(db, 'services')), serviceData);
      }
      addNotification && addNotification('Service added successfully!', 'success');
      onSuccess && onSuccess();
      setService({
        title: '',
        shortDescription: '',
        description: '',
        icon: '',
        features: '',
        svgFile: null,
        status: 'available',
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Error saving service:", error);
      addNotification && addNotification('Failed to add service.', 'error', 'top');
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="service-form">
      <h2>{id ? 'Edit Service' : 'Add New Service'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={service.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Short Description:</label>
          <input
            type="text"
            name="shortDescription"
            value={service.shortDescription}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={service.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Icon (emoji):</label>
          <input
            type="text"
            name="icon"
            value={service.icon}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Features (comma separated):</label>
          <input
            type="text"
            name="features"
            value={service.features}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>SVG Icon:</label>
          <input
            type="file"
            accept=".svg"
            onChange={handleFileChange}
            required={!id} // required only for new service
          />
          {service.svgFile && <span>{service.svgFile.name}</span>}
          {/* Show current SVG if editing and no new file selected */}
          {!service.svgFile && service.svgUrl && (
            <div style={{ marginTop: 8 }}>
              <span>Current SVG: </span>
              <img src={service.svgUrl} alt="SVG Preview" style={{ width: 40, height: 40, verticalAlign: 'middle' }} />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={service.status}
            onChange={handleChange}
            required
          >
            <option value="available">Available</option>
            <option value="coming-soon">Coming Soon</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={() => navigate('/admin/dashboard')} className="cancel-button">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;