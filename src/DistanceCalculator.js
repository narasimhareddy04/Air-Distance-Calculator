import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";
import "./styles.css";
const DistanceCalculator = () => {
  const [pointA, setPointA] = useState("");
  const [pointB, setPointB] = useState("");
  const [distance, setDistance] = useState("");
  const [isLoading, setLoading] = useState(false);
  const calculateDistance = async () => {
    setLoading(true);
    try {
      const responseA = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${pointA}&key=8cc7a7b1ab3d4ff596eaf03fa660c0e5`
      );
      const responseB = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${pointB}&key=8cc7a7b1ab3d4ff596eaf03fa660c0e5`
      );

      const { lat: latA, lng: lngA } = responseA.data.results[0].geometry;
      const { lat: latB, lng: lngB } = responseB.data.results[0].geometry;

      const radlatA = (Math.PI * latA) / 180;
      const radlatB = (Math.PI * latB) / 180;
      const theta = lngA - lngB;
      const radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlatA) * Math.sin(radlatB) +
        Math.cos(radlatA) * Math.cos(radlatB) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344; // Convert miles to kilometers
      dist = dist.toFixed(2);

      setDistance(`Distance: ${dist}km`);
      setLoading(false);
      toast.success("Distance calculated");
    } catch (error) {
      console.error(error);

      toast.error("Error calculating distance");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-900 text-white h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Air Distance Calculator
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pointA" className="block font-medium mb-1">
            Point A (Latitude, Longitude)
          </label>
          <input
            id="pointA"
            type="text"
            value={pointA}
            onChange={(e) => setPointA(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="pointB" className="block font-medium mb-1">
            Point B (Latitude, Longitude)
          </label>
          <input
            id="pointB"
            type="text"
            value={pointB}
            onChange={(e) => setPointB(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button onClick={calculateDistance} className="card">
        Calculate
      </button>
      <div className="flex justify-center">
        {isLoading ? (
          <Spinner />
        ) : (
          distance && (
            <div className="kard">
              <h1 className="text-2xl"> {distance}</h1>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DistanceCalculator;
