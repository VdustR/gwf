# gwf

A Google web font downloader

## Requirement

[Deno@v1.9.2](https://deno.land/)

## Install

```sh
deno install \
  --unstable \
  --allow-net \
  --allow-read \
  --allow-write \
  -n gwf \
  https://deno.land/x/gwf/mod.ts
```

## Usage

Select fonts in [Google Fonts](https://fonts.google.com/) and copy the CSS URL from "Use on the web" block.

Execute the command to download the fonts and css to current directory:

```sh
gwf d "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Sans+TC:wght@400;700&display=swap"
```

You can also download them to a specific dir:

```sh
gwf d "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Sans+TC:wght@400;700&display=swap" \
  -o relative/from/current/dir

gwf d "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Sans+TC:wght@400;700&display=swap" \
  -o /absolute/from/root
```

More options:

```sh
gwf d -h
```

## Dev

Run with [Deno@^1.9.2](https://deno.land/)

```sh
deno run \
  --unstable \
  --allow-net \
  --allow-read \
  --allow-write \
  mod.ts d "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Sans+TC:wght@400;700&display=swap"
```

## Docker

```sh
docker run --rm -it -v (pwd)/test:/test hayd/deno:alpine-1.9.1 sh
```

## License

MIT
