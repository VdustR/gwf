import { fontUriPrefix } from "./constants.ts";
import PQueue, {
  DefaultAddOptions,
} from "https://deno.land/x/p_queue@1.0.1/mod.ts";
import PriorityQueue from "https://deno.land/x/p_queue@1.0.1/priority-queue.ts";
import { join, dirname } from "https://deno.land/std@0.95.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.95.0/fs/mod.ts";
import ProgressBar from "https://deno.land/x/progressbar@v0.2.0/progressbar.ts";
import {
  percentageWidget,
  amountWidget,
} from "https://deno.land/x/progressbar@v0.2.0/widgets.ts";

const widgets = [percentageWidget, amountWidget];

const checkPrefix = (urls: string[]) => {
  const urlInUnexpectedUrl = urls.find((url) => !url.startsWith(fontUriPrefix));
  if (urlInUnexpectedUrl) {
    throw new Error(
      `${urlInUnexpectedUrl} is not starts with ${fontUriPrefix}.`
    );
  }
};

const getTargetPath = (url: string, outPutDir: string) => {
  const relativePath = url.substring(fontUriPrefix.length);
  const targetPath = join(outPutDir, relativePath);
  return targetPath;
};

const fetchFont = async (
  url: string,
  outPutDir: string,
  ua: string,
  queue: PQueue<PriorityQueue, DefaultAddOptions>,
  timeoutDelay: number
) => {
  await queue.add(async () => {
    // console.log(`Fetching ${url}`);
    const targetPath = getTargetPath(url, outPutDir);
    ensureDir(dirname(targetPath));
    const timeout = setTimeout(() => {
      throw new Error(`Fetch time out! ${url}`);
    }, timeoutDelay);
    const res = await fetch(url, {
      headers: {
        "User-Agent": ua,
      },
    });
    clearTimeout(timeout);
    const arrayBuffer = await res.arrayBuffer();
    await Deno.writeFile(targetPath, new Uint8Array(arrayBuffer));
  });
};

const fetchFonts = async (
  originalCss: string,
  outPutDir: string,
  ua: string,
  concurrency: number,
  fontFetchTimeoutDelay: number
) => {
  const matches = originalCss.matchAll(/url\(([^)]+)\)/g);
  const urls = [...matches].map((match) => match[1]);
  checkPrefix(urls);
  console.log("Downloading fonts...");
  const pb = new ProgressBar({ total: urls.length, widgets });
  const queue = new PQueue({
    concurrency,
  });
  let finish = 0;
  urls.forEach(async (url) => {
    await fetchFont(url, outPutDir, ua, queue, fontFetchTimeoutDelay);
    pb.update(++finish);
  });
  await queue.onIdle();
  await pb.finish();
  console.log("All font downloaded!");
};

export default fetchFonts;
