import {Group} from '@/models/Group'

export interface User {
    id: number;
    name: string;
    lastname: string;
    roleId: number;
    role: {id: number; name: string};
    email: string;
    groups: Group[];
}