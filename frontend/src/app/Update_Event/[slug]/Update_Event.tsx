// src/app/Event_Details/[slug]/Update_Event/Update_Event.tsx
"use client";

import { useParams } from "next/navigation";
import EventForm from "@/components/Forms/EventForm/EventForm";

const UpdateEventPage = () => {
  const { slug } = useParams();

  // Asegurarse de que slug sea siempre un string antes de pasarlo
  const eventSlug = typeof slug === 'string' ? slug : undefined;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Actualizar Evento</h2>
      {eventSlug && <EventForm slug={eventSlug} />}
      {!eventSlug && <div>Error: ID del evento no encontrado.</div>}
    </div>
  );
};

export default UpdateEventPage;