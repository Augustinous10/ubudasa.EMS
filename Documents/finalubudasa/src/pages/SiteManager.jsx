import React, { useState } from 'react';
import './siteManager.css';

const SiteManager = () => {
  const [managers, setManagers] = useState([]);
  const [newManager, setNewManager] = useState({
    name: '',
    phone: '',
    site: '',
    permissions: {
      view: false,
      edit: false,
      delete: false,
    },
  });

  const handleInputChange = (e) => {
    setNewManager({ ...newManager, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (e) => {
    setNewManager({
      ...newManager,
      permissions: {
        ...newManager.permissions,
        [e.target.name]: e.target.checked,
      },
    });
  };

  const handleAddManager = (e) => {
    e.preventDefault();
    if (newManager.name && newManager.phone && newManager.site) {
      setManagers([...managers, { ...newManager, id: Date.now() }]);
      setNewManager({
        name: '',
        phone: '',
        site: '',
        permissions: { view: false, edit: false, delete: false },
      });
    }
  };

  const handleDelete = (id) => {
    setManagers(managers.filter((m) => m.id !== id));
  };

  return (
    <div className="site-manager-page">
      <h2>Site Manager Management</h2>

      <form onSubmit={handleAddManager} className="manager-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={newManager.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={newManager.phone}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="site"
          placeholder="Site Name / Location"
          value={newManager.site}
          onChange={handleInputChange}
          required
        />

        <div className="permissions">
          <label>
            <input
              type="checkbox"
              name="view"
              checked={newManager.permissions.view}
              onChange={handlePermissionChange}
            />
            Can View
          </label>
          <label>
            <input
              type="checkbox"
              name="edit"
              checked={newManager.permissions.edit}
              onChange={handlePermissionChange}
            />
            Can Edit
          </label>
          <label>
            <input
              type="checkbox"
              name="delete"
              checked={newManager.permissions.delete}
              onChange={handlePermissionChange}
            />
            Can Delete
          </label>
        </div>

        <button type="submit">Add Manager</button>
      </form>

      <div className="manager-list">
        <h3>Existing Site Managers</h3>
        {managers.length === 0 ? (
          <p>No site managers added yet.</p>
        ) : (
          <ul>
            {managers.map((manager) => (
              <li key={manager.id}>
                <strong>{manager.name}</strong><br />
                Phone: {manager.phone}<br />
                Site: {manager.site}
                <div className="manager-permissions">
                  <span>Permissions:</span>
                  {Object.entries(manager.permissions)
                    .filter(([_, allowed]) => allowed)
                    .map(([perm]) => (
                      <span key={perm} className="perm">{perm}</span>
                    ))}
                </div>
                <button onClick={() => handleDelete(manager.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SiteManager;
