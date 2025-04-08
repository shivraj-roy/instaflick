import { getCurrentUser } from "@/lib/appwrite/api";
import { IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
   id: "",
   name: "",
   email: "",
   imageUrl: "",
   username: "",
   bio: "",
};

const INITIAL_STATE = {
   user: INITIAL_USER,
   isAuthenticated: false,
   isLoading: true,
   setUser: (() => {}) as React.Dispatch<React.SetStateAction<IUser>>,
   setIsAuthenticated: (() => {}) as React.Dispatch<
      React.SetStateAction<boolean>
   >,
   checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<typeof INITIAL_STATE>(INITIAL_STATE);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<IUser>(INITIAL_USER);
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();

   const checkAuthUser = async () => {
      try {
         const currentUser = await getCurrentUser();
         if (currentUser) {
            setUser({
               id: currentUser.$id,
               name: currentUser.name,
               email: currentUser.email,
               imageUrl: currentUser.imageUrl,
               username: currentUser.username,
               bio: currentUser.bio,
            });
            setIsAuthenticated(true);
            return true;
         }
         // setUser(INITIAL_USER);
         // setIsAuthenticated(false);
         return false;
      } catch (error) {
         console.error("Error checking auth user: ", error);
         return false;
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      if (
         localStorage.getItem("cookieFallback") === "[]" ||
         localStorage.getItem("cookieFallback") === null
      ) {
         navigate("/sign-in");
      }
      checkAuthUser();
   }, []);

   const value = {
      user,
      isAuthenticated,
      isLoading,
      setUser,
      setIsAuthenticated,
      checkAuthUser,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
