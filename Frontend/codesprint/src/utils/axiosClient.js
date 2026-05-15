import axios from 'axios'

const axiosClient = axios.create({
    baseURL: 'https://codesprint-backend-p7wk.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;