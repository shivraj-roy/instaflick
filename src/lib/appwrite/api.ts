import { ID } from "appwrite";
import { INewUser } from "@/types";
import { account } from "./config";

export const createUserAccount = async (user: INewUser) => {
   try {
      const newAccount = await account.create(
         ID.unique(),
         user.email,
         user.password,
         user.name
      );
      return newAccount;
   } catch (error) {
      console.error("Error creating user account: ", error);
      throw new Error("Failed to create user account");
   }
};
