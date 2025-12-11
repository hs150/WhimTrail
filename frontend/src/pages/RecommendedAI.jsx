import { useEffect, useState } from "react";
import DestinationCard from "./DestinationCard";
import "./recommended.css";
import API from "../services/api";

export default function RecommendedAI() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    API.get("/recommend/ai").then((res) => {
      setRecommendations(res.data);
    });
  }, []);

  return (
    <section className="ai-section">
      <h2>Top Picks For You (AI Recommended)</h2>

      <div className="ai-grid">
        {recommendations.map((item, index) => (
          <DestinationCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}
