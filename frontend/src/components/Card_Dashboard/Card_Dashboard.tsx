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
        const getUser = async () => {
          try {
            const groups = await fetchGetMyGroups();
            setGroups(groups);
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        };
        const getCreatedGroups = async () => {
          try{
            const groupsCreated = await fetchGetMyGroups('ADMIN');
            setCreatedGroups(groupsCreated);
          }catch(error){
            console.error("Error fetching user:", error)
          }
        }
        getUser();
        getCreatedGroups();
        console.log(createdGroups);
      }, []);
    
    return (
            <div className="flex flex-col w-full">
                {groups.map((group) => (
                    <Link key={group.group.id} href="/Event_Details">
                        <div className="flex w-full bg-[#61587C] p-2 rounded-lg mb-6">
                            <Image src={"./image1.svg"} alt="Image" width={77} height={76}/>
                            <div className="w-full flex justify-between">
                                <div className="flex flex-col justify-start items-start ml-2">
                                    <h2 className="text-[#FFFFFF]">{group.group.name}</h2>
                                    <p className="text-[#FFCD82]">{group.group.cantidad} amigos</p>
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