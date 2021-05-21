import axios from 'axios'

export const NOTARY = axios.create(
    { baseURL:  process.env.NODE_ENV === 'production'
        ? 'https://notary-server.mauaznar.com/'
        : 'http://localhost:3002' }
)
NOTARY.defaults.params = {}
NOTARY.interceptors.request.use(
    async(config) => {
        // const token = await AsyncStorage.getItem('token')
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`
        // }
        // return config
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)


