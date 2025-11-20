
export enum Page {
  Home,
  Join,
  Chat,
}

export interface User {
  name: string;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}
