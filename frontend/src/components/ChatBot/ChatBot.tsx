"use client";

import { useState, useEffect, useRef } from "react";
import { Message } from "./utils";

const ChatBot = () => {

  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "¡Hola! ¿Cómo te llamás?" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);

  if (messages[messages.length - 1].text === "Cerrar chat") {
    return;
  }

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setStep(1);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Mucho gusto, ${input}. ¿Qué querés hacer?`,
          options: ["Saber de nuestro producto", "Contactar soporte"],
        },
      ]);
    }, 500);
  };

  const handleOptionClick = (option: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: option }]);

    setTimeout(() => {
      if (step === 1) {
        if (option === "Saber de nuestro producto") {
          setStep(2);
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Somos una app que busca facilitar la organización de tus eventos, ofreciendo una interface amigable e intuitiva. En Splity podras cargar tus gastos y distribuirlos entre los participantes de tu evento. ¿Quieres saber mas?",
              options: ["Si", "No"],
            },
          ]);
        } else if (option === "Contactar soporte") {
          setStep(99);
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Podés escribirnos a soporte@splity.com",
              options: ["Cerrar chat"],
            },
          ]);
        }
      } else if (step === 2) {
        if (option === "Si") {
            setStep(3);
            setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Podés crear eventos, agregar gastos y dividirlos entre los participantes. También podés ver el saldo de cada uno y enviar recordatorios.",
              options: ["¿Cuánto cuesta?", "¿Cómo funciona?"],
            },
            ]);} else {
                  setStep(99);
                  setMessages((prev) => [
                      ...prev,
                      {
                        sender: "bot",
                        text: "Muchas gracias por tu interés. Si tenés alguna otra consulta, no dudes en preguntar.",
                        options: ["Cerrar chat"],
                      },
                  ]);
            };
      } else if (step === 3) {
        if (option === "¿Cuánto cuesta?") {
            setStep(4);
            setMessages((prev) => [
              ...prev,
              {
                sender: "bot",
                text: "Nuestro servicio tiene dos modalidades: Free Use y Member Use.",
                options: ["Free Use", "Member Use"],
              },
            ]);} else {
                  setStep(99);
                  setMessages((prev) => [
                    ...prev,
                    {
                      sender: "bot",
                      text: "La app es muy fácil de usar. Solo tenés que crear un evento, agregar los gastos y dividirlos entre los participantes. Podés hacerlo desde la app o desde la web.",
                      options: ["Cerrar chat"],
                    },
                  ]);
            };
      } else if (step === 4) {
        setStep(99);
        const response =
          option === "Free Use"
            ? "Podés usarlo gratis mientras no superes los tres eventos activos."
            : "Tenés acceso a todas las funcionalidades de la app, sin límite de eventos activos.";
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: response,
            options: ["Cerrar chat"],
          },
        ]);
      }
    }, 500);
  };

  return (
    <div className="p-4 h-[350px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col">
            <div className={`p-2 rounded-lg max-w-[75%] ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"}`}>
              {msg.text}
            </div>
            {msg.sender === "bot" && msg.options && (
              <div className="flex flex-wrap gap-2 mt-1">
                {msg.options.map((opt, j) => (
                  <button key={j} onClick={() => handleOptionClick(opt)} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded hover:bg-blue-200">                 
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {step === 0 && (
        <div className="flex gap-2">
          <input className="flex-1 border rounded px-2" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribí tu nombre"/>
          <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleSend}>
            Enviar
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
