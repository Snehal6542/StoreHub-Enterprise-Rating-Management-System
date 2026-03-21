import React, { useState, useEffect } from 'react';
import { storeOwnerAPI, authAPI } from '../services/api';

const StoreOwnerDashboard = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState({ hasStore: false, averageRating: 0, ratings: [] });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [storeData, setStoreData] = useState({ name: '', email: '', address: '' });
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await storeOwnerAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      await storeOwnerAPI.createStore(storeData);
      setStoreData({ name: '', email: '', address: '' });
      setShowStoreForm(false);
      loadDashboard();
      alert('Store created successfully!');
    } catch (error) {
      alert('Error creating store: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_GOOGLE_MAPS_API_KEY`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setMapCenter({ lat: location.lat, lng: location.lng });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updatePassword(newPassword);
      setNewPassword('');
      setShowPasswordForm(false);
      alert('Password updated successfully');
    } catch (error) {
      alert('Error updating password: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  if (!dashboardData.hasStore) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Welcome {user.name} - Store Owner Dashboard</h2>
          <button onClick={onLogout} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>Logout</button>
        </div>
        
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No Store Registered</h3>
          <p>You need to register your store first to access the dashboard.</p>
          <button
            onClick={() => setShowStoreForm(true)}
            style={{ padding: '15px 30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px' }}
          >
            Register My Store
          </button>
        </div>

        {showStoreForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '600px' }}>
              <h3>Register Your Store</h3>
              <form onSubmit={handleCreateStore}>
                <input
                  placeholder="Store Name (20-60 characters)"
                  value={storeData.name}
                  onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
                  required
                />
                <input
                  type="email"
                  placeholder="Store Email"
                  value={storeData.email}
                  onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
                  required
                />
                <input
                  placeholder="Store Address"
                  value={storeData.address}
                  onChange={(e) => {
                    setStoreData({ ...storeData, address: e.target.value });
                    if (e.target.value.length > 10) geocodeAddress(e.target.value);
                  }}
                  style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
                  required
                />
                
                <div style={{ height: '300px', margin: '20px 0', border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1!2d${mapCenter.lng}!3d${mapCenter.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Store Location Preview"
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowStoreForm(false)}
                    style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                  >
                    Register Store
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome {user.name} - {dashboardData.store?.name}</h2>
        <div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', marginRight: '10px' }}
          >
            Change Password
          </button>
          <button
            onClick={onLogout}
            style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
          >
            Logout
          </button>
        </div>
      </div>

      {showPasswordForm && (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <form onSubmit={handlePasswordUpdate}>
            <input
              type="password"
              placeholder="New Password (8-16 chars, uppercase + special)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: '8px', marginRight: '10px', width: '300px' }}
              required
            />
            <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
              Update
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordForm(false)}
              style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', marginLeft: '10px' }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
          <h3>Store Performance</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            Average Rating: {dashboardData.averageRating}/5
          </p>
          <p>Total Reviews: {dashboardData.ratings.length}</p>
          <p><strong>Address:</strong> {dashboardData.store?.address}</p>
        </div>
        
        <div style={{ border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Location"
          />
        </div>
      </div>

      <div>
        <h3>Customer Reviews</h3>
        {dashboardData.ratings.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Customer Name</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Rating</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.ratings.map((rating, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>{rating.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>{rating.email}</td>
                  <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                    <span style={{ color: '#ffc107', fontWeight: 'bold' }}>
                      {rating.rating}★
                    </span>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                    {new Date(rating.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
            No reviews yet. Encourage customers to rate your store!
          </p>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;