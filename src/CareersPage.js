import React, { useState } from 'react';
import './CareersPage.css';
import { submitCareerApplication, getCareerApplications } from './firebase';

const CareersPage = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: '',
    degree: '',
    stream: '',
    dob: '',
    email: '',
    mobile: '',
    yearPassed: '',
    domain: '',
    abstract: '',
    valuation: '',
    documentation: null,
    experience: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // Duplication check by email and phone
      const existing = await getCareerApplications();
      const isDuplicate = existing.some(
        app =>
          app.email?.toLowerCase() === form.email.toLowerCase() ||
          app.mobile === form.mobile
      );
      if (isDuplicate) {
        setError('An application with this email or mobile number already exists.');
        setSubmitting(false);
        return;
      }
      // Use onSubmit from App.js to trigger notification
      if (onSubmit) {
        await onSubmit(form, () => setSubmitted(true), () => setError('Failed to submit application. Please try again.'));
      } else {
        await submitCareerApplication(form);
        setSubmitted(true);
      }
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="careers-page">
      <h2>Careers at OnlySkills</h2>
      <p>
        Currently, we are looking for individuals who have unique and innovative ideas. If you have a concept or solution that stands out, you are welcome to apply!
      </p>
      <div style={{ marginTop: 32 }}>
        <h3>How to Apply</h3>
        <ul>
          <li>
            Submit your idea as a document, presentation (PPT), or any other format that best explains your vision.
          </li>
          <li>
            We encourage creative thinkers, problem solvers, and innovators from all backgrounds.
          </li>
        </ul>
        <p style={{ marginTop: 24 }}>
          Interested? Send your proposal to <a href="mailto:Contactdoliteofficial@protonmail.com">Contactdoliteofficial@protonmail.com</a>
        </p>
        <div style={{ marginTop: 32 }}>
          <h3>Become a Partner</h3>
          <p>
            We are also offering opportunities to become a partner with OnlySkills and our partner network. If you are interested in collaborating or joining as a partner, please reach out to us!
          </p>
        </div>
        <div style={{ marginTop: 32 }}>
          <h3>Apply Online</h3>
          {submitted ? (
            <div className="careers-success-msg">
              <p>Thank you for your application! We will review your submission and contact you soon.</p>
            </div>
          ) : (
            <form className="careers-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Name*</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Degree*</label>
                <input name="degree" value={form.degree} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Stream*</label>
                <input name="stream" value={form.stream} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Date of Birth*</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Email*</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Mobile Number*</label>
                <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Year of Passing*</label>
                <input name="yearPassed" value={form.yearPassed} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Domain of Innovation*</label>
                <input name="domain" value={form.domain} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Abstract of Your Innovation*</label>
                <textarea name="abstract" value={form.abstract} onChange={handleChange} required rows={3} />
              </div>
              <div className="form-row">
                <label>Valuation (if any)</label>
                <input name="valuation" value={form.valuation} onChange={handleChange} />
              </div>
              <div className="form-row">
                <label>Documentation (doc, ppt, pdf, etc.)*</label>
                <input type="file" name="documentation" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Any Experience</label>
                <textarea name="experience" value={form.experience} onChange={handleChange} rows={2} />
              </div>
              {error && (
                <div className="form-error" style={{ marginBottom: 10 }}>{error}</div>
              )}
              <button type="submit" className="submit-button" disabled={submitting || loading}>
                {submitting || loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default CareersPage;
