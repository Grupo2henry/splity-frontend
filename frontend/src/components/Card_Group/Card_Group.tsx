"use client";

import Link from "next/link";
import { IGroup } from "../Card_Dashboard/types";

interface CardGroupProps {
  group: IGroup;
  subtitleText?: string;           // ej: "miembros" o "amigos"
  bgColor?: string;                // color de fondo (tailwind)
  subtitleColor?: string;          // color del subtítulo (tailwind)
}

export const Card_Group = ({
  group,
  subtitleText = "miembros",
  bgColor = "bg-gray-700",
  subtitleColor = "text-gray-300",
}: CardGroupProps) => {
  return (
    <Link href="/Event_Details">
      <div className={`flex w-full ${bgColor} p-2 rounded-lg mb-6`}>
        <div className="text-5xl">
          {group.emoji || "📁"}
        </div>
        <div className="w-full flex justify-between">
          <div className="flex flex-col justify-start items-start ml-2">
            <h2 className="text-[#FFFFFF]">{group.name}</h2>
            {group.cantidad !== undefined && (
              <p className={`${subtitleColor}`}>{group.cantidad} {subtitleText}</p>
            )}
          </div>
          <button>{'\u27A4'}</button>
        </div>
      </div>
    </Link>
  );
};