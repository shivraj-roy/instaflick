import { useAuthContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardType = {
   post: Models.Document;
};

const PostCard = ({ post }: PostCardType) => {
   const { user } = useAuthContext();

   if (!post.creator) return null;

   return (
      <div className="post-card">
         <div className="flex-between">
            <div className="flex gap-3 items-center">
               <Link to={`/profile/${post.creator.$id}`}>
                  <img
                     src={
                        post?.creator?.imageUrl ||
                        "/assets/icons/profile-placeholder.svg"
                     }
                     alt="user-avatar"
                     className="rounded-full w-10 lg:h-12"
                  />
               </Link>

               <div className="flex flex-col">
                  <p className="base-medium 1g: body-bold text-light-1">
                     {post.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                     <p className="subtle-semibold lg:small-regular">
                        {multiFormatDateString(post.$createdAt)}
                     </p>
                     <p className="subtle-semibold 1g: small-regular">
                        {post.location}
                     </p>
                  </div>
               </div>
            </div>

            {post.creator.$id === user?.id && (
               <Link to={`/update-post/${post.$id}`}>
                  <img
                     src="/assets/icons/edit.svg"
                     alt="edit-icon"
                     width={24}
                     height={24}
                  />
               </Link>
            )}
         </div>

         <Link to={`/posts/${post.$id}`}>
            <div className="small-medium lg:base-medium py-5">
               <p>{post.caption}</p>
               <ul className="flex gap-1 mt-2">
                  {post.tags.map((tag: string) => (
                     <li key={tag} className=" text-light-3">
                        #{tag}
                     </li>
                  ))}
               </ul>
            </div>
            <img
               src={
                  post.imageUrl
                     ? "/logo.jpeg"
                     : "/assets/icons/profile-placeholder.svg"
               }
               alt="post-image"
               className="post-card_img"
            />
            <p className="text-light-3 text-center text-[12px] flex mt-2">
               Actual Img is blocked by backend...
            </p>
         </Link>
         <PostStats post={post} userId={user.id} />
      </div>
   );
};
export default PostCard;
