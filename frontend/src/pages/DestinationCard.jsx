import "./destination.css";

export default function DestinationCard({ item }) {
  return (
    <div className="dest-card">
      <img src={item.image} alt={item.name} />
      <div className="dest-info">
        <h3>{item.name}</h3>
        <p>{item.location}</p>
        <div className="dest-rating">⭐ {item.rating}</div>
      </div>
    </div>
  );
}
