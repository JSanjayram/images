import React, { useEffect, useState } from 'react';
import { getTeamMembers, updateTeamMember, deleteTeamMember } from './firebase';

const AdminPartners = () => {
  const [partners, setPartners] = useState([]);
  const [editingPartner, setEditingPartner] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      const partnersData = await getTeamMembers();
      setPartners(partnersData);
    };

    fetchPartners();
  }, []);

  const handleUpdatePartner = async (id, name) => {
    await updateTeamMember(id, { name });
    setEditingPartner(null);
    // Fetch updated partners list
    const partnersData = await getTeamMembers();
    setPartners(partnersData);
  };

  const handleDeletePartner = async (id) => {
    await deleteTeamMember(id);
    // Fetch updated partners list
    const partnersData = await getTeamMembers();
    setPartners(partnersData);
  };

  return (
    <div>
      <div className="admin-header">
        <div className="admin-title">Partners Management</div>
        {/* Removed the Add Partner button */}
      </div>
      <div className="admin-content">
        {/* Removed any element with className="admin-add-new-button" */}
        {partners.map(partner => (
          <div key={partner.id} className="partner-card">
            {editingPartner === partner.id ? (
              <input
                type="text"
                defaultValue={partner.name}
                onBlur={(e) => handleUpdatePartner(partner.id, e.target.value)}
              />
            ) : (
              <span>{partner.name}</span>
            )}
            <button onClick={() => setEditingPartner(partner.id)}>Edit</button>
            <button onClick={() => handleDeletePartner(partner.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPartners;