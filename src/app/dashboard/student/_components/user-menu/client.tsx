"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { decomposeFullname } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/shared";
import { Fragment } from "react";
import useGroups from "./groups";

const UserMenuOnClient: React.FC<{
  user: RouterOutputs["user"]["read"];
  student: RouterOutputs["user"]["student"]["read"];
}> = ({ user }) => {
  const { groups, components } = useGroups();

  const name = user.fullName && decomposeFullname(user.fullName);

  return (
    <>
      {components.map((component, i) => (
        <Fragment key={i}>{component}</Fragment>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full text-foreground"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {name
                  ? name.firstName.charAt(0) + name.lastName.charAt(0)
                  : user.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {name ? `${name.firstName} ${name.lastName}` : user.email}
              </p>
              {/* <p className="text-xs leading-none text-muted-foreground">
                {group.name}
              </p> */}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {groups.map((group, i) => (
            <Fragment key={i}>
              <DropdownMenuGroup>
                {group.map((item, i) => (
                  <Fragment key={i}>{item}</Fragment>
                ))}
              </DropdownMenuGroup>
              {i !== groups.length - 1 && <DropdownMenuSeparator />}
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserMenuOnClient;
