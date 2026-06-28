import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const LeafletMap = ({
  mode = 'view', // 'view' or 'pick'
  markers = [],
  initialRegion,
  onMarkerPress,
  onLocationSelected,
  centerPosition,
  olaMapsApiKey // API Key for Ola Maps
}) => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Default to a central location if not provided
  const lat = initialRegion?.latitude || 20.5937;
  const lng = initialRegion?.longitude || 78.9629;
  const zoom = initialRegion?.latitudeDelta ? Math.round(14 - Math.log2(initialRegion.latitudeDelta)) : 13;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-rotate@0.2.8/dist/leaflet-rotate.js"></script>
        <style>
          html, body { padding: 0; margin: 0; height: 100%; width: 100%; overflow: hidden; }
          #map { height: 100%; width: 100%; }
          /* Fix for leaflet popup close button in webview */
          .leaflet-popup-close-button {
            display: none !important;
          }
          .custom-div-icon {
            background: none !important;
            border: none !important;
          }
          /* Shift bottom controls up when in pick mode to clear the bottom sheet */
          .pick-mode .leaflet-bottom {
            bottom: 220px !important;
          }
          @keyframes bounce {
            0% { transform: translate(-50%, -100%); }
            50% { transform: translate(-50%, -120%); }
            100% { transform: translate(-50%, -100%); }
          }
          .bouncing {
            animation: bounce 0.4s cubic-bezier(0.28, 0.84, 0.42, 1) infinite;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div id="center-marker" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -100%); z-index: 1000; pointer-events: none;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="40" height="60">
            <path fill="rgba(0,0,0,0.2)" d="M12 34c4 0 8-3 8-6 0-3-8-10-8-10s-8 7-8 10c0 3 4 6 8 6z"/>
            <path fill="#e53935" d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z"/>
            <circle cx="12" cy="12" r="5" fill="#ffffff"/>
          </svg>
        </div>
        <script>
        try {
          const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          });

          const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri'
          });

          const googleHybridLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
            maxZoom: 22,
            attribution: '© Google'
          });

          const googleStreetsLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 22,
            attribution: '© Google'
          });

          const olaMapsApiKey = '${olaMapsApiKey || ""}';
          let olaMapsLayer = null;
          if (olaMapsApiKey) {
            olaMapsLayer = L.tileLayer('https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/rendered/{z}/{x}/{y}.png?api_key=' + olaMapsApiKey, {
              maxZoom: 20,
              attribution: '© Ola Maps'
            });
          }

          let defaultLayer = googleHybridLayer;

          window.map = L.map('map', {
            center: [${lat}, ${lng}],
            zoom: ${zoom},
            layers: [defaultLayer],
            zoomControl: false, // Disable default to move it
            rotate: true,
            touchRotate: true,
            rotateControl: false // Disable default to move it
          });

          // Add controls to bottom right
          L.control.zoom({ position: 'bottomright' }).addTo(window.map);
          L.control.rotate({ position: 'bottomright', closeOnZeroBearing: false }).addTo(window.map);

          const baseMaps = {
            "Google Satellite (HD)": googleHybridLayer,
            "Google Streets": googleStreetsLayer,
            "Esri Satellite": satelliteLayer,
            "OSM Street View": streetLayer
          };
          if (olaMapsLayer) {
            baseMaps["Ola Maps"] = olaMapsLayer;
          }
          L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(window.map);

          // Array to keep track of markers
          let layerGroup = L.layerGroup().addTo(window.map);
          let pickerMarker = null;

          function sendDataToNative(type, payload) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
          }

          const mode = '${mode}';

          if (mode === 'pick') {
            document.body.classList.add('pick-mode');
            
            // Show the center crosshair DOM element
            document.getElementById('center-marker').style.display = 'block';
            
            // Add bouncing animation when map moves
            window.map.on('movestart', function() {
              document.getElementById('center-marker').classList.add('bouncing');
            });
            
            window.map.on('move', function(e) {
              const center = window.map.getCenter();
              sendDataToNative('onLocationSelected', { latitude: center.lat, longitude: center.lng });
            });
            
            window.map.on('moveend', function() {
              document.getElementById('center-marker').classList.remove('bouncing');
            });
          }

          window.updateMarkers = function(markersData) {
            layerGroup.clearLayers();
            markersData.forEach(function(m) {
              let customIcon, svgString;

              if (m.id === 'user_location') {
                 // Professional Blue Dot for User Location
                 svgString = \`
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
                     <circle cx="12" cy="12" r="10" fill="rgba(66, 133, 244, 0.3)" />
                     <circle cx="12" cy="12" r="7" fill="#ffffff" />
                     <circle cx="12" cy="12" r="5" fill="#4285F4" />
                   </svg>
                 \`;
                 customIcon = L.divIcon({
                   className: 'custom-div-icon',
                   html: svgString,
                   iconSize: [28, 28],
                   iconAnchor: [14, 14],
                   popupAnchor: [0, -14]
                 });
              } else {
                 // Professional Drop Pin for Properties
                 let pinColor = '#007AFF'; // Default Blue
                 if (m.category === 'plots') pinColor = '#34C759'; // Green
                 else if (m.category === 'house_apartment') pinColor = '#FF9500'; // Orange
                 else if (m.category === 'office_shop') pinColor = '#AF52DE'; // Purple
                 else if (m.category === 'agriculture_land') pinColor = '#A2845E'; // Brown
                 
                 svgString = \`
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="45">
                     <path fill="rgba(0,0,0,0.2)" d="M12 34c4 0 8-3 8-6 0-3-8-10-8-10s-8 7-8 10c0 3 4 6 8 6z"/>
                     <path fill="\${pinColor}" d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z"/>
                     <circle cx="12" cy="12" r="5" fill="#ffffff"/>
                   </svg>
                 \`;
                 customIcon = L.divIcon({
                   className: 'custom-div-icon',
                   html: svgString,
                   iconSize: [30, 45],
                   iconAnchor: [15, 45],
                   popupAnchor: [0, -45]
                 });
              }

              const marker = L.marker([m.latitude, m.longitude], { icon: customIcon });
              
              if (m.title) {
                marker.bindPopup(m.title);
              }
              
              marker.on('click', function() {
                sendDataToNative('onMarkerPress', m.id);
              });
              
              layerGroup.addLayer(marker);
            });
          }

          // Initial markers
          const initialMarkers = ${JSON.stringify(markers)};
          if (initialMarkers.length > 0) {
            window.updateMarkers(initialMarkers);
          }
        } catch (error) {
          sendDataToNative('error', error.message);
        }
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    // If markers change, update them in the webview
    if (webViewRef.current && !loading) {
      const script = `
        try {
          if (typeof window.updateMarkers !== 'undefined') {
            window.updateMarkers(${JSON.stringify(markers)});
          }
        } catch(e) {}
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [markers, loading, mode]);

  useEffect(() => {
    if (webViewRef.current && !loading && centerPosition) {
      const script = `
        try {
          if (typeof window.map !== 'undefined') {
            window.map.flyTo([${centerPosition.latitude}, ${centerPosition.longitude}], 16);
          }
        } catch(e) {}
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [centerPosition, loading]);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'onMarkerPress' && onMarkerPress) {
        onMarkerPress(data.payload); // payload is the id
      } else if (data.type === 'onLocationSelected' && onLocationSelected) {
        onLocationSelected(data.payload); // payload is { latitude, longitude }
      }
    } catch (e) {
      console.log('Error parsing webview message', e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={() => setLoading(false)}
        style={styles.map}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  }
});

export default LeafletMap;
