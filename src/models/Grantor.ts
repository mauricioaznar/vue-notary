import {Client} from '@/models/Client'

export interface Grantor {
	id: number;
	email: string;
	name: string;
	lastname: string;
	active: number;
	fullname: string;
	clients: Client[];
}