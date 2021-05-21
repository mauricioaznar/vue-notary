import {ActionTree, MutationTree} from 'vuex'
import {NOTARY} from '@/api/NOTARY'

class State {
	rooms = []
	users = []
	clients = []
	grantors = []
	groups = []
	roles = []
	documentStatuses = []
	documentTypes = []
	documentOperations = []
	documentAttachments = []
	appointments = []
	documents = []
}

const mutations = <MutationTree<State>>{
	setRooms: function (state, payload) {
		state.rooms = payload
	},
	setClients: function (state, payload) {
		state.clients = payload
	},
	setUsers: function (state, payload) {
		state.users = payload
	},
	setGrantors: function (state, payload) {
		state.grantors = payload
	},
	setGroups: function (state, payload) {
		state.groups = payload
	},
	
	setRoles: function (state, payload) {
		state.roles = payload
	},
	setDocumentStatuses: function (state, payload) {
		state.documentStatuses = payload
	},
	setDocumentTypes: function (state, payload) {
		state.documentTypes = payload
	},
	setDocumentOperations: function (state, payload) {
		state.documentOperations = payload
	},
	setDocumentAttachments: function (state, payload) {
		state.documentAttachments = payload
	},


	// appointments
	insertAppointment: function (state, payload) {
		state.appointments = [payload, ...state.appointments]
	},
	updateAppointment: function (state, payload) {
		const appointments = state.appointments.filter(ent => ent.id !== payload.id)
		state.appointments = [payload, ...appointments]
	},
	deleteAppointment: function (state, payload) {
		const appointments = state.appointments.filter(ent => ent.id !== payload.id)
		state.appointments = [...appointments]
	},


	// clients
	insertClient: function (state, payload) {
		state.clients = [payload, ...state.clients]
	},
	updateClient: function (state, payload) {
		const clients = state.clients.filter(ent => ent.id !== payload.id)
		state.clients = [payload, ...clients]
	},
	deleteClient: function (state, payload) {
		const clients = state.clients.filter(ent => ent.id !== payload.id)
		state.clients = [...clients]
	},

	// documents
	insertDocument: function (state, payload) {
		state.documents = [payload, ...state.documents]
	},
	updateDocument: function (state, payload) {
		const documents = state.documents.filter(ent => ent.id !== payload.id)
		state.documents = [payload, ...documents]
	},
	deleteDocument: function (state, payload) {
		const documents = state.documents.filter(ent => ent.id !== payload.id)
		state.documents = [...documents]
	},

	// grantors
	insertGrantor: function (state, payload) {
		state.grantors = [payload, ...state.grantors]
	},
	updateGrantor: function (state, payload) {
		const grantors = state.grantors.filter(ent => ent.id !== payload.id)
		state.grantors = [payload, ...grantors]
	},
	deleteGrantor: function (state, payload) {
		const grantors = state.grantors.filter(ent => ent.id !== payload.id)
		state.grantors = [...grantors]
	},



	// groups
	insertGroup: function (state, payload) {
		state.groups = [payload, ...state.groups]
	},
	updateGroup: function (state, payload) {
		const groups = state.groups.filter(ent => ent.id !== payload.id)
		state.groups = [payload, ...groups]
	},
	deleteGroup: function (state, payload) {
		const groups = state.groups.filter(ent => ent.id !== payload.id)
		state.groups = [...groups]
	},


	// users
	insertUser: function (state, payload) {
		state.users = [payload, ...state.users]
	},
	updateUser: function (state, payload) {
		const users = state.users.filter(ent => ent.id !== payload.id)
		state.users = [payload, ...users]
	},
	deleteUser: function (state, payload) {
		const users = state.users.filter(ent => ent.id !== payload.id)
		state.users = [...users]
	},
	
};

const actions = <ActionTree<State, any>>{
	appointments_create({commit}, data) {
		commit('insertAppointment', data)
	},
	appointments_update({commit}, data) {
		commit('updateAppointment', data)
	},
	appointments_delete({commit}, data) {
		commit('deleteAppointment', data)
	},

	clients_create({commit}, data) {
		commit('insertClient', data)
	},
	clients_update({commit}, data) {
		commit('updateClient', data)
	},
	clients_delete({commit}, data) {
		commit('deleteClient', data)
	},

	documents_create({commit}, data) {
		commit('insertDocument', data)
	},
	documents_update({commit}, data) {
		commit('updateDocument', data)
	},
	documents_delete({commit}, data) {
		commit('deleteDocument', data)
	},

	grantors_create({commit}, data) {
		commit('insertGrantor', data)
	},
	grantors_update({commit}, data) {
		commit('updateGrantor', data)
	},
	grantors_delete({commit}, data) {
		commit('deleteGrantor', data)
	},


	groups_create({commit}, data) {
		commit('insertGroup', data)
	},
	groups_update({commit}, data) {
		commit('updateGroup', data)
	},
	groups_delete({commit}, data) {
		commit('deleteGroup', data)
	},


	users_create({commit}, data) {
		commit('insertUser', data)
	},
	users_update({commit}, data) {
		commit('updateUser', data)
	},
	users_delete({commit}, data) {
		commit('deleteUser', data)
	},
	async getStatics ({commit}) {
		const response = await NOTARY.get('statics')
		const {
			rooms,
			clients,
			users,
			grantors,
			groups,
			roles,
			documentStatuses,
			documentTypes,
			documentOperations,
			documentAttachments
		} = response.data
		commit('setRooms', rooms)
		commit('setClients', clients)
		commit('setGrantors', grantors)
		commit('setUsers', users)
		commit('setGroups', groups)
		commit('setRoles', roles)
		commit('setDocumentStatuses', documentStatuses)
		commit('setDocumentTypes', documentTypes)
		commit('setDocumentOperations', documentOperations)
		commit('setDocumentAttachments', documentAttachments)
	}
};

const Statics = {
	namespaced: true,
	state: new State(),
	mutations: mutations,
	actions: actions
};

export default Statics;