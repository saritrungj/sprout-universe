import assert from "node:assert/strict";
import versionInfo from "../../version.json";
import { latestChange, versionLabel } from "./version";

function testVersionJsonHasReleaseMetadata() {
  assert.match(versionInfo.version, /^\d+\.\d+\.\d+$/);
  assert.match(versionInfo.releasedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(Array.isArray(versionInfo.changelog), true);
  assert.equal(versionInfo.changelog.length > 0, true);
}

function testVersionLabelIncludesPrefix() {
  assert.equal(versionLabel("0.2.0"), "v0.2.0");
  assert.equal(versionLabel("v0.2.0"), "v0.2.0");
}

function testLatestChangeReturnsFirstChangelogItem() {
  assert.equal(latestChange(versionInfo), versionInfo.changelog[0]);
}

testVersionJsonHasReleaseMetadata();
testVersionLabelIncludesPrefix();
testLatestChangeReturnsFirstChangelogItem();

console.log("version tests passed");
