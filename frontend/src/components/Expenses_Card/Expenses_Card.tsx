"use client"

import Image from "next/image";

const gastosPorDia = [
    {
      fecha: '2025-04-27',
      gastos: [
        { concepto: 'Café', monto: 3.5, hora: '08:30', responsable: 'Juan' },
        { concepto: 'Almuerzo', monto: 12.0, hora: '13:00', responsable: 'Ana' },
        { concepto: 'Transporte', monto: 2.75, hora: '18:00', responsable: 'Juan' }
      ]
    },
    {
      fecha: '2025-04-28',
      gastos: [
        { concepto: 'Supermercado', monto: 45.2, hora: '17:45', responsable: 'Lucía' },
        { concepto: 'Cena', monto: 20.0, hora: '21:00', responsable: 'Ana' }
      ]
    },
  ];
    
export const Expenses_Card = () => {
    return (
            <div className="flex flex-col w-full h-full items-center">
                <div className="flex flex-col w-full gap-6">
                    {gastosPorDia.map((dia, index) => (
                        <div key={index} className="flex flex-col gap-1 ">
                            <p className="text-[16px] text-start text-[#FFFFFF]">{dia.fecha}</p>
                            <div className="rounded-lg bg-[#61587C] p-2">
                                {dia.gastos.map((gasto, index) => (
                                    <div key={index} className="flex flex-col w-full ">
                                        <div className="flex flex-col w-full px-2 bg-[#d9d9d9] rounded-lg" >
                                            <div className="flex flex-row justify-between items-center">
                                                <Image src="/image1.svg" alt="Logo" width={25} height={25}/>
                                                <div className="flex w-full gap-2">
                                                    <div className="flex flex-col w-full ml-2">
                                                        <p className="font-bold">{gasto.concepto}</p>
                                                        <p className="text-sm">Pagado por {gasto.responsable}</p>
                                                    </div>
                                                    <p className="font-bold text-md">AR${gasto.monto}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}                    
                </div>
            </div>      
    );
}

export default Expenses_Card;