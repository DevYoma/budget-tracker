"use server";
import prisma from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSetings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// to update the user choice of currency
export async function UpdateUserCurrency(currency: string){
    const parsedBody = UpdateUserCurrencySchema.safeParse({
        currency
    })

    if(!parsedBody.success){
        throw parsedBody.error
    }

    const user = await currentUser();
    if(!user){
        redirect("/sign-in")
    }

    // update if the user exiss
    const userSettings = await prisma.userSettings.update({
        where: {
            userId: user.id
        }, 
        data: {
            currency, 
        }
    })

    return userSettings
}

