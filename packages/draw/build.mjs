import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { copyFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/*
 * Paths here resolve against this file, not against the caller.
 *
 * The entry point, `dist` and the copied-in files are all written as relative
 * paths, and the copies read their sources relative to this module. Left to the
 * working directory the two disagree the moment the script is run from anywhere
 * but the package, and a copy whose source and destination resolve to the same
 * file succeeds without doing anything.
 */
const HERE = dirname(fileURLToPath(import.meta.url));
process.chdir(HERE);

/**
 * Built with esbuild directly rather than through tsup.
 *
 * tsup registers its own loader for `.module.css` and it wins over anything
 * you configure — the top-level `loader` option, `esbuildOptions`, a custom
 * plugin, all of it. What comes out builds cleanly and passes typecheck, and
 * is broken in two ways at once: the class names ship unhashed as globals
 * (`.bar`, `.panel`, `.round` — ready to collide with anything on the host
 * page) and every imported mapping is `{}`, so `css.bar` is undefined and the
 * toolbar renders with no styles at all.
 *
 * esbuild's own `local-css` loader does the right thing, so it is called here
 * with nothing in between. Types come from tsc.
 */
const shared = {
  /* Pinned rather than inherited: esbuild reads the working directory when its
     service starts, not when the build is configured, so `chdir` alone doesn't
     settle it. */
  absWorkingDir: HERE,
  entryPoints: ["src/index.ts"],
  bundle: true,
  /*
   * No source maps in the tarball.
   *
   * They were more than half of it — 538kB of maps against 226kB of code — and
   * the source they point at isn't published, so the only thing they buy a
   * consumer is a bigger install. The repo is there for anyone who wants to
   * read it.
   */
  sourcemap: false,
  target: "es2022",
  external: ["react", "react-dom", "react/jsx-runtime"],
  loader: { ".module.css": "local-css" },
  logLevel: "warning",
};

rmSync("dist", { recursive: true, force: true });

/*
 * The README, licence and logo live at the repo root, where GitHub reads them
 * — it only detects a licence from the root, and won't badge the repo without
 * one there.
 *
 * npm only reads them from the package directory, so they're copied in at
 * build time rather than kept in two places and allowed to drift.
 */
for (const file of ["README.md", "LICENSE", "logo.svg", "logo-dark.svg"]) {
  copyFileSync(new URL(`../../${file}`, import.meta.url), file);
}

// The stylesheet is identical either way, so only one build writes it.
await build({ ...shared, format: "esm", outfile: "dist/index.js" });
await build({
  ...shared,
  format: "cjs",
  outfile: "dist/index.cjs",
  outExtension: { ".css": ".discard.css" },
});
rmSync("dist/index.discard.css", { force: true });
rmSync("dist/index.discard.css.map", { force: true });

// `--noEmit false` because the tsconfig sets noEmit for the typecheck script,
// and without overriding it tsc reports success and writes nothing.
execFileSync(
  "npx",
  [
    "tsc",
    "--emitDeclarationOnly",
    "--declaration",
    "--noEmit",
    "false",
    "--outDir",
    "dist",
  ],
  { stdio: "inherit" },
);
