import { useEffect, useState } from "react";
import { getUserLocation } from "../services/location.service";

export const useLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const loc = await getUserLocation();
        setLocation(loc);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocation();
  }, []);

  return location;
};