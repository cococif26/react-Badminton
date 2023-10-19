import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'

export default axios.create({

   baseURL: process.env.REACT_APP_BACKEND_URL,
   withCredentials: true,

   headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${secureLocalStorage.getItem('token')}`
      // "Access-Control-Allow-Origin": true
   }
})