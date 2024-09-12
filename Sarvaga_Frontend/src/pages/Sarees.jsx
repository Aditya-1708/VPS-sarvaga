import React, { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import axiosInstance from '../api/AxiosInstance';
import PropagateLoader from "react-spinners/PropagateLoader";

const Card = lazy(() => import("../components/Cards/Card"));

export default function Sarees() {
  const [sarees, setSarees] = useState([]);
  const { isLoading } = useAuth0();

  useEffect(() => {
    fetchSarees();
  }, []);

  async function fetchSarees() {
    try {
      const response = await axiosInstance.get("/user/products/Saree", {
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch sarees");
      }

      const data = response.data;
      setSarees(data);
    } catch (error) {
      console.error("Error fetching sarees:", error);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <PropagateLoader color="#A855F7" />
        </div>
      ) : (
        <>
          <Navbar />
          <div className="container mx-auto pr-8 mt-6">
            <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 md:mb-12 text-gray-800">Our Exquisite <span className="text-[#7E408D]">Saree</span> Collection</h1>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><PropagateLoader color="#A855F7" /></div>}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 px-0 sm:px-0">
                {sarees.map((saree) => (
                  <div key={saree.id} className="w-full">
                    <Card product={saree} />
                  </div>
                ))}
              </div>
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
}
