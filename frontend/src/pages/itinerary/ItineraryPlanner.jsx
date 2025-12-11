// src/pages/ItineraryPage.jsx
import React from 'react';
import './Itinerary.css';

export default function ItineraryPage() {
  // Example data — you can replace this with dynamic data later
  const itinerary = [
    {
      day: 1,
      activities: [
        "Arrive in Paris",
        "Visit Eiffel Tower",
        "Dinner at local bistro"
      ]
    },
    {
      day: 2,
      activities: [
        "Louvre Museum",
        "Walk along the Seine",
        "Evening cruise"
      ]
    },
    {
      day: 3,
      activities: [
        "Day trip to Versailles",
        "Explore palace gardens",
        "Return to Paris"
      ]
    }
  ];

  return (
    <div className="itinerary-container"><br />  <br />  <br />    
     <h1 className="itinerary-title">Your Itinerary</h1>

      {itinerary.map((day) => (
        <div key={day.day} className="itinerary-day">
          <h2>Day {day.day}</h2>
          <ul className="itinerary-activities">
            {day.activities.map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}