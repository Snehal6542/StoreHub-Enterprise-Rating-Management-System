import React, { useState, useEffect } from 'react';
import { storeOwnerAPI, authAPI } from '../services/api';

const dashboardStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    background: #000000;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-in {
    animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .card-hover {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.6) !important;
  }
  .btn-hover {
    transition: all 0.3s ease;
  }
  .btn-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255,255,255,0.2);
  }
  .input-glow {
    transition: all 0.3s ease;
  }
  .input-glow:focus {
    box-shadow: 0 0 10px rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05) !important;
    outline: none;
  }
  .dashboard-container {
    min-height: 100vh;
    background: #000000;
    color: #ffffff;
    position: relative;
  }
  .bg-animation {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 0;
    background: 
      radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.05), transparent 40%),
      radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.04), transparent 40%),
      radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.03), transparent 40%);
    animation: pulseBg 15s ease-in-out infinite alternate;
    pointer-events: none;
  }
  @keyframes pulseBg {
    0% { transform: scale(1) translate(0px, 0px); }
    100% { transform: scale(1.1) translate(20px, -20px); }
  }
  .glass-card {
    background: rgba(26, 26, 26, 0.6) !important;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: none !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .content-wrapper {
    position: relative;
    z-index: 1;
  }
  .table-row-hover {
    transition: background-color 0.2s;
  }
  .table-row-hover:hover {
    background-color: #2a2a2a !important;
  }
`;

const StoreOwnerDashboard = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState({ hasStore: false, averageRating: 0, ratings: [] });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [storeData, setStoreData] = useState({ name: '', email: '', address: '' });
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    loadDashboard();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!dashboardData.hasStore) {
    return (
      <>
      <style>{dashboardStyles}</style>
      <div className="dashboard-container">
        <div className="bg-animation"></div>
        <div className="content-wrapper" style={{ padding: '20px' }}>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>{getGreeting()}, {user.name} - Store Owner Setup</h2>
          <button onClick={onLogout} className="btn-hover" style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
        </div>
        
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px', borderRadius: '15px', maxWidth: '600px', margin: '0 auto' }}>
          <h3>No Store Registered</h3>
          <p>You need to register your store first to access the dashboard.</p>
          <button
            onClick={() => setShowStoreForm(true)}
            className="btn-hover animate-slide-in"
            style={{ padding: '15px 30px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Register My Store
          </button>
        </div>

        {showStoreForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-slide-in glass-card" style={{ padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '600px' }}>
              <h3>Register Your Store</h3>
              <form onSubmit={handleCreateStore}>
                <input
                  placeholder="Store Name (20-60 characters)"
                  value={storeData.name}
                  onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                  className="input-glow"
                  style={{ width: '100%', padding: '12px', margin: '10px 0', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '5px' }}
                  required
                />
                <input
                  type="email"
                  placeholder="Store Email"
                  value={storeData.email}
                  onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                  className="input-glow"
                  style={{ width: '100%', padding: '12px', margin: '10px 0', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '5px' }}
                  required
                />
                <input
                  placeholder="Store Address"
                  value={storeData.address}
                  onChange={(e) => {
                    setStoreData({ ...storeData, address: e.target.value });
                    if (e.target.value.length > 10) geocodeAddress(e.target.value);
                  }}
                  className="input-glow"
                  style={{ width: '100%', padding: '12px', margin: '10px 0', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '5px' }}
                  required
                />
                
                <div style={{ height: '300px', margin: '20px 0', borderRadius: '5px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)' }}>
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
                    className="btn-hover"
                    style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-hover"
                    style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Register Store
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      </div>
      </>
    );
  }

  return (
    <>
    <style>{dashboardStyles}</style>
    <div className="dashboard-container">
      <div className="bg-animation"></div>
      <div className="content-wrapper" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '20px', borderRadius: '15px' }}>
        <h2 style={{ margin: 0 }}>{getGreeting()}, {user.name} - {dashboardData.store?.name}</h2>
        <div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="btn-hover"
            style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none', marginRight: '10px', borderRadius: '5px', cursor: 'pointer' }}
          >
            Change Password
          </button>
          <button
            onClick={onLogout}
            className="btn-hover"
            style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Logout
          </button>
        </div>
      </div>

      {showPasswordForm && (
        <div className="animate-slide-in glass-card" style={{ marginBottom: '30px', padding: '20px', borderRadius: '10px' }}>
          <form onSubmit={handlePasswordUpdate}>
            <input
              type="password"
              placeholder="New Password (8-16 chars, uppercase + special)"
              value={newPassword}
              className="input-glow"
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: '12px', marginRight: '10px', width: '300px', backgroundColor: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff', borderRadius: '5px' }}
              required
            />
            <button type="submit" className="btn-hover" style={{ padding: '9px 15px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>
              Update
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordForm(false)}
              className="btn-hover"
              style={{ padding: '9px 15px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', marginLeft: '10px', borderRadius: '3px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="card-hover animate-slide-in glass-card" style={{ padding: '25px', borderRadius: '15px' }}>
          <h3>Store Performance</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>
            Average Rating: {dashboardData.averageRating}/5
          </p>
          <p style={{ color: '#aaaaaa' }}>Total Reviews: {dashboardData.ratings.length}</p>
          <p style={{ color: '#aaaaaa' }}><strong style={{ color: '#ffffff' }}>Address:</strong> {dashboardData.store?.address}</p>
        </div>
        
        <div className="card-hover animate-slide-in glass-card" style={{ animationDelay: '0.1s', borderRadius: '15px', overflow: 'hidden', padding: 0 }}>
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

      <div className="glass-card" style={{ padding: '25px', borderRadius: '15px' }}>
        <h3 className="animate-slide-in">Customer Reviews</h3>
        {dashboardData.ratings.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <th style={{ borderBottom: 'none', padding: '12px', textAlign: 'left' }}>Customer Name</th>
                <th style={{ borderBottom: 'none', padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ borderBottom: 'none', padding: '12px', textAlign: 'center' }}>Rating</th>
                <th style={{ borderBottom: 'none', padding: '12px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.ratings.map((rating, index) => (
                <tr key={index} className="table-row-hover animate-slide-in" style={{ animationDelay: `${index * 0.05}s`, backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
                  <td style={{ borderBottom: 'none', padding: '12px' }}>{rating.name}</td>
                  <td style={{ borderBottom: 'none', padding: '12px', color: '#aaa' }}>{rating.email}</td>
                  <td style={{ borderBottom: 'none', padding: '12px', textAlign: 'center' }}>
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                      {rating.rating}★
                    </span>
                  </td>
                  <td style={{ borderBottom: 'none', padding: '12px', color: '#aaa' }}>
                    {new Date(rating.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', marginTop: '30px', color: '#aaaaaa' }}>
            No reviews yet. Encourage customers to rate your store!
          </p>
        )}
      </div>
    </div>
    </div>
    </>
  );
};

export default StoreOwnerDashboard;