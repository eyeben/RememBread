import { useState } from "react";
import { ButtonUI } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { List } from "lucide-react";

const sortOptions = [
  { label: "최신순", value: "latest" },
  { label: "인기순", value: "popular" },
  { label: "장발장순", value: "jean-valjean" },
];

const OrderSelector = () => {
  const [selectedSort, setSelectedSort] = useState<string>("최신순");
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ButtonUI
          variant="outline"
          className="rounded-full w-24 px-3 py-1 h-auto text-sm bg-neutral-50 border-none hover:bg-neutral-100 flex justify-start items-center gap-2 "
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <List className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="flex flex-1 items-center justify-center">{selectedSort}</span>
        </ButtonUI>
      </PopoverTrigger>
      <PopoverContent className="max-w-24 p-0 ">
        <Command>
          <CommandGroup>
            {sortOptions.map((option) => (
              <CommandItem
                className="hover:cursor-pointer"
                key={option.value}
                onSelect={() => {
                  setSelectedSort(option.label);
                  setOpen(false);
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default OrderSelector;
