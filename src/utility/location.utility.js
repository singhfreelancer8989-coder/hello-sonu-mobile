import axios from "axios";

export const extractCoordinates = async (inputUrl) => {
    if (!inputUrl) return null;

    let url = inputUrl;

    try {
        const decodedUrl = decodeURIComponent(url);

        const patterns = [
            /@(-?\d+\.\d+),(-?\d+\.\d+)/,           // google place / @lat,lng
            /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,      // google search / apple search
            /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,     // apple maps
            /[?&]sll=(-?\d+\.\d+),(-?\d+\.\d+)/,    // apple share
            /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,       // google place id
            /\/(-?\d+\.\d+),(-?\d+\.\d+)(?:,|\/)/,  // directions
            /(-?\d+\.\d+),(-?\d+\.\d+)/             // fallback (direct coords)
        ];

        const validateCoords = (latStr, lngStr) => {
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                return { latitude: lat, longitude: lng };
            }
            return null;
        };

        // 1. Try to extract directly from the original URL
        for (const pattern of patterns) {
            const match = decodedUrl.match(pattern);
            if (match) {
                const coords = validateCoords(match[1], match[2]);
                if (coords) return coords;
            }
        }

        // 2. Fetch the URL for redirects or embedded metadata
        // Matches short links and map pages that hide coords
        if (url.includes("goo.gl") || url.includes("maps.app.goo.gl") || url.includes("google.com/maps") || url.includes("apple.co") || url.includes("maps.apple.com")) {
            const res = await axios.get(url, {
                maxRedirects: 10,
                validateStatus: () => true,
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });

            // The HTTP client might expose the final URL after following redirects
            const finalUrl = decodeURIComponent(res.request?.responseURL || res.request?.res?.responseUrl || url);

            for (const pattern of patterns) {
                const match = finalUrl.match(pattern);
                if (match) {
                    const coords = validateCoords(match[1], match[2]);
                    if (coords) return coords;
                }
            }

            const html = res.data;
            if (typeof html === 'string') {
                // Look for an embedded redirect/canonical URL
                const redirectMatch = html.match(/https:\/\/(www\.)?google\.com\/maps[^"'><]+/);
                if (redirectMatch) {
                    const decodedRedirect = decodeURIComponent(redirectMatch[0]);
                    for (const pattern of patterns) {
                        const m = decodedRedirect.match(pattern);
                        if (m) {
                            const coords = validateCoords(m[1], m[2]);
                            if (coords) return coords;
                        }
                    }
                }

                // Look for static map center in Google Maps HTML
                const centerMatch = html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/) || html.match(/center=(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (centerMatch) {
                    const coords = validateCoords(centerMatch[1], centerMatch[2]);
                    if (coords) return coords;
                }

                // Look for APP_INITIALIZATION_STATE array for Google maps
                const appInitMatch = html.match(/window\.APP_INITIALIZATION_STATE=\[.*?(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (appInitMatch) {
                    const coords = validateCoords(appInitMatch[1], appInitMatch[2]);
                    if (coords) return coords;
                }

                // specific Apple Maps coordinate match (sometimes embedded as ll=...,... in JS or meta)
                const appleMetaMatch = html.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (appleMetaMatch) {
                    const coords = validateCoords(appleMetaMatch[1], appleMetaMatch[2]);
                    if (coords) return coords;
                }
            }
        }

        return null;

    } catch (err) {
        console.error("Coordinate parsing failed:", err.message);
        return null;
    }
};
