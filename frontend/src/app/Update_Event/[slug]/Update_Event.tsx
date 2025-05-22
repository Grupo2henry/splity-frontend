// src/app/Event_Details/[slug]/Update_Event/Update_Event.tsx
"use client";

import { useParams } from "next/navigation";
import EventForm from "@/components/Forms/EventForm/EventForm";
import { useMembership } from "@/context/MembershipContext";

const UpdateEventPage = () => {
  const { slug } = useParams();
  const { actualGroupMembership } = useMembership();

  const eventSlug = typeof slug === 'string' ? slug : undefined;

  if (!eventSlug) {
    return <div>Error: ID del evento no encontrado.</div>;
  }

  if (!actualGroupMembership) {
    return <div className="text-white">Cargando evento...</div>; // o un spinner
  }

  return (
    <div className="p-4">
      <EventForm slug={eventSlug} />
    </div>
  );
};

export default UpdateEventPage;