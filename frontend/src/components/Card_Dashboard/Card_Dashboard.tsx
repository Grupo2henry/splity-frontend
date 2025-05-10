"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import fetchGetMyGroups from "@/services/fetchGetMyGroups";
import { IGroup } from "./types";

export const Card_Dashboard = () => {
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [createdGroups, setCreatedGroups] = useState<IGroup[]>([]);

    useEffect(() => {
        const getUserGroups = async () => {
            try {
                const fetchedGroups = await fetchGetMyGroups();
                setGroups(fetchedGroups);
            } catch (error) {
                console.error("Error fetching user groups:", error);
            }
        };

        const getMyCreatedGroups = async () => {
            try {
                const fetchedCreatedGroups = await fetchGetMyGroups('ADMIN');
                setCreatedGroups(fetchedCreatedGroups);
                // console.log("Created Groups:", fetchedCreatedGroups);
            } catch (error) {
                console.error("Error fetching created groups:", error);
            }
        };

        getUserGroups();
        getMyCreatedGroups();
        // console.log("Created Groups (after calls):", createdGroups);
    }, []);

    return (
        <div className="flex flex-col w-full">
            <h3 className="text-lg font-semibold mb-4 text-white">Mis Grupos:</h3>
            {groups.map((group) => (
                <Link key={group.id} href="/Event_Details">
                    <div className="flex w-full bg-[#61587C] p-2 rounded-lg mb-6">
                        <Image src={"./image1.svg"} alt="Image" width={77} height={76}/>
                        <div className="w-full flex justify-between">
                            <div className="flex flex-col justify-start items-start ml-2">
                                <h2 className="text-[#FFFFFF]">{group.name}</h2>
                                {group.cantidad !== undefined && (
                                    <p className="text-[#FFCD82]">{group.cantidad} amigos</p>
                                )}
                            </div>
                            <button>{'\u27A4'}</button>
                        </div>
                    </div>
                </Link>
            ))}

            <h3 className="text-lg font-semibold mt-8 mb-4 text-white">Grupos Creados por Mí:</h3>
            {createdGroups.map((group) => (
                <Link key={group.id} href="/Event_Details">
                    <div className="flex w-full bg-[#388E3C] p-2 rounded-lg mb-6">
                        <Image src={"./image2.svg"} alt="Created Group Image" width={77} height={76}/>
                        <div className="w-full flex justify-between">
                            <div className="flex flex-col justify-start items-start ml-2">
                                <h2 className="text-[#FFFFFF]">{group.name}</h2>
                                {group.cantidad !== undefined && (
                                    <p className="text-[#A5D6A7]">{group.cantidad} miembros</p>
                                )}
                            </div>
                            <button>{'\u27A4'}</button>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Card_Dashboard;