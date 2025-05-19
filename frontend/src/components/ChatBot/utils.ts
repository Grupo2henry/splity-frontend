export type Message = {
    sender: "user" | "bot";
    text: string;
    options?: string[];
};