"use server";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { UserFormData, userSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export const createUser = async (formData: UserFormData) => {
    try {
        const validatedData = userSchema.parse(formData);

        await db.insert(users).values(validatedData);
        revalidatePath("/");
        return { success: true };
    } catch (e) {
        return { error: "Failed to create user", source: e };
    }
};
