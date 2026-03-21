import React, { useState, useEffect } from 'react';
import { storeAPI, authAPI } from '../services/api';

const UserDashboard = ({ user, onLogout }) => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingData, setRatingData] = useState({ rating: 0, review: '' });
  const [storeReviews, setStoreReviews] = useState([]);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const response = await storeAPI.getStores(filters);
      setStores(response.data);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const handleRatingClick = (store, rating) => {
    setSelectedStore(store);
    setRatingData({ rating, review: store.user_review || '' });
    setShowRatingDialog(true);
  };

  const submitDetailedRating = async () => {
    try {
      await storeAPI.submitRating(selectedStore.id, ratingData.rating, ratingData.review);
      setShowRatingDialog(false);
      setSelectedStore(null);
      setRatingData({ rating: 0, review: '' });
      loadStores();
    } catch (error) {
      alert('Error submitting rating: ' + (error.response?.data?.message || error.message));
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



  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '24px' }}>🏪 StoreHub</h1>
            <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>Welcome back, {user.name}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer' }}
            >
              🔒 Change Password
            </button>
            <button
              onClick={onLogout}
              style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer' }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Rating Dialog */}
        {showRatingDialog && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <h3 style={{ marginTop: 0, color: '#2c3e50', marginBottom: '20px' }}>Rate {selectedStore?.name}</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Your Rating:</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setRatingData({ ...ratingData, rating })}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: ratingData.rating === rating ? '#f1c40f' : '#ecf0f1',
                        color: ratingData.rating === rating ? 'white' : '#7f8c8d',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                      }}
                    >
                      {rating}★
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <p style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>Write a review (optional):</p>
                <textarea
                  placeholder="Share your experience with this store..."
                  value={ratingData.review}
                  onChange={(e) => setRatingData({ ...ratingData, review: e.target.value })}
                  style={{ 
                    width: '100%', 
                    height: '100px', 
                    padding: '12px', 
                    border: '2px solid #ecf0f1', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'Arial, sans-serif'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowRatingDialog(false)}
                  style={{ padding: '12px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitDetailedRating}
                  disabled={ratingData.rating === 0}
                  style={{ 
                    padding: '12px 20px', 
                    backgroundColor: ratingData.rating > 0 ? '#27ae60' : '#bdc3c7', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: ratingData.rating > 0 ? 'pointer' : 'not-allowed' 
                  }}
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        )}

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

        {/* Password Form Modal */}
        {showPasswordForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Change Password</h3>
              <form onSubmit={handlePasswordUpdate}>
                <input
                  type="password"
                  placeholder="New Password (8-16 chars, uppercase + special)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', marginBottom: '20px', fontSize: '16px' }}
                  required
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px' }}>🔍 Find Stores</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#7f8c8d', fontSize: '14px' }}>Store Name</label>
              <input
                placeholder="Search by store name"
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '16px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#7f8c8d', fontSize: '14px' }}>Location</label>
              <input
                placeholder="Search by address"
                onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '2px solid #ecf0f1', borderRadius: '8px', fontSize: '16px' }}
              />
            </div>
            <button
              onClick={loadStores}
              style={{ padding: '12px 25px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* Stores Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '25px' }}>
          {stores.map(store => (
            <div key={store.id} style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              {/* Store Header */}
              <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', color: 'white' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{store.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{parseFloat(store.overall_rating || 0).toFixed(1)}</span>
                  <div style={{ display: 'flex' }}>
                    {[1,2,3,4,5].map(i => (
                      <span key={i} style={{ color: i <= Math.round(store.overall_rating) ? '#f1c40f' : '#bdc3c7', fontSize: '18px' }}>★</span>
                    ))}
                  </div>
                  <span style={{ fontSize: '14px', opacity: 0.9 }}>({store.total_ratings || 0} reviews)</span>
                </div>
              </div>

              {/* Store Content */}
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>📍 Address</p>
                  <p style={{ margin: 0, color: '#2c3e50', lineHeight: '1.4' }}>{store.address}</p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>📧 Contact</p>
                  <p style={{ margin: 0, color: '#3498db' }}>{store.email}</p>
                </div>

                {/* Map Preview */}
                <div style={{ height: '150px', backgroundColor: '#ecf0f1', borderRadius: '8px', marginBottom: '15px', overflow: 'hidden' }}>
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title={`${store.name} location`}
                  />
                </div>

                {/* Your Rating */}
                {store.user_rating && (
                  <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#27ae60', fontSize: '14px', fontWeight: 'bold' }}>✅ Your Rating</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                      {[1,2,3,4,5].map(i => (
                        <span key={i} style={{ color: i <= store.user_rating ? '#f1c40f' : '#bdc3c7', fontSize: '16px' }}>★</span>
                      ))}
                      <span style={{ color: '#27ae60', fontWeight: 'bold' }}>({store.user_rating}/5)</span>
                    </div>
                    {store.user_review && (
                      <p style={{ margin: 0, color: '#2c3e50', fontSize: '13px', fontStyle: 'italic' }}>
                        "{store.user_review}"
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <p style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '14px', fontWeight: 'bold' }}>Rate this store:</p>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => handleRatingClick(store, rating)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: store.user_rating === rating ? '#f1c40f' : '#ecf0f1',
                            color: store.user_rating === rating ? 'white' : '#7f8c8d',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                          }}
                        >
                          {rating}★
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => viewStoreReviews(store)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#9b59b6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    📝 View Reviews ({store.total_ratings})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stores.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏪</div>
            <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>No stores found</h3>
            <p style={{ color: '#bdc3c7' }}>Try adjusting your search criteria or check back later for new stores.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;