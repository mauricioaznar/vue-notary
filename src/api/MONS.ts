import axios from 'axios'

export const MONS = axios.create(
    { baseURL:  process.env.NODE_ENV === 'production'
        ? 'https://monsreal.mauaznar.com/'
        : 'http://localhost:3001' }
)
MONS.defaults.params = {}
MONS.interceptors.request.use(
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


