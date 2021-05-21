export interface Appointment {
    id: number;
    active: number;
    createdAt: string;
    updatedAt: number;
    editable: boolean;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    roomId: number;
    room?: {name: string};
    roomName?: string;
    finished: number;
    createdByUserId: number;
    clients: {id: string}[];
    users: {id: string}[];
}