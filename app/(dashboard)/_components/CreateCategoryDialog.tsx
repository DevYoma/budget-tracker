"use client"

type Prop = {
    type: TransactionType;
}

import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { TransactionType } from '@/lib/type';
import { CreateCategorySchema, CreateCategorySchemaType } from '@/schema/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogContent } from '@radix-ui/react-dialog';
import { PlusSquare } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';

const CreateCategoryDialog = ({ type }: Prop) => {
    const [open, setOpen] = React.useState(false);
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type
        }
    })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <Button 
                variant={"ghost"}
                className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground w-full"
            >
                <PlusSquare className="mr-2 h-4 w-4" />
                Create new
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader></DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default CreateCategoryDialog