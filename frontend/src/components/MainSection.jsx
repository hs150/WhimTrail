import HeroSlider from "./HeroSlider";
import "./mainsection.css";

export default function MainSection() {
  return (
    <section className="main-container">
      
      {/* HERO SLIDER */}
      <div className="hero-wrapper">

        {/* SEARCH BOX */}
        <div className="search-box">
          <h2>Where do you want to travel?</h2>
          <div className="search-row">
            <input type="text" placeholder="Search destinations..." />
            <button>Search</button>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="categories">
        
        <div className="category-grid">

          <div className="cat-card">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" />
            <p>Beaches</p>
          </div>

          <div className="cat-card">
            <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470" />
            <p>Mountains</p>
          </div>

          <div className="cat-card">
            <img src="https://s-i.huffpost.com/gen/1866826/images/o-ADVENTURE-facebook.jpg" />
            <p>Adventure</p>
          </div>

          <div className="cat-card">
            <img src="https://media.architecturaldigest.com/photos/59a834cc0f5802540ef16ecf/master/w_1600%2Cc_limit/GettyImages-104559145.jpg" />
            <p>Historic</p>
          </div>

          <div className="cat-card">
            <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e" />
            <p>Wildlife</p>
          </div>

        </div>
      </div>

    </section>
  );
}
