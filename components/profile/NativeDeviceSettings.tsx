import { ProfileSwitchRow } from '@/components/profile/ProfileSwitchRow';
import { BellIcon, PhoneIcon } from '@/components/ui/icon';
import { useHapticsPreference } from '@/lib/hooks/useHapticsPreference';
import { useNotificationPermission } from '@/lib/hooks/useNotificationPermission';
import React from 'react';

/** 仅在原生 App 挂载：通知权限 + 触感反馈 */
export function NativeDeviceSettings() {
  const notifications = useNotificationPermission();
  const haptics = useHapticsPreference();

  return (
    <>
      <ProfileSwitchRow
        label="通知权限"
        hint={notifications.enabled ? '已授权系统通知' : '用于接收重要提醒'}
        icon={BellIcon}
        value={notifications.enabled}
        disabled={notifications.busy}
        onValueChange={(value) => {
          void notifications.setNotificationEnabled(value);
        }}
      />
      <ProfileSwitchRow
        label="触感反馈"
        hint={haptics.enabled ? '操作时震动反馈' : '已关闭'}
        icon={PhoneIcon}
        value={haptics.enabled}
        disabled={!haptics.ready || haptics.busy}
        onValueChange={(value) => {
          void haptics.setHapticsEnabled(value);
        }}
      />
    </>
  );
}
