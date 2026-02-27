import { useState, useEffect, useCallback } from "react";
import { MapPin, Navigation, Search, AlertCircle } from "lucide-react";

const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

export default function CareNearBy() {
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");

  /* ---------------- UTILS ---------------- */

  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const getHospitalCoords = (h) => {
    if (h.lat && h.lon) return { lat: h.lat, lon: h.lon };
    if (h.center) return h.center;
    return null;
  };

  /* ---------------- FETCH ---------------- */

  const fetchHospitals = useCallback(
    async (lat, lon) => {
      setLoading(true);
      setError(null);

      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lon});
          way["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lon});
          relation["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lon});
        );
        out center;
      `;

      let success = false;

      for (const url of OVERPASS_URLS) {
        try {
          const res = await fetch(url, {
            method: "POST",
            body: "data=" + encodeURIComponent(query),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });

          if (!res.ok) continue;

          const data = await res.json();

          let results = data.elements
            .map((h) => {
              const coords = getHospitalCoords(h);
              const distance = coords
                ? getDistanceKm(lat, lon, coords.lat, coords.lon)
                : Infinity;
              return { ...h, distance };
            })
            .sort((a, b) =>
              sortOrder === "asc"
                ? (a.distance ?? 0) - (b.distance ?? 0)
                : (b.distance ?? 0) - (a.distance ?? 0),
            );

          setHospitals(results);
          success = true;
          break;
        } catch (err) {}
      }

      if (!success) {
        setError("All routing servers are busy. Try again shortly.");
      }

      setLoading(false);
    },
    [radiusKm, sortOrder],
  );

  /* ---------------- LOCATION ---------------- */

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setError(`Location access denied or unavailable: ${err.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true },
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchHospitals(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation, radiusKm, sortOrder, fetchHospitals]);

  /* ---------------- MAP ---------------- */

  const openInMaps = (hospital) => {
    const coords = getHospitalCoords(hospital);
    if (!coords) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lon}`;
    window.open(url, "_blank");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col min-h-screen p-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center">
              <MapPin className="text-[#3b82f6]" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent">
              Care Nearby
            </h1>
          </div>
          <p className="text-zinc-300 mt-2">
            Find hospitals and clinics within your vicinity.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setRadiusKm((prev) => (prev >= 20 ? 5 : prev + 5))}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-800 border border-zinc-700 px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <Search size={18} className="text-[#3b82f6]" />
            <span className="text-white font-medium whitespace-nowrap">
              Radius: {radiusKm} km
            </span>
          </button>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-800 border border-zinc-700 px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <Navigation size={18} className="text-blue-500" />
            <span className="text-white font-medium whitespace-nowrap">
              Sort: {sortOrder === "asc" ? "Nearest" : "Farthest"}
            </span>
          </button>

          {!userLocation && !loading && (
            <button
              onClick={getLocation}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2.5 rounded-xl transition-colors font-medium shrink-0 shadow-[0_4px_14px_0_rgba(76,175,80,0.39)]"
            >
              Find Me
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 shadow-sm">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* List */}
      {loading && hospitals.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-500 font-medium animate-pulse">
            Scanning area for medical facilities...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-12">
          {hospitals.length === 0 && !error && userLocation ? (
            <div className="col-span-full py-12 text-center border border-dashed border-zinc-700 bg-zinc-800 rounded-2xl shadow-sm">
              <MapPin size={48} className="mx-auto text-zinc-300 mb-4" />
              <p className="text-zinc-300 text-lg">
                No hospitals found within {radiusKm}km.
              </p>
              <p className="text-zinc-500 text-sm mt-1">
                Try expanding your search radius.
              </p>
            </div>
          ) : (
            hospitals.map((item) => (
              <div
                key={item.id}
                onClick={() => openInMaps(item)}
                className="group bg-zinc-800 border border-zinc-700 hover:border-[#3b82f6]/50 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3b82f6]/10 flex items-start gap-4 shadow-sm"
              >
                <div className="w-12 h-12 shrink-0 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center group-hover:bg-[#3b82f6]/20 transition-colors">
                  <MapPin size={24} className="text-[#3b82f6]" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg truncate group-hover:text-[#3b82f6] transition-colors">
                    {item.tags?.name || "Unnamed Hospital"}
                  </h3>

                  <p className="text-zinc-500 text-sm mt-1 truncate">
                    {item.tags?.["addr:city"] ||
                      item.tags?.["addr:district"] ||
                      item.tags?.["addr:full"] ||
                      "Location N/A"}
                  </p>

                  {item.tags?.["addr:postcode"] && (
                    <p className="text-zinc-300 text-xs mt-0.5">
                      PIN: {item.tags?.["addr:postcode"]}
                    </p>
                  )}
                </div>

                {item.distance !== undefined && (
                  <div className="shrink-0 bg-[#3b82f6]/10 text-[#3b82f6] px-3 py-1.5 rounded-lg text-sm font-bold border border-[#3b82f6]/20">
                    {item.distance.toFixed(1)} km
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* FOOTER DISCLAIMER */}
      <div className="mt-8 pt-4 border-t border-zinc-700 text-center">
        <p className="text-xs text-zinc-500">
          Distance shown is straight-line (air) distance, not the actual travel
          route. Open directions in Google Maps for accurate routing.
        </p>
      </div>
    </div>
  );
}
