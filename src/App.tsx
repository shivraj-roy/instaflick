import { Routes, Route } from "react-router-dom";
import {
   AllUsers,
   CreatePost,
   EditPost,
   Explore,
   Home,
   PostDetails,
   Profile,
   Saved,
   UpdateProfile,
} from "./root/pages";
import SigninForm from "./auth/form/SigninForm";
import SignupForm from "./auth/form/SignupForm";
import AuthLayout from "./auth/AuthLayout";
import RootLayout from "./root/RootLayout";
import { Toaster } from "@/components/ui/toaster";

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
               <Route path="/explore" element={<Explore />} />
               <Route path="/saved" element={<Saved />} />
               <Route path="/all-users" element={<AllUsers />} />
               <Route path="/create-post" element={<CreatePost />} />
               <Route path="/edit-post/:id" element={<EditPost />} />
               <Route path="/post/:id" element={<PostDetails />} />
               <Route path="/profile/:id/*" element={<Profile />} />
               <Route path="/update-profile/:id" element={<UpdateProfile />} />
            </Route>
         </Routes>

         {/* Toast notifications */}
         <Toaster />
      </main>
   );
}

export default App;
