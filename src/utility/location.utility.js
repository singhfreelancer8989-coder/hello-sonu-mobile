import axios from "axios";

export const extractCoordinates = async (inputUrl) => {
    if (!inputUrl) return null;

    let url = inputUrl;

    try {

        // STEP 1 — Resolve Google short links
        if (url.includes("maps.app.goo.gl") || url.includes("goo.gl/maps")) {

            const res = await axios.get(url, {
                maxRedirects: 5,
                validateStatus: () => true,
            });
            const html = res.data;


            // Extract real maps link from HTML
            const redirectMatch = html.match(/https:\/\/www\.google\.com\/maps[^"]+/);
            // console.log("Fetched match:", redirectMatch);

            if (!redirectMatch || !redirectMatch[0]) return null;

            const decoded = decodeURIComponent(redirectMatch[0]);

            const match = decoded.match(/(-?\d+\.\d+),\+?(-?\d+\.\d+)/);

            if (!match) return null;

            return {
                latitude: parseFloat(match[1]),
                longitude: parseFloat(match[2])
            };
        }

        const decoded = decodeURIComponent(url);

        const patterns = [
            /@(-?\d+\.\d+),(-?\d+\.\d+)/,           // google place
            /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,      // google search
            /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,     // apple maps
            /[?&]sll=(-?\d+\.\d+),(-?\d+\.\d+)/,    // apple share
            /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,       // google place id
            /\/(-?\d+\.\d+),(-?\d+\.\d+)(?:,|\/)/,  // directions
            /(-?\d+\.\d+),(-?\d+\.\d+)/             // fallback
        ];

        for (const pattern of patterns) {
            const match = decoded.match(pattern);
            if (match) {
                return {
                    latitude: parseFloat(match[1]),
                    longitude: parseFloat(match[2]),
                };
            }
        }

        return null;

    } catch (err) {
        console.error("Coordinate parsing failed:", err.message);
        return null;
    }
};
