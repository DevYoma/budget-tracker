"use server"

import prisma from "@/lib/prisma";
import { CreateCategorySchema, CreateCategorySchemaType, DeleteCategorySchema, DeleteCategorySchemaType } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType){
    // console.log(form)
    const parsedBody = CreateCategorySchema.safeParse(form);

    if(!parsedBody.success){
        throw new Error("Bad Request");
    }

    const user = await currentUser();
    if(!user){
        redirect("/sign-in");
    }

    const { icon, name, type } = parsedBody.data;
    const createdCategory =  await prisma.category.create({
        data: {
            userId: user.id, 
            name, 
            type, 
            icon
        }
    })

    console.log(createdCategory)
    return createdCategory;
}

export async function DeleteCategory(form: DeleteCategorySchemaType){
    const parsedBody = DeleteCategorySchema.safeParse(form);

    if (!parsedBody.success) {
        throw new Error("Bad Request");
    }

    const user = await currentUser();
        if (!user) {
        redirect("/sign-in");
    }

    const categories = await prisma.category.delete({
        where: {
            name_userId_type: {
                userId: user.id, 
                name: parsedBody.data.name,
                type: parsedBody.data.type
            },
        },
    })
}