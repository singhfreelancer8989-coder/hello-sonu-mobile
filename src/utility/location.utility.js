import axios from "axios";

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_API;

// 🔁 Resolve shortened URLs (maps.app.goo.gl → full URL)
async function resolveUrl(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      }
    });
    const finalUrl = response.url || url;
    const html = await response.text();
    // console.log("RESOLVED URL:", finalUrl);
    return { url: finalUrl, html };
  } catch (err) {
    // console.error("Resolve Error:", err.message);
    return { url, html: "" };
  }
}

export async function extractCoordinates(inputUrl, apiKey = GOOGLE_API_KEY) {
  if (!inputUrl) return null;

  try {
    const { url: longUrl, html } = await resolveUrl(inputUrl);
    // console.log("--- Debug: Resolved URL ---", longUrl);

    let match;

    // ✅ 0. HTML scraping for og:image center (Bypasses API restrictions)
    if (html) {
      const metaMatch = html.match(/center=([-+]?\d+\.\d+)(?:%2C|,)([-+]?\d+\.\d+)/);
      if (metaMatch) {
        return {
          latitude: parseFloat(metaMatch[1]),
          longitude: parseFloat(metaMatch[2]),
        };
      }
    }

    // ✅ 1. !3dLAT!4dLNG (best precision)
    match = longUrl.match(/!3d([-+]?\d+\.\d+)!4d([-+]?\d+\.\d+)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }

    // ✅ 2. @LAT,LNG
    match = longUrl.match(/@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }

    // ✅ 3. /search/LAT,LNG
    match = longUrl.match(/\/search\/([-+]?\d+\.\d+),([-+]?\d+\.\d+)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }

    // ✅ 4. q=LAT,LNG
    match = longUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }

    // ✅ 5. ll=LAT,LNG
    match = longUrl.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }

    // ✅ 6. Place ID from !1s (CRITICAL FIX)
    // Replace your !1s logic with this:

    const placeIdMatch = longUrl.match(/!1s([^!]+)/);

    if (placeIdMatch && apiKey) {
      const rawId = placeIdMatch[1];

      // console.log(`--- Debug: Found internal ID ${rawId} ---`);

      // 🔥 Use it as search query instead of place_id
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${rawId}&key=${apiKey}`;

      const res = await fetch(searchUrl);
      const data = await res.json();
      // console.log("API RESPONSE:", data);

      if (data.status === "OK" && data.results.length > 0) {
        const loc = data.results[0].geometry.location;
        return { latitude: loc.lat, longitude: loc.lng };
      }
    }

    // ✅ 7. CID-based links
    const cidMatch = longUrl.match(/cid=(\d+)/);
    if (cidMatch && apiKey) {
      // console.log(`--- Debug: Found CID ${cidMatch[1]} ---`);

      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=cid:${cidMatch[1]}&key=${apiKey}`;
      const res = await fetch(searchUrl);
      const data = await res.json();
      // console.log("API RESPONSE:", data);

      if (data.status === "OK" && data.results.length > 0) {
        const loc = data.results[0].geometry.location;
        return { latitude: loc.lat, longitude: loc.lng };
      }
    }

    // ✅ 8. /place/NAME fallback
    const placeMatch = longUrl.match(/\/place\/([^\/!]+)/);
    if (placeMatch && apiKey) {
      const placeName = decodeURIComponent(
        placeMatch[1].replace(/\+/g, " ")
      );

      // console.log(`--- Debug: Searching by name "${placeName}" ---`);

      const apiUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        placeName
      )}&inputtype=textquery&fields=geometry&key=${apiKey}`;

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.status === "OK" && data.candidates.length > 0) {
        const loc = data.candidates[0].geometry.location;
        return { latitude: loc.lat, longitude: loc.lng };
      }
    }

    // console.warn("❌ No coordinates found.");
    return null;
  } catch (error) {
    // console.error("Extraction failed:", error.message);
    return null;
  }
}

// // 🧪 Test
// extractCoordinates(
//   "https://maps.app.goo.gl/CP6wz9gWrXpygEHbA?g_st=ac"
// ).then(console.log);