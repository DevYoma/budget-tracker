"use client"

type Prop = {
    type: TransactionType;
    onChange: (value: string) => void
}

type CategoryProp = {
    category: Category
}

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { TransactionType } from '@/lib/type'
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import CreateCategoryDialog from './CreateCategoryDialog';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const CategoryPicker = ({ type, onChange }: Prop) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("")

    React.useEffect(() => {
        if(!value) return;
        onChange(value) // call this when the value or onChange changes
    }, [onChange, value]);;

    const categoriesQuery = useQuery({
        queryKey: ["categories", type], 
        queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
    })

    // console.log(categoriesQuery.data)

    const selectedCategory = categoriesQuery.data?.find((category: Category) => category.name === value);

    const successCallback = React.useCallback((category: Category) => {
        setValue(category.name);
        setOpen((prev) => !prev)
    }, [setValue, setOpen])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select Category"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} successCallback={successCallback}/>
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create a new Category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoriesQuery.data &&
                categoriesQuery.data.map((category: Category) => (
                  <CommandItem
                    key={category.name}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "mr-2 w-4 h-4 opacity-0",
                        value === category.name && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryPicker

function CategoryRow({ category }: CategoryProp) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
