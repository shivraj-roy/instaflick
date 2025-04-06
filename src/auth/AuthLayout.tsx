import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
   const isAuthenticated = true;

   return (
      <>
         {isAuthenticated ? (
            <>
               <section className="flex flex-1 justify-center items-center flex-col py-10">
                  <Outlet />
               </section>
               <img
                  src="/assets/images/side-img.svg"
                  alt="side-img"
                  className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
               />
            </>
         ) : (
            <Navigate to="/sign-in" />
         )}
      </>
   );
};

export default AuthLayout;
