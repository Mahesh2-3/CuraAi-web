import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Camera, Mic } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";

export default function Permissions() {
  const [permissions, setPermissions] = useState({
    location: false,
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    isAlert: true,
  });

  const closeModal = () =>
    setModalState((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    async function checkPermissions() {
      try {
        if (navigator.permissions) {
          const geoStatus = await navigator.permissions.query({
            name: "geolocation",
          });

          setPermissions({
            location: geoStatus.state === "granted",
          });
        }
      } catch (err) {}
    }
    checkPermissions();
  }, []);

  const handleToggle = async (type) => {
    try {
      if (type === "Location") {
        if (!permissions.location) {
          navigator.geolocation.getCurrentPosition(
            () => {
              setPermissions((prev) => ({ ...prev, location: true }));
            },
            () => {
              setPermissions((prev) => ({ ...prev, location: false }));
            },
          );
        } else {
          setPermissions((prev) => ({ ...prev, location: false }));
        }
      }
    } catch (err) {
      setModalState({
        isOpen: true,
        title: "Permission Denied",
        message: `Unable to access ${type}. Please allow permission in browser settings.`,
        type: "error",
        isAlert: true,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile/settings"
            className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="text-zinc-300" size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">App Permissions</h1>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm divide-y divide-zinc-700">
          {/* Location */}
          <div className="flex items-center justify-between p-6 hover:bg-zinc-750 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <MapPin className="text-blue-500" size={20} />
              </div>
              <span className="font-medium text-white">Location</span>
            </div>
            <button
              onClick={() => handleToggle("Location")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                permissions.location ? "bg-[#3b82f6]" : "bg-zinc-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  permissions.location ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        isAlert={modalState.isAlert}
        confirmText="OK"
      />
    </div>
  );
}
