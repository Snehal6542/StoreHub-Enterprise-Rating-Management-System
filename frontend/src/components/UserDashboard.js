import React, { useState, useEffect } from 'react';
import { storeAPI, authAPI } from '../services/api';

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
`;

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
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    loadStores();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
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



  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

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
            <h1 style={{ margin: 0, color: '#ffffff', fontSize: '24px' }}>🏪 StoreHub</h1>
            <p style={{ margin: '5px 0 0 0', color: '#aaaaaa' }}>{getGreeting()}, {user.name} • {time.toLocaleTimeString()}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-hover"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
                style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer' }}
            >
              🔒 Change Password
            </button>
            <button
              className="btn-hover"
              onClick={onLogout}
                style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
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
            <div className="animate-slide-in glass-card" style={{ padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px' }}>
              <h3 style={{ marginTop: 0, color: '#ffffff', marginBottom: '20px' }}>Rate {selectedStore?.name}</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 10px 0', color: '#aaaaaa' }}>Your Rating:</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      className="btn-hover"
                      onClick={() => setRatingData({ ...ratingData, rating })}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: ratingData.rating === rating ? '#ffffff' : 'rgba(255,255,255,0.1)',
                        color: ratingData.rating === rating ? '#000000' : '#aaaaaa',
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
                <p style={{ margin: '0 0 10px 0', color: '#aaaaaa' }}>Write a review (optional):</p>
                <textarea
                  className="input-glow"
                  placeholder="Share your experience with this store..."
                  value={ratingData.review}
                  onChange={(e) => setRatingData({ ...ratingData, review: e.target.value })}
                  style={{ 
                    width: '100%', 
                    height: '100px', 
                    padding: '12px', 
                    border: 'none', 
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    color: '#ffffff',
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
                  className="btn-hover"
                  style={{ padding: '12px 20px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  className="btn-hover"
                  onClick={submitDetailedRating}
                  disabled={ratingData.rating === 0}
                  style={{ 
                    padding: '12px 20px',
                    backgroundColor: ratingData.rating > 0 ? '#ffffff' : 'rgba(255,255,255,0.1)',
                    color: ratingData.rating > 0 ? '#000000' : '#777777', 
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
            <div className="animate-slide-in glass-card" style={{ padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#ffffff' }}>Reviews for {selectedStore?.name}</h3>
                <button onClick={() => setShowReviewsModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#ffffff' }}>×</button>
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

        {/* Password Form Modal */}
        {showPasswordForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-slide-in glass-card" style={{ padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px' }}>
              <h3 style={{ marginTop: 0, color: '#ffffff' }}>Change Password</h3>
              <form onSubmit={handlePasswordUpdate}>
                <input
                  type="password"
                  placeholder="New Password (8-16 chars, uppercase + special)"
                  value={newPassword}
                  className="input-glow"
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff', borderRadius: '8px', marginBottom: '20px', fontSize: '16px' }}
                  required
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-hover"
                    onClick={() => setShowPasswordForm(false)}
                    style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-hover"
                    style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="card-hover animate-slide-in glass-card" style={{ padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#ffffff', fontSize: '20px' }}>🔍 Find Stores</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#aaaaaa', fontSize: '14px' }}>Store Name</label>
              <input
                placeholder="Search by store name"
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="input-glow"
                style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '16px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#aaaaaa', fontSize: '14px' }}>Location</label>
              <input
                placeholder="Search by address"
                onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                className="input-glow"
                style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', borderRadius: '8px', fontSize: '16px' }}
              />
            </div>
            <button
              onClick={loadStores}
              className="btn-hover"
                style={{ padding: '12px 25px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* Stores Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '25px' }}>
          {stores.map(store => (
            <div key={store.id} className="card-hover animate-slide-in glass-card" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              {/* Store Header */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', color: 'white' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{store.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{parseFloat(store.overall_rating || 0).toFixed(1)}</span>
                  <div style={{ display: 'flex' }}>
                    {[1,2,3,4,5].map(i => (
                      <span key={i} style={{ color: i <= Math.round(store.overall_rating) ? '#ffffff' : '#666666', fontSize: '18px' }}>★</span>
                    ))}
                  </div>
                  <span style={{ fontSize: '14px', opacity: 0.9 }}>({store.total_ratings || 0} reviews)</span>
                </div>
              </div>

              {/* Store Content */}
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 10px 0', color: '#aaaaaa', fontSize: '14px' }}>📍 Address</p>
                  <p style={{ margin: 0, color: '#ffffff', lineHeight: '1.4' }}>{store.address}</p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 10px 0', color: '#aaaaaa', fontSize: '14px' }}>📧 Contact</p>
                  <p style={{ margin: 0, color: '#cccccc' }}>{store.email}</p>
                </div>

                {/* Map Preview */}
                <div style={{ height: '150px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '8px', marginBottom: '15px', overflow: 'hidden' }}>
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
                  <div style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', border: 'none', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 8px 0', color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>✅ Your Rating</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                      {[1,2,3,4,5].map(i => (
                      <span key={i} style={{ color: i <= store.user_rating ? '#ffffff' : '#555555', fontSize: '16px' }}>★</span>
                      ))}
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>({store.user_rating}/5)</span>
                    </div>
                    {store.user_review && (
                      <p style={{ margin: 0, color: '#cccccc', fontSize: '13px', fontStyle: 'italic' }}>
                        "{store.user_review}"
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <p style={{ margin: '0 0 10px 0', color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>Rate this store:</p>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => handleRatingClick(store, rating)}
                          className="btn-hover"
                          style={{
                            padding: '8px 14px',
                            backgroundColor: store.user_rating === rating ? '#ffffff' : 'rgba(255,255,255,0.1)',
                            color: store.user_rating === rating ? '#000000' : '#aaaaaa',
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
                    className="btn-hover"
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
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
          <div className="animate-slide-in glass-card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '15px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏪</div>
            <h3 style={{ color: '#aaaaaa', marginBottom: '10px' }}>No stores found</h3>
            <p style={{ color: '#777777' }}>Try adjusting your search criteria or check back later for new stores.</p>
          </div>
        )}
      </div>
    </div>
    </div>
    </>
  );
};

export default UserDashboard;