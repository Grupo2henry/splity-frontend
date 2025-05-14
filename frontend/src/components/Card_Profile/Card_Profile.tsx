"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const CardProfile = ({ onToggle }: { onToggle: () => void }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <button
      onClick={onToggle}
      className="flex items-center space-x-2 cursor-pointer"
    >
      {user.profile_picture_url ? (
        <Image
          src={user.profile_picture_url}
          alt={user.name || user.username || "Perfil"}
          width={30}
          height={30}
          className="rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-profile.png";
          }}
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-600">
            {user.name?.charAt(0).toUpperCase() ||
              user.username?.charAt(0).toUpperCase() ||
              "?"}
          </span>
        </div>
      )}
      <span className="text-sm font-semibold">
        {user.name?.split(" ")[0] || user.username || "Mi Cuenta"}
      </span>
    </button>
  );
};

export default CardProfile;
