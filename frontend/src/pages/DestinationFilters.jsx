import { useState } from "react";
import "./filters.css";

export default function DestinationFilters({ onFilter }) {
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const applyFilters = () => {
    onFilter({ category, rating, minBudget, maxBudget });
  };

  return (
    <div className="filters">
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">Category</option>
        <option value="beach">Beach</option>
        <option value="mountain">Mountain</option>
        <option value="adventure">Adventure</option>
        <option value="historic">Historic</option>
      </select>

      <select onChange={(e) => setRating(e.target.value)}>
        <option value="">Rating</option>
        <option value="4.5">4.5+</option>
        <option value="4">4.0+</option>
      </select>

      <input type="number" placeholder="Min Budget" onChange={(e) => setMinBudget(e.target.value)} />
      <input type="number" placeholder="Max Budget" onChange={(e) => setMaxBudget(e.target.value)} />

      <button onClick={applyFilters}>Apply</button>
    </div>
  );
}
