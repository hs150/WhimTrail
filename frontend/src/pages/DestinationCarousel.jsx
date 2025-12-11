import { useRef } from "react";
import DestinationCard from "./DestinationCard";
import "./carousel.css";

export default function DestinationCarousel({ destinations }) {
  const scroller = useRef();

  const scrollLeft = () => scroller.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scroller.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="carousel-wrapper">
      <h2>Popular Destinations</h2>

      <div className="carousel-container">
        <button className="car-arrow left" onClick={scrollLeft}>❮</button>

        <div className="carousel" ref={scroller}>
          {destinations.map((item, index) => (
            <DestinationCard key={index} item={item} />
          ))}
        </div>

        <button className="car-arrow right" onClick={scrollRight}>❯</button>
      </div>
    </div>
  );
}
