import Image from "next/image";
import Link from "next/link";

const grupos = [
    { id: 1, name: "Viaje a San Martin", cantidad: 4, image: "/image5.svg" },
    { id: 2, name: "Cena de los sabados", cantidad: 5, image: "/image4.svg" },
    { id: 3, name: "Asado con amigos", cantidad: 3, image: "/image1.svg" },
]; 

export const Card_Dashboard = () => {
    return (
            <div className="flex flex-col w-full">
                {grupos.map((grupo) => (
                    <Link key={grupo.id} href="/Event_Details">
                        <div className="flex w-full bg-[#61587C] p-2 rounded-lg mb-6">
                            <Image src={grupo.image} alt="Image" width={77} height={76}/>
                            <div className="w-full flex justify-between">
                                <div className="flex flex-col justify-start items-start ml-2">
                                    <h2 className="text-[#FFFFFF]">{grupo.name}</h2>
                                    <p className="text-[#FFCD82]">{grupo.cantidad} amigos</p>
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