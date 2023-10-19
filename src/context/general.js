import { createContext, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const GeneralContext = createContext()

function GeneralProvider({children}) {

  const [ triggerNotif, setTriggerNotif ] = useState(false)
  // const [ gorName, setGorName ] = useState('')
  // const [ contact, setContact ] = useState({})
  // const [expiration, setExpiration] = useState({resend_limit: null, customer_expiration: null, recent_resend: null})

  const [resendPhoneNumber, setResendPhoneNumber] = useState('')

  const [defaultPhone, setDefaultPhone] = useState('')

  const handleSetContact = (contact_obj) => {
    // setContact(contact_obj)
    secureLocalStorage.setItem('contact', contact_obj)
  }

  const handleSetGorName = (gorName_string) => {
    // setGorName(gorName_string)
    secureLocalStorage.setItem('gor_name', gorName_string)
  }

  const handleSetExpiration = (expiration_obj) => {
    // setExpiration(expiration_obj)
    secureLocalStorage.setItem('exp', expiration_obj)
  }

  const handleSetResendPh = (phoneNumber_string) => {
    // setResendPhoneNumber(phoneNumber_string)
    secureLocalStorage.setItem('resend_ph', phoneNumber_string)
  }

  return (
    <GeneralContext.Provider value={
      { setTriggerNotif, triggerNotif, handleSetGorName, handleSetContact, handleSetResendPh, handleSetExpiration, setDefaultPhone, defaultPhone}
    }>
      {children}
    </GeneralContext.Provider>
  )
}

export { GeneralProvider }
export default GeneralContext