import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { getAvatarInitials } from '@/lib/utils/userDisplay';
import React from 'react';

type UserAvatarProps = {
  email?: string | null;
  /** NativeWind size classes，如 h-9 w-9 / h-24 w-24 */
  className?: string;
  textClassName?: string;
  /** 外圈装饰环（个人中心大头像） */
  ringed?: boolean;
};

export function UserAvatar({
  email,
  className = 'h-9 w-9',
  textClassName = 'text-sm',
  ringed = false,
}: UserAvatarProps) {
  const avatar = (
    <Avatar className={`bg-muted ${className}`}>
      <AvatarFallbackText className={`text-foreground font-semibold ${textClassName}`}>
        {getAvatarInitials(email)}
      </AvatarFallbackText>
    </Avatar>
  );

  if (!ringed) return avatar;

  return <Box className="border-border bg-muted/40 rounded-full border p-1.5">{avatar}</Box>;
}
