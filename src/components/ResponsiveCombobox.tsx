import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import * as React from "react";

type ComboBoxResponsiveProps = {
  selectedOption: string | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>;
  options: string[];
};

export function ComboBoxResponsive({
  selectedOption,
  setSelectedOption,
  options,
}: ComboBoxResponsiveProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectedOption ? <>{selectedOption}</> : <>+ Set Category</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0" align="start">
          <StatusList
            options={options}
            setOpen={setOpen}
            setselectedOption={setSelectedOption}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedOption ? <>{selectedOption}</> : <>+ Set status</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            options={options}
            setOpen={setOpen}
            setselectedOption={setSelectedOption}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  options,
  setOpen,
  setselectedOption,
}: {
  options: string[];
  setOpen: (open: boolean) => void;
  setselectedOption: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option}
              value={option}
              onSelect={(value) => {
                setselectedOption(options.find((opt) => opt === value) || null);
                setOpen(false);
              }}
            >
              {option}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
