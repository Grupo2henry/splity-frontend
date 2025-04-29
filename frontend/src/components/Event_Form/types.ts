export interface IFormEvent {
    eventName: string;
    currency: string;
    participants: Participant[];
    createrName: string;
}

interface Participant {
    name: string;
}