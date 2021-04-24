import { fontUriPrefix } from "./constants.ts";

const saveCss = async (originalCss: string, path: string) => {
  console.log("Writing css file...", path);
  const newCss = originalCss.replaceAll(fontUriPrefix, "./");
  await Deno.writeTextFile(path, newCss);
  console.log(`CSS file has been written into ${path} successfully!`);
};

export default saveCss;
