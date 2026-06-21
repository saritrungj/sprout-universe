import versionInfo from "../../version.json";

export type VersionInfo = {
  version: string;
  releasedAt: string;
  changelog: string[];
};

export const APP_VERSION = versionInfo as VersionInfo;

export function versionLabel(version: string): string {
  return version.startsWith("v") ? version : `v${version}`;
}

export function latestChange(info: VersionInfo): string {
  return info.changelog[0] ?? "";
}
