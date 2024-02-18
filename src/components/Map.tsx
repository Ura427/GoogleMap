import React, { useEffect, useState } from "react";

//GOOGLE MAPS
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  MarkerClusterer,
} from "@react-google-maps/api";

//FIREBASE
import { db } from "../config/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

//TYPES
import { Location, MarkerData } from "../types/types";
import { useFirebaseData } from "../hooks/useFirebaseData";

//STYLES
const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function MyComponent() {
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  //MARKERS DATA
  // const [markersData, setMarkersData] = useState<MarkerData[]>([]);
  const markersCollectionRef = collection(db, "markers");
  //Loading GoogleMaps API
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API || "";
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });
  //Center for google map
  const center = {
    lat: 49.839684,
    lng: 24.029716,
  };
  const options = {
    disableDefaultUI: true,
    clickableIcons: false,
  };

  const { markersData } = useFirebaseData();
  console.log(markersData);

  // useEffect(() => {
  //   getAllMarkers();
  // }, []);

  // //FETCH DATA FROM FIREBASE
  // const getAllMarkers = async () => {
  //   try {
  //     const data = await getDocs(markersCollectionRef);
  //     const filteredData: MarkerData[] = data.docs.map((doc) => ({
  //       ...(doc.data() as MarkerData),
  //       id: doc.id,
  //     }));
  //     const sortedData = filteredData.sort(
  //       (a, b) => a.Timestamp.seconds - b.Timestamp.seconds
  //     );
  //     setMarkersData(sortedData);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const onLoad = (map: any) => {
    // // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    // setMap(map);
  };

  const onUnmount = (map: any) => {
    // setMap(null);
  };

  //ADD MARKER/UPDATE PREVIOUS
  const MapClickHandler = async (e: any) => {
    const location: Location = {
      Lat: e.latLng?.lat(),
      Long: e.latLng?.lng(),
    };

    try {
      const newMarkerRef = await addDoc(markersCollectionRef, {
        Location: location,
        Timestamp: Timestamp.now(),
        Next: null,
      });

      // Get the ID of the newly added marker
      const newMarkerId = newMarkerRef.id;

      // Update the previous marker if it exists
      if (markersData.length > 0) {
        const prevMarker = markersData[markersData.length - 1];
        const updatedPrevMarker = { ...prevMarker, Next: newMarkerId };
        const prevMarkerDocRef = doc(collection(db, "markers"), prevMarker.id);
        await updateDoc(prevMarkerDocRef, updatedPrevMarker);
      }
    } catch (error) {
      console.error("Error adding marker:", error);
    }
    //Refetch data from firebase
    // getAllMarkers();
    window.location.reload();
  };

  //DELETE MARKER
  const MarkerDeleteHandler = async (index: number) => {
    try {
      const currMarker = markersData[index];
      const currMarkerDocRef = doc(collection(db, "markers"), currMarker.id);

      //Change Next reference of previous marker
      if (currMarker.Next !== null && index > 0) {
        const prevMarker = markersData[index - 1];
        const updatedMarker = { ...prevMarker, Next: currMarker.Next };
        const prevMarkerDocRef = doc(collection(db, "markers"), prevMarker.id);
        await updateDoc(prevMarkerDocRef, updatedMarker);
      }
      await deleteDoc(currMarkerDocRef);

      //Delete marker on client side
      // setMarkersData((prevMarkersData) =>
      //   prevMarkersData.filter((_, idx) => idx !== index)
      // );
      window.location.reload();
    } catch (error) {
      console.error("Error while deleting marker: " + error);
    }
  };

  //DELETE ALL MARKERS
  const AllMarkersDeleteHandler = async () => {
    try {
      //Perform multiple delete operations via batch
      const snapshot = await getDocs(markersCollectionRef);

      const batch = writeBatch(db);

      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log("All markers deleted successfully.");

      // Clean Client marker data
      // setMarkersData([]);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting markers:", error);
    }
  };

  //MARKER DRAG BEHAVIOUR
  const handleMarkerDrag = async (
    e: google.maps.MapMouseEvent,
    index: number
  ) => {
    if (!e.latLng) {
      console.error("Error: 'e.latLng' is null.");
      return;
    }

    const newLocation: Location = {
      Lat: e.latLng.lat(),
      Long: e.latLng.lng(),
    };

    try {
      //Change currMarker Location in Db
      const currMarker = markersData[index];
      const updatedMarker = { ...currMarker, Location: newLocation };
      const currMarkerDocRef = doc(collection(db, "markers"), currMarker.id);
      await updateDoc(currMarkerDocRef, updatedMarker);
    } catch (error) {
      console.error("Error while updating position: " + error);
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      options={options}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={(e) => MapClickHandler(e)}
    >
      <button
        style={{ position: "absolute", zIndex: "100", top: "1rem" }}
        onClick={AllMarkersDeleteHandler}
      >
        Delete all markers
      </button>

      <MarkerClusterer>
        {(clusterer) => (
          <div>
            {markersData.map((marker, index) => (
              <Marker
                key={index}
                position={{
                  lat: marker.Location.Lat,
                  lng: marker.Location.Long,
                }}
                label={(index + 1).toString()}
                draggable={true}
                onDrag={(e) => handleMarkerDrag(e, index)}
                onClick={() => MarkerDeleteHandler(index)}
                clusterer={clusterer}
              />
            ))}
          </div>
        )}
      </MarkerClusterer>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
