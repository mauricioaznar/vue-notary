import {Grantor} from '@/models/Grantor'

export interface Client {
	active: number;
	id: number;
	name: string;
	email: string;
	lastname: string;
	fullname: string;
	grantors: Grantor[];
}