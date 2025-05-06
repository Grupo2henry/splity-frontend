"use client";

import Image from "next/image";
import Add_Expenses from "@/components/Add_Expenses/Add_Expenses";
import { useParams } from "next/navigation";

export const Add_Spent = () => {

    const { slug } = useParams();
    const slugNumber = Number(slug);

    return (
        <div className="flex flex-col w-full h-full items-center">
            <Image src="/logo-splity.png" alt="Logo" width={165} height={175} />
            <Add_Expenses slugNumber={slugNumber} />
        </div>
    );
};

export default Add_Spent;