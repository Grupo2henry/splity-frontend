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
    <div className="w-[350px] h-[500px] flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-700 bg-gray-800">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-xl">🤖</span>
        </div>
        <div>
          <h3 className="text-white font-semibold">Asistente Splity</h3>
          <p className="text-gray-400 text-xs">Siempre disponible para ayudarte</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`p-3 rounded-2xl max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-700 text-gray-100 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
            {msg.options && (
              <div className="flex flex-wrap gap-2 mt-3">
                {msg.options.map((opt, j) => (
                  <button
                    key={j}
                    onClick={() => handleOptionClick(opt)}
                    className="bg-gray-700 text-gray-200 text-sm px-4 py-2 rounded-full hover:bg-gray-600 transition-colors duration-200 border border-gray-600"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {step === 0 && (
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribí tu nombre..."
            />
            <button
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              onClick={handleSend}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
