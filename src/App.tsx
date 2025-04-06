import { Routes, Route } from "react-router-dom";
import { Home } from "./root/pages";
import SigninForm from "./auth/form/SigninForm";
import SignupForm from "./auth/form/SignupForm";
import AuthLayout from "./auth/AuthLayout";
import RootLayout from "./root/RootLayout";

function App() {
   return (
      <main className="flex h-screen">
         <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
               <Route path="/sign-in" element={<SigninForm />} />
               <Route path="/sign-up" element={<SignupForm />} />
            </Route>

            {/* Private Routes */}
            <Route element={<RootLayout />}>
               <Route index element={<Home />} />
            </Route>
         </Routes>
      </main>
   );
}

export default App;
