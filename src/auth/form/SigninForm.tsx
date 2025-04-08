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
import { signinValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queryNmutation";
import { useAuthContext } from "@/context/AuthContext";

const SigninForm = () => {
   const { toast } = useToast();
   const { checkAuthUser, isLoading: isAuthLoading } = useAuthContext();
   const navigate = useNavigate();

   const { mutateAsync: signInAccount, isPending } = useSignInAccount();

   const form = useForm<z.infer<typeof signinValidation>>({
      resolver: zodResolver(signinValidation),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   async function onSubmit(values: z.infer<typeof signinValidation>) {
      console.log("submitted values: ", values);
      const session = await signInAccount({
         email: values.email,
         password: values.password,
      });
      console.log("session: ", session);
      if (!session) {
         console.log("failed to sign in");
         // Handle error
         return toast({
            title: "Error",
            description: "Failed to sign in user",
            variant: "destructive",
         });
      }

      const isAuth = await checkAuthUser();
      if (isAuth) {
         console.log("signed in successfully");
         form.reset();
         toast({
            title: "Success",
            description: "User signed in successfully",
            variant: "default",
         });
         navigate("/");
      } else {
         console.log("failed to sign in");
         return toast({
            title: "Error",
            description: "Log in failed. Please try again",
            variant: "destructive",
         });
      }
   }

   return (
      <Form {...form}>
         <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo" />
            <h2 className="h3-bold md:h2-bold py-5 md:py-10">
               Log in to your account
            </h2>

            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="flex flex-col gap-4 w-full mt-4"
            >
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
                  {isAuthLoading || isPending ? <Loader /> : "Sign in"}
               </Button>
            </form>
            <p className="text-center text-sm text-light-2 mt-4">
               Don&apos;t have an account?{" "}
               <Link to="/sign-up" className="text-primary-500 hover:underline">
                  Sign up
               </Link>
            </p>
         </div>
      </Form>
   );
};
export default SigninForm;
