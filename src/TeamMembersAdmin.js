import React, { useState, useEffect } from 'react';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from './firebase';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './TeamMembersAdmin.css'; // Assuming you have a CSS file for styling
import { storage } from './firebase.js'; // Import your Firebase storage configuration
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const TeamMembersAdmin = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    image: null,
    social: {
      linkedin: '',
      twitter: '',
      github: '',
      dribbble: ''
    }
  });
  const navigate = useNavigate();


  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const members = await getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMember(prev => ({ ...prev, imageFile: file }));
    }
  };
  

  const handleInputChange = (e, field, isSocial = false) => {
    const { value } = e.target;
    if (isSocial) {
      setNewMember(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [field]: value
        }
      }));
    } else {
      setNewMember(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddMember = async () => {
    try {
      let imageUrl = '';
  
      // Upload image if selected
      if (newMember.imageFile) {
        const imageRef = ref(storage, `team-members/${newMember.imageFile.name}`);
        await uploadBytes(imageRef, newMember.imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }
  
      await addTeamMember({
        name: newMember.name,
        role: newMember.role,
        image: imageUrl,
        social: newMember.social
      });
  
      await fetchTeamMembers();
      setNewMember({
        name: '',
        role: '',
        imageFile:"",
        social: {
          linkedin: '',
          twitter: '',
          github: '',
          dribbble: ''
        }
      });
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };
  

  const handleUpdateMember = async (id) => {
    try {
      const memberToUpdate = teamMembers.find(member => member.id === id);
      await updateTeamMember(id, {
        name: memberToUpdate.name,
        role: memberToUpdate.role,
        image: memberToUpdate.image,
        social: memberToUpdate.social
      });
      setEditingId(null);
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error updating team member:', error);
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteTeamMember(id);
        await fetchTeamMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const startEditing = (id) => {
    setEditingId(id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleMemberFieldChange = (e, id, field, isSocial = false) => {
    const { value } = e.target;
    setTeamMembers(prev =>
      prev.map(member =>
        member.id === id
          ? isSocial
            ? {
                ...member,
                social: {
                  ...member.social,
                  [field]: value
                }
              }
            : {
                ...member,
                [field]: value
              }
          : member
      )
    );
  };

  return (
    <div className="admin-team-members">
      <h2>Team Members Management</h2>
      
      {loading ? (
        <p>Loading team members...</p>
      ) : (
        <>
          <div className="team-members-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-member-card">
                {editingId === member.id ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberFieldChange(e, member.id, 'name')}
                      />
                    </div>
                    <div className="form-group">
                      <label>Role:</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleMemberFieldChange(e, member.id, 'role')}
                      />
                    </div>
                    <div className="form-group">
                      <label>Profile Image:</label>
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <h4>Social Links</h4>
                    <div className="form-group">
                      <label>LinkedIn:</label>
                      <input
                        type="text"
                        value={member.social.linkedin || ''}
                        onChange={(e) => handleMemberFieldChange(e, member.id, 'linkedin', true)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Twitter:</label>
                      <input
                        type="text"
                        value={member.social.twitter || ''}
                        onChange={(e) => handleMemberFieldChange(e, member.id, 'twitter', true)}
                      />
                    </div>
                    <div className="form-group">
                      <label>GitHub:</label>
                      <input
                        type="text"
                        value={member.social.github || ''}
                        onChange={(e) => handleMemberFieldChange(e, member.id, 'github', true)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Dribbble:</label>
                      <input
                        type="text"
                        value={member.social.dribbble || ''}
                        onChange={(e) => handleMemberFieldChange(e, member.id, 'dribbble', true)}
                      />
                    </div>
                    <div className="form-actions">
                      <button onClick={() => handleUpdateMember(member.id)} className="save-btn">
                        <FaCheck /> Save
                      </button>
                      <button onClick={cancelEditing} className="cancel-btn">
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="member-image">
                      <img src={member.image || 'https://via.placeholder.com/150'} alt={member.name} />
                    </div>
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                      <div className="social-links">
                        {member.social.linkedin && (
                          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin"></i>
                          </a>
                        )}
                        {member.social.twitter && (
                          <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i>
                          </a>
                        )}
                        {member.social.github && (
                          <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github"></i>
                          </a>
                        )}
                        {member.social.dribbble && (
                          <a href={member.social.dribbble} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-dribbble"></i>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="member-actions">
                      <button onClick={() => startEditing(member.id)} className="edit-btn">
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDeleteMember(member.id)} className="delete-btn">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamMembersAdmin;