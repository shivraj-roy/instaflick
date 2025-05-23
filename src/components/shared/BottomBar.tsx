import { Link, useLocation } from "react-router-dom";
import { bottombarLinks } from "@/constants";

const BottomBar = () => {
   const { pathname } = useLocation();

   return (
      <section className="bottom-bar">
         {bottombarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
               <Link
                  to={link.route}
                  key={link.label}
                  className={`flex-center flex-col gap-1 p-2 transition-all duration-200 ${
                     isActive ? "bg-primary-500 rounded-[10px]" : ""
                  }`}
               >
                  <img
                     src={link.imgURL}
                     alt={link.label}
                     width={16}
                     height={16}
                     className={` ${isActive ? "invert-white" : ""}`}
                  />
                  <p className="subtle-semibold">{link.label}</p>
               </Link>
            );
         })}
      </section>
   );
};
export default BottomBar;
