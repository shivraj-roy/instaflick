import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetResentPost } from "@/lib/react-query/queryNmutation";
import { Models } from "appwrite";

const Home = () => {
   const {
      data: posts,
      isPending: isPostLoading,
      isError: isPostError,
   } = useGetResentPost();

   return (
      <div className="flex flex-1">
         <div className="home-container">
            <div className="home-posts">
               <h2 className="h3-bold text-left w-full md:h2-bold">
                  Home Feed
               </h2>
               <div className="flex flex-1 flex-col gap-5">
                  {isPostLoading && !posts ? (
                     <div className="flex flex-1 justify-center items-center">
                        <Loader />
                     </div>
                  ) : (
                     <ul className="flex flex-col flex-1 gap-9 w-full">
                        {posts?.documents.map((post: Models.Document) => (
                           <PostCard key={post.$id} post={post} />
                        ))}
                     </ul>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
export default Home;
