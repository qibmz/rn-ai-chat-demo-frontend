import Constants from 'expo-constants';

/** Expo `version`，如 1.0.0 */
export function getAppVersion(): string {
  return Constants.expoConfig?.version ?? '1.0.0';
}

/** iOS buildNumber / Android versionCode / nativeBuildVersion */
export function getAppBuildNumber(): string {
  const ios = Constants.expoConfig?.ios?.buildNumber;
  if (ios) return String(ios);

  const android = Constants.expoConfig?.android?.versionCode;
  if (android !== undefined && android !== null) return String(android);

  if (Constants.nativeBuildVersion) return String(Constants.nativeBuildVersion);
  return '1';
}

/** 展示用：`1.0.0 (1)` */
export function getAppVersionLabel(): string {
  return `${getAppVersion()} (${getAppBuildNumber()})`;
}
