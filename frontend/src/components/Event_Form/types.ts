export interface IFormEvent {
    name: string;
    participants: string[];
    creatorId: string;
}

export interface UserSuggestion {
    id: string;
    name: string;
    email: string;
}

export interface Iuser {
    user: User;
}

export interface User {
    id: string;
    name: string;
    email: string;
}