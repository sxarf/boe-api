export interface Env {
  MY_BUCKET: R2Bucket;
  DB: D1Database;
  API_KEY: string;
}

const SERVER_DATA = {
  "min-console-version": "2.9.0",
  "min-version": "1.0.6",
  "menu-version": "1.0",
  "admins": [
    { "name": "cdev", "user-id": "CAF71E0462685D4A" },
    { "name": "sxarf", "user-id": "E1DBFD3996EFOBBE" }
  ],
  "super-admins": [
    "cdev",
    "sxarf"
  ],
  "patreon": [],
  "poll": "hello!",
  "option-a": "hi!",
  "option-b": "hi",
  "detected-mods": [],
  "motd": "$\n-------------------------------------\n\nhello, {user}, welcome to boe.cli, here are some signs for boe!\n\nUD: undetected, meaning you cant get banned for using that mod.\nSD: slightly detected, meaning you can possibly get banned for using that mod.\nRB: rare ban, self explanatory.\nM: master client.\nUT: untested.\nW: means 100% functionality. most mods wont have this cuz im too lazy lolz.",
  "discord-invite": "https://discord.gg/KezkJRZTDn"
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Public endpoint — no API key required
    if (url.pathname === "/serverdata") {
      return new Response(JSON.stringify(SERVER_DATA, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // All other endpoints require authentication
    const authHeader = request.headers.get("X-Custom-Auth");
    if (authHeader !== env.API_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (url.pathname === "/download/loader") {
      const object = await env.MY_BUCKET.get('boe.onl.exe');
      if (!object) return new Response("file not found", { status: 404 });
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Content-Type', 'application/octet-stream');
      return new Response(object.body, { headers });
    }

    return new Response("boe api active");
  },
};
