"use client";

import { Button } from "@/components/ui/button";
import { type ssoAccounts } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { Loader2, Tag, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC } from "react";

const ProfileSsoProviderAccountActions: FC<{
  profileSsoProviderAccountActions: typeof ssoAccounts.$inferSelect;
}> = ({ profileSsoProviderAccountActions: { provider, id, isPrimary } }) => {
  const router = useRouter();
  const onSuccess = () => {
    router.refresh();
  };

  const { mutate: mutateMakePrimary, isPending: isPendingMakePrimary } =
    api.user.sso.makePrimary.useMutation({ onSuccess });
  const { mutate: mutateUnlink, isPending: isPendingUnlink } =
    api.user.sso.unlink.useMutation({ onSuccess });

  const isPending = isPendingMakePrimary || isPendingUnlink;

  return (
    <>
      {!isPrimary && (
        <Button
          disabled={isPending}
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => mutateMakePrimary({ provider, id })}
        >
          {isPendingMakePrimary && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <Tag className="w-4 h-4 mr-2" /> Сделать основным
        </Button>
      )}
      <Button
        disabled={isPending}
        variant="secondary"
        size="sm"
        className="text-destructive w-full"
        onClick={() => mutateUnlink({ provider, id })}
      >
        {isPendingUnlink && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Trash className="w-4 h-4 mr-2" /> Отвязать
      </Button>
    </>
  );
};

export default ProfileSsoProviderAccountActions;
