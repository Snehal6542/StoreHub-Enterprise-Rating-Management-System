import React, { useState, useEffect } from 'react';
import { adminAPI, storeAPI } from '../services/api';

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

  useEffect(() => {
    loadDashboard();
    loadStoreOwners();
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

  const renderDashboard = () => (
    <div>
      <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '28px' }}>📊 System Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '30px', 
          borderRadius: '15px', 
          color: 'white',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
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
        
        <div style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          padding: '30px', 
          borderRadius: '15px', 
          color: 'white',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
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
        
        <div style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          padding: '30px', 
          borderRadius: '15px', 
          color: 'white',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
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
      <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '28px' }}>👥 User Management</h2>
      
      {/* Add User Form */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>➕ Add New User</h3>
        <form onSubmit={handleAddUser}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <input
              placeholder="Full Name (20-60 chars)"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{ padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              style={{ padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <input
              placeholder="Address"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              style={{ padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              style={{ padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="normal">Normal User</option>
              <option value="admin">Administrator</option>
              <option value="store_owner">Store Owner</option>
            </select>
            <button 
              type="submit"
              style={{ padding: '12px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ➕ Add User
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#7f8c8d', fontSize: '14px' }}>Filter by Name</label>
            <input
              placeholder="Search users by name"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              style={{ width: '100%', padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#7f8c8d', fontSize: '14px' }}>Filter by Email</label>
            <input
              placeholder="Search users by email"
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              style={{ width: '100%', padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>
          <button 
            onClick={loadUsers}
            style={{ padding: '12px 25px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by name')}>Name ↕️</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by email')}>Email ↕️</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by address')}>Address ↕️</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by role')}>Role ↕️</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '15px', borderBottom: '1px solid #ecf0f1' }}>{user.name}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ecf0f1', color: '#3498db' }}>{user.email}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ecf0f1' }}>{user.address}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ecf0f1' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: user.role === 'admin' ? '#e74c3c' : user.role === 'store_owner' ? '#f39c12' : '#27ae60',
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
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
            <p>No users found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStores = () => (
    <div>
      <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '28px' }}>🏪 Store Management</h2>
      
      {/* Add Store Form */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>➕ Add New Store</h3>
        <form onSubmit={handleAddStore}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <input
              placeholder="Store Name (20-60 chars)"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              style={{ padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <input
              type="email"
              placeholder="Store Email"
              value={newStore.email}
              onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
              style={{ padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <input
              placeholder="Store Address"
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              style={{ padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
              required
            />
            <select
              value={newStore.owner_id}
              onChange={(e) => setNewStore({ ...newStore, owner_id: e.target.value })}
              style={{ padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
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
              style={{ padding: '12px 20px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ➕ Add Store
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#7f8c8d', fontSize: '14px' }}>Filter by Store Name</label>
            <input
              placeholder="Search stores by name"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              style={{ width: '100%', padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>
          <button 
            onClick={loadStores}
            style={{ padding: '12px 25px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Stores Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by name')}>Store Name ↕️</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by email')}>Email ↕️</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by address')}>Address ↕️</th>
              <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => console.log('Sort by rating')}>Rating ↕️</th>
              <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store, index) => (
              <tr key={store.id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '15px', borderBottom: '1px solid #ecf0f1', fontWeight: 'bold' }}>{store.name}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ecf0f1', color: '#3498db' }}>{store.email}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ecf0f1' }}>{store.address}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ecf0f1', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{parseFloat(store.rating || 0).toFixed(1)}</span>
                    <span style={{ color: '#f1c40f', fontSize: '16px' }}>★</span>
                  </div>
                </td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ecf0f1', textAlign: 'center' }}>
                  <button
                    onClick={() => viewStoreReviews(store)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#9b59b6',
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
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏪</div>
            <p>No stores found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '24px' }}>🛠️ Admin Panel</h1>
            <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>Welcome back, {user.name}</p>
          </div>
          <button 
            onClick={onLogout} 
            style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer' }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Navigation Tabs */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '20px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'dashboard' ? '#3498db' : '#ecf0f1',
                color: activeTab === 'dashboard' ? 'white' : '#7f8c8d',
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
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'users' ? '#3498db' : '#ecf0f1',
                color: activeTab === 'users' ? 'white' : '#7f8c8d',
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
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'stores' ? '#3498db' : '#ecf0f1',
                color: activeTab === 'stores' ? 'white' : '#7f8c8d',
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
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#2c3e50' }}>Reviews for {selectedStore?.name}</h3>
                <button onClick={() => setShowReviewsModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
              </div>
              
              {storeReviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {storeReviews.map((review, index) => (
                    <div key={index} style={{ padding: '15px', border: '1px solid #ecf0f1', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div>
                          <strong style={{ color: '#2c3e50' }}>{review.name}</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                            {[1,2,3,4,5].map(i => (
                              <span key={i} style={{ color: i <= review.rating ? '#f1c40f' : '#bdc3c7', fontSize: '16px' }}>★</span>
                            ))}
                            <span style={{ marginLeft: '5px', color: '#7f8c8d', fontSize: '14px' }}>({review.rating}/5)</span>
                          </div>
                        </div>
                        <span style={{ color: '#7f8c8d', fontSize: '12px' }}>{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      {review.review && (
                        <p style={{ margin: 0, color: '#2c3e50', fontStyle: 'italic' }}>"{review.review}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
                  <p>No reviews yet for this store.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;