"use client"

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    transactionId: string;
}

import { AlertDialogHeader, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { TransactionType } from '@/lib/type';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import React from 'react'
import { toast } from 'sonner';
import { DeleteCategory } from '../../_actions/categories';
import { DeleteTransaction } from '../_actions/deleteTransaction';

const DeleteTransactionDialog = ({ open, setOpen, transactionId }: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteTransaction,
    onSuccess: async () => {
      toast.success("Transaction deleted successfully", {
        id: transactionId,
      });

      // this is where we use the queryClient for revalidation
      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: transactionId, 
      });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to Delete it?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            transaction
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting transaction...", {
                id: transactionId,
              });

              deleteMutation.mutate(transactionId);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteTransactionDialog