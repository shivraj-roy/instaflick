import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LOGO from "/assets/images/logo.svg";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queryNmutation";
import { useAuthContext } from "@/context/AuthContext";

const TopBar = () => {
   const { mutate: signOut, isSuccess } = useSignOutAccount();
   const navigate = useNavigate();
   const { user } = useAuthContext();

   useEffect(() => {
      if (isSuccess) {
         navigate(0);
      }
   }, [isSuccess]);

   return (
      <>
         <section className="topbar">
            <div className="flex-between w-full px-4 py-5">
               <Link to="/" className="flex gap-3 py-4 ">
                  <img src={LOGO} alt="logo" width={130} height={325} />
               </Link>

               <div className="flex gap-4">
                  <Button
                     variant="ghost"
                     className="shad-button_ghost"
                     onClick={() => signOut()}
                  >
                     <img src="/assets/icons/logout.svg" alt="logout" />
                  </Button>
                  <Link
                     to={`/profile/${user.id}`}
                     className="flex-center gap-3"
                  >
                     <img
                        src={
                           user.imageUrl ||
                           "/assets/images/profile-placeholder.svg"
                        }
                        alt="profile"
                        className="h-8 w-8 rounded-full"
                     />
                  </Link>
               </div>
            </div>
         </section>
      </>
   );
};
export default TopBar;
