import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNavigate } from "react-router-dom";
import { Models } from "appwrite";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import FileUploader from "../shared/FileUploader";
import { postValidation } from "@/lib/validation";
import { useCreatePost } from "@/lib/react-query/queryNmutation";
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type PostFormType = {
   post?: Models.Document;
};

const PostForm = ({ post }: PostFormType) => {
   const { user } = useAuthContext();
   const { toast } = useToast();
   const navigate = useNavigate();
   const { mutateAsync: createPost, isPending: isLoadingPost } =
      useCreatePost();

   const form = useForm<z.infer<typeof postValidation>>({
      resolver: zodResolver(postValidation),
      defaultValues: {
         caption: post?.caption || "",
         file: post?.imageUrl ? [post?.imageUrl] : [],
         location: post?.location || "",
         tags: post?.tags.join(", ") || "",
      },
   });

   // 2. Define a submit handler.
   async function onSubmit(values: z.infer<typeof postValidation>) {
      const newPost = await createPost({
         caption: values.caption || "",
         file: values.file,
         location: values.location,
         tags: values.tags,
         userId: user?.id,
      });
      if (!newPost) {
         toast({
            title: "Error",
            description: "Post not created",
            variant: "destructive",
         });
      }
      navigate("/");
      toast({
         title: "Success",
         description: "Post created successfully",
         variant: "default",
      });
      form.reset();
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-9 w-full max-w-5xl"
         >
            <FormField
               control={form.control}
               name="caption"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="shad-form_label">Caption</FormLabel>
                     <FormControl>
                        <Textarea
                           className="shad-textarea custom-scrollbar"
                           {...field}
                        />
                     </FormControl>

                     <FormMessage className="shad-form_message" />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="file"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="shad-form_label">
                        Add Photos
                     </FormLabel>
                     <FormControl>
                        <FileUploader
                           fieldChange={field.onChange}
                           mediaUrl={post?.imageUrl}
                        />
                     </FormControl>

                     <FormMessage className="shad-form_message" />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="location"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="shad-form_label">Location</FormLabel>
                     <FormControl>
                        <Input type="text" className="shad-input" {...field} />
                     </FormControl>

                     <FormMessage className="shad-form_message" />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="tags"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="shad-form_label">Add Tags</FormLabel>
                     <FormControl>
                        <Input
                           type="text"
                           className="shad-input"
                           placeholder="#art, #nature, #travel, etc..."
                           {...field}
                        />
                     </FormControl>

                     <FormMessage className="shad-form_message" />
                  </FormItem>
               )}
            />

            <div className="flex gap-4 items-center justify-end">
               <Button type="button" className="shad-button_dark_4">
                  Cancel
               </Button>
               <Button
                  type="submit"
                  className="shad-button_primary whitespace-nowrap"
               >
                  Submit
               </Button>
            </div>
         </form>
      </Form>
   );
};

export default PostForm;
