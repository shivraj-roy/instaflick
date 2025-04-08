import { ID, Query } from "appwrite";
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";

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
