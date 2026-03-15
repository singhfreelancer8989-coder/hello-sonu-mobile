import axios from "axios";

export const extractCoordinates = async (inputUrl) => {
  if (!inputUrl) return null;

  try {
    const url = inputUrl;
    const decodedUrl = decodeURIComponent(url);

    const patterns = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,           // google @lat,lng
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,       // google place id
      /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,      // search query
      /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,     // apple maps
      /[?&]sll=(-?\d+\.\d+),(-?\d+\.\d+)/,    // apple share
      /[?&]near=(-?\d+\.\d+),(-?\d+\.\d+)/,   // apple near
      /\/(-?\d+\.\d+),(-?\d+\.\d+)(?:,|\/)/,  // directions
      /(-?\d+\.\d+),(-?\d+\.\d+)/             // fallback
    ];

    const validateCoords = (latStr, lngStr) => {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);

      if (
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      ) {
        return { latitude: lat, longitude: lng };
      }

      return null;
    };

    // 1️⃣ Try extracting directly from URL
    for (const pattern of patterns) {
      const match = decodedUrl.match(pattern);
      if (match) {
        const coords = validateCoords(match[1], match[2]);
        if (coords) return coords;
      }
    }

    // 2️⃣ Resolve redirects
    const response = await axios.get(url, {
      maxRedirects: 10,
      validateStatus: () => true,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html"
      }
    });

    const finalUrl = decodeURIComponent(
      response.request?.res?.responseUrl ||
      response.request?._redirectable?._currentUrl ||
      url
    );

    // 3️⃣ Extract from final redirected URL
    for (const pattern of patterns) {
      const match = finalUrl.match(pattern);
      if (match) {
        const coords = validateCoords(match[1], match[2]);
        if (coords) return coords;
      }
    }

    const html = response.data;

    if (typeof html === "string") {

      // 4️⃣ Look for Google Maps redirect
      const googleRedirect = html.match(
        /https:\/\/(www\.)?google\.com\/maps[^"'><]+/
      );

      if (googleRedirect) {
        const redirectUrl = decodeURIComponent(googleRedirect[0]);

        for (const pattern of patterns) {
          const match = redirectUrl.match(pattern);
          if (match) {
            const coords = validateCoords(match[1], match[2]);
            if (coords) return coords;
          }
        }
      }

      // 5️⃣ Static map center
      const centerMatch =
        html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/) ||
        html.match(/center=(-?\d+\.\d+),(-?\d+\.\d+)/);

      if (centerMatch) {
        const coords = validateCoords(centerMatch[1], centerMatch[2]);
        if (coords) return coords;
      }

      // 6️⃣ Google initialization state
      const appInitMatch = html.match(
        /window\.APP_INITIALIZATION_STATE=\[.*?(-?\d+\.\d+),(-?\d+\.\d+)/
      );

      if (appInitMatch) {
        const coords = validateCoords(appInitMatch[1], appInitMatch[2]);
        if (coords) return coords;
      }

      // 7️⃣ Apple Maps embedded ll=
      const appleMatch = html.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);

      if (appleMatch) {
        const coords = validateCoords(appleMatch[1], appleMatch[2]);
        if (coords) return coords;
      }
    }

    return null;

  } catch (error) {
    console.error("Coordinate parsing failed:", error.message);
    return null;
  }
};
        