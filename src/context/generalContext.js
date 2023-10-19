import { useContext } from "react";
import GeneralContext  from "./general";

export const useGeneralContext = () => {
  const context = useContext(GeneralContext)
  if (!context) {
    throw new Error('useUser must be used within a NotificationProvider');
  }
  return context;
}