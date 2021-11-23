import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string | null;
  avatar: string | null; 
}

type AuthContextType = {
  user: User | undefined;
  signInWithPopup: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode
}
export const AuthContext = createContext({} as AuthContextType );

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user
  
        setUser ({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })
      return () => {
        unsubscribe();
      }
  }, [])

  async function signInWithPopup() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      setUser ({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithPopup }}>
      {props.children}
    </AuthContext.Provider>
  )
}