import { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import LOGO from "/assets/images/logo.svg";
import { useSignOutAccount } from "@/lib/react-query/queryNmutation";
import { useAuthContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Button } from "../ui/button";

const LeftSideBar = () => {
   const { mutate: signOut, isSuccess } = useSignOutAccount();
   const navigate = useNavigate();
   const { user } = useAuthContext();
   const { pathname } = useLocation();

   useEffect(() => {
      if (isSuccess) {
         navigate(0);
      }
   }, [isSuccess]);

   return (
      <>
         <nav className="leftsidebar">
            <div className="flex flex-col gap-4">
               <Link to="/" className="flex gap-3 py-4 ">
                  <img src={LOGO} alt="logo" width={170} height={36} />
               </Link>

               <Link
                  to={`/profile/${user.id}`}
                  className="flex item-center gap-3"
               >
                  <img
                     src={
                        user.imageUrl ||
                        "/assets/images/profile-placeholder.svg"
                     }
                     alt="profile"
                     className="h-14 w-14 rounded-full"
                  />
                  <div className="flex flex-col gap-1">
                     <p className="text-lg font-semibold">{user.name}</p>
                     <p className="text-sm text-light-4">@{user.username}</p>
                  </div>
               </Link>

               <ul className="flex flex-col gap-4">
                  {sidebarLinks.map((link: INavLink) => {
                     const isActive = pathname === link.route;
                     return (
                        <li
                           key={link.label}
                           className={`leftsidebar-link group ${
                              isActive ? "bg-primary-500" : ""
                           }`}
                        >
                           <NavLink
                              to={link.route}
                              className="flex items-center gap-3 p-4"
                           >
                              <img
                                 src={link.imgURL}
                                 alt={link.label}
                                 width={24}
                                 height={24}
                                 className={`group-hover:invert-white ${
                                    isActive ? "invert-white" : ""
                                 }`}
                              />
                              <p className="text-base font-semibold">
                                 {link.label}
                              </p>
                           </NavLink>
                        </li>
                     );
                  })}
               </ul>
            </div>

            <Button
               variant="ghost"
               className="shad-button_ghost"
               onClick={() => signOut()}
            >
               <img src="/assets/icons/logout.svg" alt="logout" />
               <p className="small-medium lg:base-medium">Logout</p>
            </Button>
         </nav>
      </>
   );
};
export default LeftSideBar;
