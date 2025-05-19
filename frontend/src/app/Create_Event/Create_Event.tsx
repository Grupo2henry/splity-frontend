import EventForm from "@/components/Forms/EventForm/EventForm";

export const Create_Event = () => {
    return (
        <div className="flex flex-col w-full h-full items-center">
            {/* <Image src="/logo-splity.png" alt="Logo" width={165} height={175}/> */}
            <EventForm />
            {/* <NavBar /> */}
        </div>
    );
};

export default Create_Event;