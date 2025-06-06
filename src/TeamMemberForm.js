// TeamMemberForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addTeamMember, updateTeamMember, getTeamMemberById } from './firebase';
import { FaCheck, FaTimes } from 'react-icons/fa';

const TeamMemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({
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
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchMember = async () => {
        try {
          const memberData = await getTeamMemberById(id);
          setMember(memberData);
        } catch (error) {
          console.error('Error fetching member:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchMember();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateTeamMember(id, member);
      } else {
        await addTeamMember(member);
      }
      navigate('/admin/team-members');
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="team-member-form">
      <h2>{id ? 'Edit Team Member' : 'Add New Team Member'}</h2>
      <form onSubmit={handleSubmit}>
        {/* ... form fields same as in your edit form ... */}
        <div className="form-actions">
          <button type="submit" className="save-btn">
            <FaCheck /> {id ? 'Update' : 'Add'} Member
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/team-members')} 
            className="cancel-btn"
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamMemberForm;