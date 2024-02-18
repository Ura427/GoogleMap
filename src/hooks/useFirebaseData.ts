// useFirebaseData.ts
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { MarkerData } from "../types/types";

export const useFirebaseData = () => {
  const [markersData, setMarkersData] = useState<MarkerData[]>([]);
  const markersCollectionRef = collection(db, "markers");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDocs(markersCollectionRef);
        const markerData: MarkerData[] = data.docs.map((doc) => ({
          ...(doc.data() as MarkerData),
          id: doc.id,
        }));
        setMarkersData(markerData);
      } catch (error) {
        console.error("Error fetching marker data:", error);
      }
    };

    fetchData();
  }, []); // Include markersCollectionRef in the dependency array

  // Return the markersData synchronously
  return { markersData };
};
