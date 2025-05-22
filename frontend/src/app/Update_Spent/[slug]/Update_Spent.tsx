"use client";

import Image from "next/image";
import ExpensesForm from "@/components/Forms/ExpensesForm/ExpensesForm";

export const Update_Spent = () => {

    return (
        <div className="flex flex-col w-full h-full items-center">
            <Image src="https://res.cloudinary.com/dn52ctfur/image/upload/v1747872409/logo-splity_squ2hv.png" alt="Logo" width={165} height={175} />
            {<ExpensesForm />}
        </div>
    );
};

export default Update_Spent;