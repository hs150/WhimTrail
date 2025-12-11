import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Destinations from "../pages/Destinations";
import DestinationDetail from "../pages/DestinationDetail";
import ItineraryPlanner from "../pages/itinerary/ItineraryPlanner";
import ChatSupport from "../pages/chat/ChatSupport";
import Settings from "../pages/settings/Settings";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/itinerary" element={<ItineraryPlanner />} />
        <Route path="/chat" element={<ChatSupport />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
