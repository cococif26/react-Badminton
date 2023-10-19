import { createContext, useState } from "react";
import axios from "../api/axios";
import Swal from "sweetalert2";

const UserContext = createContext();

function UserProvider({ children }) {

  const [ user, setUser ] = useState({})

  const me = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie')
      const response = await axios.post('/api/me-admin')
      setUser(response.data)
    } catch(e) {
      if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
        Swal.fire({ icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    }
  }

  return (
    <UserContext.Provider value={
      {user, setUser, me}
    }>
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider }
export default UserContext
