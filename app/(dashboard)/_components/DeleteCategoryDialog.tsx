"use client"

type Props = {
    trigger: React.ReactNode;
    category: Category;
}

import { Category } from '@prisma/client';
import React from 'react'
import { DeleteCategory } from '../_actions/categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { TransactionType } from '@/lib/type';

const DeleteCategoryDialog = ({ trigger, category }: Props) => {
    const categoryIdentifier = `${category.name}-${category.type}`;

    // we will also need to revalidate this query after deletion
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async () => {
            toast.success("Category deleted successfully", {
                id: categoryIdentifier
            })

            // this is where we use the queryClient for revalidation
            await queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
        },
        onError: () => {
            toast.error("Something went wrong", {
                id: categoryIdentifier
            })
        }
    })
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to Delete it?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete your category</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => {
                        toast.loading("Deleting category...", {
                            id: categoryIdentifier
                        });

                        deleteMutation.mutate({
                            name: category.name,
                            type: category.type as TransactionType
                        })
                    }}                 
                >
                    Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCategoryDialog