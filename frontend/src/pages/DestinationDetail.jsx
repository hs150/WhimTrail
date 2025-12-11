import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaStar, FaCalendar, FaDollarSign, FaHeart } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import '../styles/destination-detail.css';

export default function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/destinations/${id}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await response.json();
        setDestination(data);

        // Fetch reviews
        const reviewsResponse = await fetch(`http://localhost:5000/api/reviews/destination/${id}`);
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      } catch (error) {
        console.error('Error fetching destination:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id, token]);

  const handleSave = async () => {
    if (!token) {
      alert('Please login to save destinations');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/save-destination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ destinationId: id })
      });

      if (response.ok) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving destination:', error);
    }
  };

  if (loading) return <div className="loading">Loading destination details...</div>;
  if (!destination) return <div className="error">Destination not found</div>;

  return (
    <div className="destination-detail" style={{ marginTop: '80px' }}>
      {/* Hero Section */}
      <div className="detail-hero">
        <img src={destination.images?.[0] || 'https://via.placeholder.com/1200x500'} alt={destination.name} />
        <div className="hero-overlay">
          <h1>{destination.name}</h1>
          <p className="location">
            <FaMapMarkerAlt /> {destination.location?.city}, {destination.location?.country}
          </p>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-main">
          {/* Info Cards */}
          <div className="info-grid">
            <div className="info-card">
              <FaStar className="icon" style={{ color: '#fbbf24' }} />
              <h3>Rating</h3>
              <p>{destination.rating?.toFixed(1) || 'N/A'} / 5</p>
            </div>
            <div className="info-card">
              <FaCalendar className="icon" style={{ color: '#3b82f6' }} />
              <h3>Best Time</h3>
              <p>{destination.bestTimeToVisit?.start} - {destination.bestTimeToVisit?.end}</p>
            </div>
            <div className="info-card">
              <FaDollarSign className="icon" style={{ color: '#10b981' }} />
              <h3>Budget</h3>
              <p>${destination.estimatedBudget?.min} - ${destination.estimatedBudget?.max}</p>
            </div>
            <div className="info-card">
              <FaCalendar className="icon" style={{ color: '#8b5cf6' }} />
              <h3>Duration</h3>
              <p>{destination.travelDuration?.min} - {destination.travelDuration?.max} {destination.travelDuration?.unit}</p>
            </div>
          </div>

          {/* Description */}
          <section className="section">
            <h2>About</h2>
            <p>{destination.description}</p>
          </section>

          {/* Activities */}
          {destination.activities && destination.activities.length > 0 && (
            <section className="section">
              <h2>Activities</h2>
              <div className="activities-grid">
                {destination.activities.map((activity, idx) => (
                  <div key={idx} className="activity-tag">{activity}</div>
                ))}
              </div>
            </section>
          )}

          {/* Attractions */}
          {destination.attractions && destination.attractions.length > 0 && (
            <section className="section">
              <h2>Top Attractions</h2>
              <div className="attractions-list">
                {destination.attractions.slice(0, 5).map((attraction, idx) => (
                  <div key={idx} className="attraction-item">
                    <h3>{attraction.name}</h3>
                    <p>{attraction.description}</p>
                    <small>📍 {attraction.distanceKm} km away</small>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="section">
            <h2>Reviews ({reviews.length})</h2>
            <div className="reviews-list">
              {reviews.length > 0 ? (
                reviews.slice(0, 5).map((review) => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <h4>{review.title}</h4>
                      <span className="rating">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p className="review-text">{review.comment}</p>
                    <small>by {review.userId?.firstName || 'Anonymous'}</small>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review!</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar">
          <div className="booking-card">
            <button className="save-btn" onClick={handleSave}>
              <FaHeart /> {isSaved ? 'Saved' : 'Save'}
            </button>
            <button className="plan-btn">Plan Trip</button>
            <button className="book-btn">Book Now</button>
          </div>

          {destination.weather && (
            <div className="weather-card">
              <h3>Weather</h3>
              <p className="weather-condition">{destination.weather.condition}</p>
              <p className="temperature">{destination.weather.temperature}</p>
              <p className="best-season">{destination.weather.bestSeason}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
