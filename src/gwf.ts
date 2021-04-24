import Denomander from "https://deno.land/x/denomander@0.8.2/mod.ts";
import saveCss from "./saveCss.ts";
import fetchFonts from "./fetchFonts.ts";
import prepareDir from "./prepareDir.ts";
import {
  resolve,
  join,
  basename,
  extname,
} from "https://deno.land/std@0.95.0/path/mod.ts";
import {
  minFontFetchTimeoutDelay,
  maxFontFetchTimeoutDelay,
} from "./constants.ts";

const cwd = Deno.cwd();

const program = new Denomander({
  app_name: "gwf",
  app_description: "A Google web font downloader",
  app_version: "0.0.1",
});

program
  .command("d [uri]", "Download Google web font")
  .option("-o --out", "Output directory. Default is current directory")
  .option("-e --empty", "Empty the output dir")
  .option(
    "-n --name",
    ".css file name without extension",
    (name: string) => {
      const base = basename(name);
      if (!base) {
        throw new Error(`Name ${name} is invalid.`);
      }
      const ext = extname(name);
      return ext === "css" ? name : `${base}.css`;
    },
    "fonts"
  )
  .option(
    "-u --ua",
    "User Agent",
    undefined,
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36"
  )
  .option(
    "-c --concurrency",
    "Font files download concurrency",
    (val: unknown) => {
      const num = parseInt(val as string);
      if (Number.isNaN(num))
        throw new Error("Concurrency should be an integer.");
      if (Number.isNaN(num) || num < 1)
        throw new Error(`Concurrency should be greater than or equal to 1.`);
      return num;
    },
    10
  )
  .option(
    "-t --timeout",
    "Font fetch timeout delay(ms)",
    (val: unknown) => {
      const num = parseInt(val as string);
      if (Number.isNaN(num))
        throw new Error("Timeout delay should be an integer.");
      if (Number.isNaN(num) || num < minFontFetchTimeoutDelay)
        throw new Error(
          `Timeout delay should be greater than or equal to ${minFontFetchTimeoutDelay}.`
        );
      if (num > maxFontFetchTimeoutDelay)
        throw new Error(
          `Timeout delay should be less than or equal to ${maxFontFetchTimeoutDelay}.`
        );
      return num;
    },
    minFontFetchTimeoutDelay
  )
  .action(async () => {
    const {
      uri,
      out = "",
      empty,
      name,
      ua,
      concurrency,
      timeout,
    } = (program as unknown) as {
      uri: string;
      out: string;
      empty?: true;
      name: string;
      ua: string;
      concurrency: number;
      timeout: number;
    };
    const res = await fetch(uri, {
      headers: {
        "User-Agent": ua,
      },
    });
    const css = await res.text();
    const targetDir = out ? resolve(cwd, out) : cwd;
    if (out) {
      await prepareDir(targetDir, empty);
    }
    await Promise.all([
      saveCss(css, join(targetDir, name)),
      fetchFonts(css, targetDir, ua, concurrency, timeout),
    ]);
    console.log("Completed!");
    console.log(targetDir);
  })
  .parse(Deno.args);
