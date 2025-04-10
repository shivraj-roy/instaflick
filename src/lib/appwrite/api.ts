import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

/* -------------------------------------------------------------------------- */
//*                               AUTHENTICATION                               *//
/* -------------------------------------------------------------------------- */

//* ----------------------------- FOR SIGNING UP ----------------------------- */
export const createUserAccount = async (user: INewUser) => {
   try {
      const newAccount = await account.create(
         ID.unique(),
         user.email,
         user.password,
         user.name
      );
      if (!newAccount) {
         throw new Error("Failed to create user account");
      }

      const avatarUrl = avatars.getInitials(user.name);
      const newUser = await saveUserToDB({
         accountId: newAccount.$id,
         email: user.email,
         name: user.name,
         imageUrl: new URL(avatarUrl),
         username: user.username,
      });
      return newUser;
   } catch (error) {
      console.error("Error creating user account: ", error);
      throw new Error("Failed to create user account");
   }
};

//* -------------------------- FOR SAVING USER TO DB ------------------------- */
export const saveUserToDB = async (user: {
   accountId: string;
   email: string;
   name: string;
   imageUrl: URL;
   username?: string;
}) => {
   try {
      const newUser = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         ID.unique(),
         user
      );
      return newUser;
   } catch (error) {
      console.error("Error saving user to database: ", error);
      throw new Error("Failed to save user to database");
   }
};

//* ----------------------------- FOR SIGNING IN ----------------------------- */
export const signInAccount = async (user: {
   email: string;
   password: string;
}) => {
   try {
      // console.log("Checking for an existing session...");
      const currentUser = await account.get(); // Check if a session is active
      // console.log("User already signed in:", currentUser);
      return currentUser; // Return the current session if it exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (error: any) {
      if (error.code === 401) {
         // No active session, proceed to create a new one
         console.log("No active session found. Creating a new session...");
         try {
            const session = await account.createEmailPasswordSession(
               user.email,
               user.password
            );
            console.log("Session created successfully:", session);
            return session;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
         } catch (sessionError: any) {
            console.error(
               "Error during session creation:",
               sessionError.message
            );
            throw new Error(
               "Failed to sign in. Please check your credentials."
            );
         }
      } else {
         console.error(
            "Unexpected error while checking session:",
            error.message
         );
         throw new Error("Failed to check session status.");
      }
   }
};

//* ----------------------------- FOR SIGNING OUT ---------------------------- */
export const signOutAccount = async () => {
   try {
      const session = await account.deleteSession("current");
      if (!session) {
         throw new Error("Failed to delete session");
      }
      return session;
   } catch (error) {
      console.error("Error signing out: ", error);
      throw new Error("Failed to sign out");
   }
};

//* -------------------------- FOR GETTING USER DATA ------------------------- */
export const getCurrentUser = async () => {
   try {
      const currentUser = await account.get();
      if (!currentUser) {
         throw new Error("User not found");
      }
      const userData = await databases.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         [Query.equal("accountId", currentUser.$id)]
      );
      if (!userData) {
         throw new Error("User data not found");
      }
      const user = userData.documents[0];
      return user;
   } catch (error) {
      console.error("Error getting current user: ", error);
      throw new Error("Failed to get current user");
   }
};

//* --------------------------- FOR CREATING A POST -------------------------- */
export const createPost = async (post: INewPost) => {
   try {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) {
         throw new Error("Failed to upload file");
      }
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
         deleteFile(uploadedFile.$id);
         throw new Error("Failed to get file preview");
      }
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
      const newPost = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         ID.unique(),
         {
            creator: post.userId,
            caption: post.caption,
            imageId: uploadedFile.$id,
            imageUrl: fileUrl,
            location: post.location,
            tags: tags,
         }
      );
      if (!newPost) {
         deleteFile(uploadedFile.$id);
         throw new Error("Failed to create post");
      }
      return newPost;
   } catch (error) {
      console.error("Error creating post: ", error);
      throw new Error("Failed to create post");
   }
};

//* -------------------------- FOR UPLOADING A FILE -------------------------- */
export const uploadFile = async (file: File) => {
   try {
      const uploadedFile = storage.createFile(
         appwriteConfig.storageId,
         ID.unique(),
         file
      );
      return uploadedFile;
   } catch (error) {
      console.error("Error uploading file: ", error);
      throw new Error("Failed to upload file");
   }
};

//* -------------------------- FOR GETTING FILE PREVIEW --------------------- */
export const getFilePreview = (fileId: string) => {
   try {
      const filePreview = storage.getFilePreview(
         appwriteConfig.storageId,
         fileId,
         500,
         500,
         undefined,
         100
      );
      return filePreview;
   } catch (error) {
      console.error("Error getting file preview: ", error);
      throw new Error("Failed to get file preview");
   }
};

//* -------------------------- FOR DELETING A FILE -------------------------- */
export const deleteFile = async (fileId: string) => {
   try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
      return { status: "success", message: "File deleted successfully" };
   } catch (error) {
      console.error("Error deleting file: ", error);
      throw new Error("Failed to delete file");
   }
};
