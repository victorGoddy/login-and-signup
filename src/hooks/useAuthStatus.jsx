import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });

    // Cleanup function to unsubscribe from the auth state listener
    return () => {  
      unsubscribe();
    };
  }, [window.location.pathname]); // Empty dependency array to run the effect only once

  return { loggedIn, checkingStatus };
}
