import React, { useState, useEffect } from 'react';
import { adminAPI, storeAPI } from '../services/api';

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
  .table-row-hover {
    transition: background-color 0.2s;
  }
  .table-row-hover:hover {
    background-color: rgba(255,255,255,0.05) !important;
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
`;

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState({});
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'normal' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [storeOwners, setStoreOwners] = useState([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeReviews, setStoreReviews] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    loadDashboard();
    loadStoreOwners();
    
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers(filters);
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadStores = async () => {
    try {
      const response = await adminAPI.getStores(filters);
      setStores(response.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const loadStoreOwners = async () => {
    try {
      const response = await adminAPI.getStoreOwners();
      setStoreOwners(response.data);
    } catch (error) {
      console.error('Error loading store owners:', error);
    }
  };

  const viewStoreReviews = async (store) => {
    try {
      const response = await storeAPI.getStoreReviews(store.id);
      setStoreReviews(response.data);
      setSelectedStore(store);
      setShowReviewsModal(true);
    } catch (error) {
      alert('Error loading reviews: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addUser(newUser);
      setNewUser({ name: '', email: '', password: '', address: '', role: 'normal' });
      loadUsers();
    } catch (error) {
      alert('Error adding user: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addStore(newStore);
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      loadStores();
    } catch (error) {
      alert('Error adding store: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderDashboard = () => (
    <div>
      <h2 style={{ color: '#ffffff', marginBottom: '30px', fontSize: '28px' }}>📊 System Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        <div className="card-hover animate-slide-in glass-card" style={{ 
          padding: '30px', 
          borderRadius: '15px', 
          transition: 'transform 0.3s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', opacity: 0.9 }}>Total Users</h3>
              <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>{stats.totalUsers || 0}</p>
            </div>
            <div style={{ fontSize: '48px', opacity: 0.7 }}>👥</div>
          </div>
        </div>
        
        <div className="card-hover animate-slide-in glass-card" style={{ animationDelay: '0.1s',
          padding: '30px', 
          borderRadius: '15px', 
          transition: 'transform 0.3s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', opacity: 0.9 }}>Total Stores</h3>
              <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>{stats.totalStores || 0}</p>
            </div>
            <div style={{ fontSize: '48px', opacity: 0.7 }}>🏪</div>
          </div>
        </div>
        
        <div className="card-hover animate-slide-in glass-card" style={{ animationDelay: '0.2s',
          padding: '30px', 
          borderRadius: '15px', 
          transition: 'transform 0.3s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', opacity: 0.9 }}>Total Ratings</h3>
              <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>{stats.totalRatings || 0}</p>
            </div>
            <div style={{ fontSize: '48px', opacity: 0.7 }}>⭐</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h2 style={{ color: '#ffffff', marginBottom: '30px', fontSize: '28px' }}>👥 User Management</h2>
      
      {/* Add User Form */}
      <div className="card-hover animate-slide-in glass-card" style={{ padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#ffffff' }}>➕ Add New User</h3>
        <form onSubmit={handleAddUser}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <input
              placeholder="Full Name (20-60 chars)"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="input-glow"
              style={{ padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="input-glow"
              style={{ padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="input-glow"
              style={{ padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <input
              placeholder="Address"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              className="input-glow"
              style={{ padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="input-glow"
              style={{ padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="normal">Normal User</option>
              <option value="admin">Administrator</option>
              <option value="store_owner">Store Owner</option>
            </select>
            <button 
              type="submit"
              className="btn-hover"
              style={{ padding: '12px 20px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ➕ Add User
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="card-hover animate-slide-in glass-card" style={{ animationDelay: '0.1s', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#aaaaaa', fontSize: '14px' }}>Filter by Name</label>
            <input
              placeholder="Search users by name"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="input-glow"
              style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#aaaaaa', fontSize: '14px' }}>Filter by Email</label>
            <input
              placeholder="Search users by email"
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              className="input-glow"
              style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>
          <button 
            onClick={loadUsers}
            className="btn-hover"
              style={{ padding: '12px 25px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card-hover animate-slide-in glass-card" style={{ animationDelay: '0.2s', borderRadius: '15px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by name')}>Name ↕️</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by email')}>Email ↕️</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by address')}>Address ↕️</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by role')}>Role ↕️</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="table-row-hover" style={{ backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
                <td style={{ padding: '15px', borderBottom: 'none', color: '#fff' }}>{user.name}</td>
                <td style={{ padding: '15px', borderBottom: 'none', color: '#aaa' }}>{user.email}</td>
                <td style={{ padding: '15px', borderBottom: 'none', color: '#fff' }}>{user.address}</td>
                <td style={{ padding: '15px', borderBottom: 'none' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: user.role === 'admin' ? '#ffffff' : user.role === 'store_owner' ? '#888888' : '#444444',
                    color: 'white'
                  }}>
                    {user.role === 'admin' ? '🛠️ Admin' : user.role === 'store_owner' ? '🏪 Owner' : '👤 User'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#aaaaaa' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
            <p>No users found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStores = () => (
    <div>
      <h2 style={{ color: '#ffffff', marginBottom: '30px', fontSize: '28px' }}>🏪 Store Management</h2>
      
      {/* Add Store Form */}
      <div className="card-hover animate-slide-in glass-card" style={{ padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#ffffff' }}>➕ Add New Store</h3>
        <form onSubmit={handleAddStore}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <input
              placeholder="Store Name (20-60 chars)"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              className="input-glow"
              style={{ padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <input
              type="email"
              placeholder="Store Email"
              value={newStore.email}
              onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
              className="input-glow"
              style={{ padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <input
              placeholder="Store Address"
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              className="input-glow"
              style={{ padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <select
              value={newStore.owner_id}
              onChange={(e) => setNewStore({ ...newStore, owner_id: e.target.value })}
              className="input-glow"
              style={{ padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
              required
            >
              <option value="">Select Store Owner</option>
              {storeOwners.map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            <button 
              type="submit"
              className="btn-hover"
              style={{ padding: '12px 20px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ➕ Add Store
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="card-hover animate-slide-in glass-card" style={{ animationDelay: '0.1s', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#aaaaaa', fontSize: '14px' }}>Filter by Store Name</label>
            <input
              placeholder="Search stores by name"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="input-glow"
              style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>
          <button 
            onClick={loadStores}
            className="btn-hover"
              style={{ padding: '12px 25px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Stores Table */}
      <div className="card-hover animate-slide-in glass-card" style={{ animationDelay: '0.2s', borderRadius: '15px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by name')}>Store Name ↕️</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by email')}>Email ↕️</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by address')}>Address ↕️</th>
              <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by rating')}>Rating ↕️</th>
              <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store, index) => (
              <tr key={store.id} className="table-row-hover" style={{ backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
                <td style={{ padding: '15px', borderBottom: 'none', fontWeight: 'bold', color: '#fff' }}>{store.name}</td>
                <td style={{ padding: '15px', borderBottom: 'none', color: '#aaa' }}>{store.email}</td>
                <td style={{ padding: '15px', borderBottom: 'none', color: '#fff' }}>{store.address}</td>
                <td style={{ padding: '15px', borderBottom: 'none', textAlign: 'center', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{parseFloat(store.rating || 0).toFixed(1)}</span>
                    <span style={{ color: '#ffffff', fontSize: '16px' }}>★</span>
                  </div>
                </td>
                <td style={{ padding: '15px', borderBottom: 'none', textAlign: 'center' }}>
                  <button
                    onClick={() => viewStoreReviews(store)}
                    className="btn-hover"
                    style={{
                      padding: '8px 16px',
                        backgroundColor: '#444444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    📝 Reviews
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {stores.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#aaaaaa' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏪</div>
            <p>No stores found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
    <style>{dashboardStyles}</style>
    <div className="dashboard-container">
      <div className="bg-animation"></div>
      <div className="content-wrapper">
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px 0', border: 'none', borderRadius: '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: '#ffffff', fontSize: '24px' }}>🛠️ Admin Panel</h1>
            <p style={{ margin: '5px 0 0 0', color: '#aaaaaa' }}>{getGreeting()}, {user.name} • {time.toLocaleTimeString()}</p>
          </div>
          <button 
            onClick={onLogout} 
            className="btn-hover"
              style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Navigation Tabs */}
        <div className="animate-slide-in glass-card" style={{ borderRadius: '15px', padding: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`btn-hover ${activeTab === 'dashboard' ? 'active' : ''}`}
              style={{
                padding: '12px 24px',
                  backgroundColor: activeTab === 'dashboard' ? '#ffffff' : 'rgba(255,255,255,0.1)',
                color: activeTab === 'dashboard' ? '#000000' : '#aaaaaa',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('users'); loadUsers(); }}
              className={`btn-hover ${activeTab === 'users' ? 'active' : ''}`}
              style={{
                padding: '12px 24px',
                  backgroundColor: activeTab === 'users' ? '#ffffff' : 'rgba(255,255,255,0.1)',
                color: activeTab === 'users' ? '#000000' : '#aaaaaa',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              👥 Users
            </button>
            <button
              onClick={() => { setActiveTab('stores'); loadStores(); }}
              className={`btn-hover ${activeTab === 'stores' ? 'active' : ''}`}
              style={{
                padding: '12px 24px',
                  backgroundColor: activeTab === 'stores' ? '#ffffff' : 'rgba(255,255,255,0.1)',
                color: activeTab === 'stores' ? '#000000' : '#aaaaaa',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              🏪 Stores
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'stores' && renderStores()}
        
        {/* Reviews Modal */}
        {showReviewsModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-slide-in glass-card" style={{ padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#ffffff' }}>Reviews for {selectedStore?.name}</h3>
                <button onClick={() => setShowReviewsModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#fff' }}>×</button>
              </div>
              
              {storeReviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {storeReviews.map((review, index) => (
                    <div key={index} style={{ padding: '15px', border: 'none', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div>
                          <strong style={{ color: '#ffffff' }}>{review.name}</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                            {[1,2,3,4,5].map(i => (
                                <span key={i} style={{ color: i <= review.rating ? '#ffffff' : '#555555', fontSize: '16px' }}>★</span>
                            ))}
                            <span style={{ marginLeft: '5px', color: '#aaaaaa', fontSize: '14px' }}>({review.rating}/5)</span>
                          </div>
                        </div>
                        <span style={{ color: '#aaaaaa', fontSize: '12px' }}>{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      {review.review && (
                        <p style={{ margin: 0, color: '#dddddd', fontStyle: 'italic' }}>"{review.review}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#aaaaaa' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
                  <p>No reviews yet for this store.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;