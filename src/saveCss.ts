import { fontUrlPrefix } from "./constants.ts";
import version from "../version.ts";

const saveCss = async (originalCss: string, path: string) => {
  console.log("Writing css file...", path);
  const newCss = originalCss.replaceAll(fontUrlPrefix, "");
  await Deno.writeTextFile(
    path,
    `/**
 * Downloaded with gwf@${version}
 * https://deno.land/x/gwf
 *
 * 👷 gwf ${Deno.args.join(" ")}
 * 📅 ${new Date().toISOString()}
 */

`.concat(newCss)
  );
  console.log(`CSS file has been written into ${path} successfully!`);
};

export default saveCss;
