"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type RouterOutputs } from "@/trpc/shared";
import { Fragment } from "react";
import { IndividualAbbreviatedNameUI } from "../individual/name";
import useGroups from "./groups";

const UserMenuOnClient: React.FC<{
  user: RouterOutputs["user"]["readSelf"];
  student: RouterOutputs["user"]["student"]["read"];
}> = ({ user }) => {
  const { groups, components } = useGroups();

  const { firstName, middleName, lastName } = user;

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
              <AvatarImage src={user.image ? user.image : undefined} />
              <AvatarFallback>
                {[lastName, firstName].map((v) => v.at(0))}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                <IndividualAbbreviatedNameUI
                  name={{
                    first: firstName,
                    middle: middleName,
                    last: lastName,
                  }}
                />
              </p>
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
