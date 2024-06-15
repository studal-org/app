import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import {
  useState,
  type ComponentProps,
  type FC,
  type HTMLAttributes,
} from "react";
import { useMediaQuery } from "usehooks-ts";
import PerformanceFilters from "../filters";

const PerformanceTabsFilters: FC = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Trigger />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <Filters className="py-4" />
          <SheetFooter>
            <SheetClose asChild>
              <Close />
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Trigger />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <Filters className="px-2" />
        <DrawerFooter>
          <DrawerClose asChild>
            <Close />
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const title = "Фильтры";

const Trigger: FC<ComponentProps<typeof Button>> = (props) => (
  <Button size="sm" variant="outline" {...props}>
    <Filter className="mr-2 h-4 w-4" /> {title}
  </Button>
);

const Close: FC<ComponentProps<typeof Button>> = (props) => (
  <Button type="submit" {...props}>
    Закрыть
  </Button>
);

const Filters: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>
    <PerformanceFilters />
  </div>
);

export default PerformanceTabsFilters;
