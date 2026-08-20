import { createHash } from "node:crypto";
import { existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export function getDevCachePaths(projectPath, localAppData = process.env.LOCALAPPDATA, temporaryDirectory = tmpdir()) {
  const cacheRoot = localAppData || temporaryDirectory;
  const cacheId = createHash("sha1").update(projectPath).digest("hex").slice(0, 10);

  return {
    cachePath: join(cacheRoot, "Breeze", `next-cache-${cacheId}`),
    linkPath: join(projectPath, ".next"),
  };
}

export function prepareDevCache(projectPath = process.cwd()) {
  const paths = getDevCachePaths(projectPath);
  mkdirSync(paths.cachePath, { recursive: true });

  if (existsSync(paths.linkPath)) {
    rmSync(paths.linkPath, { force: true, recursive: true });
  }

  symlinkSync(paths.cachePath, paths.linkPath, process.platform === "win32" ? "junction" : "dir");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prepareDevCache();
}
