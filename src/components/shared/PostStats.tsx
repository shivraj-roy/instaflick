import {
   useDeleteSavedPost,
   useGetCurrentUser,
   useLikePost,
   useSavePost,
} from "@/lib/react-query/queryNmutation";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useState } from "react";

type PostStateType = {
   post: Models.Document;
   userId: string;
};

const PostStats = ({ post, userId }: PostStateType) => {
   const likedList = post?.likes.map((like: Models.Document) => like.$id);

   const [likes, setLikes] = useState(likedList);
   const [saved, setSaved] = useState(false);

   const { mutate: likePost } = useLikePost();
   const { mutate: savePost } = useSavePost();
   const { mutate: deleteSavedPost } = useDeleteSavedPost();

   const { data: currentUser } = useGetCurrentUser();

   const handleLikePost = (e: React.MouseEvent) => {
      e.stopPropagation();
      let newLikes = [...likes];
      const hasLiked = newLikes.includes(userId);

      if (hasLiked) {
         newLikes = newLikes.filter((like) => like !== userId);
      } else {
         newLikes.push(userId);
      }
      setLikes(newLikes);
      likePost({
         postId: post.$id,
         likesArray: newLikes,
      });
   };

   const handleSavePost = (e: React.MouseEvent) => {
      e.stopPropagation();
      const savedPostRecord = currentUser?.save.find(
         (savedPost: Models.Document) => savedPost.$id === post.$id
      );
      if (savedPostRecord) {
         setSaved(false);
         deleteSavedPost(savedPostRecord.$id);
      } else {
         setSaved(true);
         savePost({
            postId: post.$id,
            userId: currentUser?.id,
         });
      }
   };

   return (
      <div className="flex justify-between items-center z-20">
         <div className="flex gap-2 mr-5">
            <img
               src={`${
                  checkIsLiked(likes, userId)
                     ? "/assets/icons/liked.svg"
                     : "/assets/icons/like.svg"
               }`}
               alt="like"
               width={18}
               height={18}
               onClick={handleLikePost}
               className="cursor-pointer"
            />
            <p className="small-medium 1g:base-medium">{likes.length}</p>
         </div>
         <div className="flex gap-2">
            <img
               src={
                  saved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
               }
               alt="like"
               width={18}
               height={18}
               onClick={handleSavePost}
               className="cursor-pointer"
            />
         </div>
      </div>
   );
};
export default PostStats;
