import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { signupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import {
   useCreateUserAccount,
   useSignInAccount,
} from "@/lib/react-query/queryNmutation";
import { useAuthContext } from "@/context/AuthContext";

const SignupForm = () => {
   const { toast } = useToast();
   const { checkAuthUser, isLoading: isAuthLoading } = useAuthContext();
   const navigate = useNavigate();

   const { mutateAsync: createUserAccount, isPending: createUserLoading } =
      useCreateUserAccount();
   const { mutateAsync: signInAccount } = useSignInAccount();

   const form = useForm<z.infer<typeof signupValidation>>({
      resolver: zodResolver(signupValidation),
      defaultValues: {
         name: "",
         username: "",
         email: "",
         password: "",
      },
   });

   async function onSubmit(values: z.infer<typeof signupValidation>) {
      const newUser = await createUserAccount(values);
      if (!newUser) {
         // Handle error
         return toast({
            title: "Error",
            description: "Failed to create user account",
            variant: "destructive",
         });
      }

      const session = await signInAccount({
         email: values.email,
         password: values.password,
      });
      if (!session) {
         // Handle error
         return toast({
            title: "Error",
            description: "Failed to sign in user",
            variant: "destructive",
         });
      }

      const isAuth = await checkAuthUser();
      if (isAuth) {
         form.reset();
         toast({
            title: "Success",
            description: "User account created and signed in successfully",
            variant: "default",
         });
         navigate("/");
      } else {
         return toast({
            title: "Error",
            description: "Failed to authenticate user",
            variant: "destructive",
         });
      }
   }

   return (
      <Form {...form}>
         <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo" />
            <h2 className="h3-bold md:h2-bold py-5 md:py-10">
               Create a new account
            </h2>

            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="flex flex-col gap-4 w-full mt-4"
            >
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                           <Input
                              type="text"
                              className="shad-input"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                           <Input
                              type="text"
                              className="shad-input"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input
                              type="email"
                              className="shad-input"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <Input
                              type="password"
                              className="shad-input"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" className="shad-button_primary">
                  {createUserLoading ? <Loader /> : "Sign up"}
               </Button>
            </form>
            <p className="text-center text-sm text-light-2 mt-4">
               Already have an account?{" "}
               <Link to="/sign-in" className="text-primary-500 hover:underline">
                  Sign in
               </Link>
            </p>
         </div>
      </Form>
   );
};
export default SignupForm;
