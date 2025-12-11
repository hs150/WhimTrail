import "./popular.css";

export default function Destinations() {
  const destinations = [
    
     { name: "Maldives", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", rating: 4.9, desc: "Tropical paradise with crystal-clear waters.", details: "Overwater bungalows, snorkeling, luxury resorts. Best: Nov-Apr." },
  { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", rating: 4.8, desc: "City of love, art, and culture.", details: "Eiffel Tower, Louvre, Seine cruises. Best: Apr-Oct." },
  { name: "Bali", image: "https://images.unsplash.com/photo-1502920917128-1aa500764b84", rating: 4.8, desc: "Beautiful beaches and peaceful temples.", details: "Ubud rice terraces, Seminyak beaches, yoga retreats. Best: May-Oct." },
  { name: "Dubai", image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1", rating: 4.7, desc: "Luxury lifestyle and desert adventures.", details: "Burj Khalifa, Dubai Mall, desert safaris. Best: Nov-Mar." },
  
  // 15 Indian destinations
  { name: "Goa", image: "https://images.unsplash.com/photo-1552674594-7e88a3a89267", rating: 4.7, desc: "Vibrant beaches, Portuguese heritage, and nightlife.", details: "Baga & Palolem beaches, Old Goa churches, water sports. Best: Nov-Mar." },
  { name: "Kerala Backwaters", image: "https://images.unsplash.com/photo-1572474623903-20738b983235", rating: 4.8, desc: "Serene houseboat cruises through lush canals.", details: "Alleppey houseboats, Kumarakom birdwatching, Ayurveda. Best: Oct-Feb." },
  { name: "Varanasi", image: "https://images.unsplash.com/photo-1577853196105-d9f3f30a5e9e", rating: 4.6, desc: "Ancient ghats, spiritual rituals, and Ganges sunrises.", details: "Ganga Aarti, Kashi Vishwanath, boat rides. Best: Oct-Mar." },
  { name: "Jaipur", image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58", rating: 4.7, desc: "Pink City palaces, forts, and Rajasthani vibrancy.", details: "Amber Fort, City Palace, Hawa Mahal. Best: Oct-Mar." },
  { name: "Munnar", image: "https://images.unsplash.com/photo-1580263278984-afa7b8084293", rating: 4.8, desc: "Rolling tea plantations and misty hill stations.", details: "Tea estates, Eravikulam Park, waterfalls. Best: Sep-May." },
  { name: "Andaman Islands", image: "https://images.unsplash.com/photo-1593941700882-d09e0e00f5a0", rating: 4.9, desc: "Pristine beaches, coral reefs, and island adventures.", details: "Radhanagar Beach, scuba diving, Cellular Jail. Best: Oct-May." },
  { name: "Udaipur", image: "https://images.unsplash.com/photo-1600445443491-95ec4e4cfbda", rating: 4.8, desc: "Lakeside palaces and romantic Lake Pichola views.", details: "Lake Palace, City Palace, boat rides. Best: Oct-Mar." },
  { name: "Ooty", image: "https://images.unsplash.com/photo-1614088616793-d4db9d6a5e90", rating: 4.7, desc: "Nilgiri hills, toy train rides, and colonial charm.", details: "Nilgiri Railway, Botanical Gardens. Best: Sep-Jun." },
  { name: "Rishikesh", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90", rating: 4.7, desc: "Yoga hub, Ganges rapids, and Himalayan foothills.", details: "Rafting, Beatles Ashram, Lakshman Jhula. Best: Mar-May, Sep-Nov." },
  { name: "Coorg", image: "https://images.unsplash.com/photo-1594717496281-82dc2a4b304d", rating: 4.8, desc: "Coffee estates, waterfalls, and misty Western Ghats.", details: "Abbey Falls, coffee plantations, trekking. Best: Oct-Apr." },
  { name: "Hampi", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96", rating: 4.6, desc: "UNESCO ruins, boulder landscapes, and ancient Vijayanagara.", details: "Virupaksha Temple, Vittala complex. Best: Oct-Feb." },
  { name: "Ladakh", image: "https://images.unsplash.com/photo-1598964563207-2b4d7097c2b8", rating: 4.9, desc: "High-altitude lakes, monasteries, and stark beauty.", details: "Pangong Lake, Nubra Valley. Best: May-Sep." },
  { name: "Amritsar", image: "https://images.unsplash.com/photo-1583308078452-9e69e9f1a5a8", rating: 4.6, desc: "Golden Temple, Wagah border, and Sikh heritage.", details: "Harmandir Sahib, Jallianwala Bagh. Best: Oct-Mar." },
  { name: "Pondicherry", image: "https://images.unsplash.com/photo-1572448863042-1ca40f53d79e", rating: 4.7, desc: "French colonial streets, beaches, and Auroville vibes.", details: "Promenade Beach, Aurobindo Ashram. Best: Oct-Mar." },
  { name: "Jaisalmer", image: "https://images.unsplash.com/photo-1600607687871-4ca38292c8a4", rating: 4.8, desc: "Golden fort, desert safaris, and Thar sands.", details: "Jaisalmer Fort, Sam Sand Dunes. Best: Oct-Mar." }

  ];

  return (
    <section className="popular-section">
      <h2>Popular Destinations</h2>

      <div className="popular-grid">
        {destinations.map((item, index) => (
          <div className="pop-card" key={index}>
            <img src={item.image} alt={item.name} />

            <div className="pop-info">
              <h3>{item.name}</h3>
              <p className="rating">⭐ {item.rating}</p>
              <p className="desc">{item.desc}</p>
            </div>
          </div>
          
        ))}
      </div>
    </section>
  );
}
