import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      
      {/* ---------- TOP SECTION ---------- */}
      <div className="footer-top">
        
        {/* Travel Features */}
        <div className="features">
          <h3>Why Choose WhimTrail?</h3>
          <ul>
            <li>✈ Personalized Travel Recommendations</li>
            <li>🗺 Smart Itinerary Planner</li>
            <li>🏨 Nearby Hotels & Restaurants</li>
            <li>🌦 Weather-Based Suggestions</li>
            <li>💬 24/7 Travel Assistance</li>
          </ul>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h3>Explore the World</h3>
          <iframe
            title="map"
            className="map-frame"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31509.34182563946!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE4LjAiTiA3N8KwMzUnNDMuNyJF!5e0!3m2!1sen!2sin!4v1702202200000"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

      </div>

      {/* ---------- BOTTOM SECTION ---------- */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} WhimTrail — Travel Smarter, Explore Better.</p>
      </div>
    </footer>
  );
}
