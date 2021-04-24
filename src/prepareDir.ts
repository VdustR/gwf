import { emptyDir } from "https://deno.land/std@0.95.0/fs/empty_dir.ts";
import { ensureDir } from "https://deno.land/std@0.95.0/fs/ensure_dir.ts";

const prepareDir = async (dir: string, empty?: true) => {
  console.log("Prepare dir...", dir);
  await ensureDir(dir);
  if (empty) {
    await emptyDir(dir);
  }
};

export default prepareDir;
