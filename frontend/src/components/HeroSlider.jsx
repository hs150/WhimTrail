import { useState, useEffect, useMemo } from "react";
import "./slider.css";

export default function HeroSlider() {
  const images = useMemo(() => [
    "https://a.cdn-hotels.com/gdcs/production113/d940/a239798a-3c36-4ba7-8293-1b342ed5b8e8.jpg", // Beach
    "https://hips.hearstapps.com/hmg-prod/images/mt-assiniboine-provincial-park-at-sunrise-royalty-free-image-1623253564.jpg", // Mountains
    "https://lh3.googleusercontent.com/proxy/x_G9V7Eg3Hlj2tfjlk4EGGwGhgBKimvcRUNQc33wh8_j704AcWWUk2qasxo4KQG8LkX0ybrFDiNe_ftcSilHYNoxV1Lizgl1oc9Pz8MDorVR-u5Q5r2A71Oks7GevGsehK5ZQFdTbuFtpT63CWjjB9EraqL2HvfLZy9Fslg57wb0vVPUFOCq0hjJCFcIyG1nE7uo1zL8IS7OKv100XHM8-4s1A", // buildings
    "https://th.bing.com/th/id/R.347a9a00d16c2c314e49cf37f63e0351?rik=CKjhJkkdJz6uxQ&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fek1wbXg.jpg&ehk=Mww6%2bYb6NM5fzi6QUEYY%2beAM9v1EmZnmEpaKztW2Wa0%3d&risl=&pid=ImgRaw&r=0"// Forest
  ], []);

  const [index, setIndex] = useState(0);

useEffect(() => {
  if (images.length === 0) return;

  const interval = setInterval(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, 4000);

  return () => clearInterval(interval);
}, [images]);

const gotoSlide = (i) => images.length > 0 && setIndex(i);
const prevSlide = () =>
  setIndex(index === 0 ? images.length - 1 : index - 1);
const nextSlide = () =>
  setIndex((index + 1) % images.length);
  return (
    <div className="slider">
      
      {/* Images */}
      <div className="slides" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((img, i) => (
          <img key={i} src={img} className="slide-img" />
        ))}
      </div>

      {/* Arrows */}
      <button className="arrow left" onClick={prevSlide}>❮</button>
      <button className="arrow right" onClick={nextSlide}>❯</button>

      {/* Dots */}
      <div className="dots">
        {images.map((_, i) => (
          <span key={i} className={`dot ${i === index ? "active" : ""}`} onClick={() => gotoSlide(i)}></span>
        ))}
      </div>

      {/* Text Overlay */}
      <div className="hero-text">
        <h1>Explore the World with WhimTrail</h1>
        <p>Find destinations, plan trips, and travel smarter.</p>
      </div>
    </div>
  );
}
