export interface Env {
  // This matches the 'Variable name' you set in the R2 binding
  MY_BUCKET: R2Bucket;
  
  // This matches the 'Secret' you created
  API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Security Check (The Handshake)
    const authHeader = request.headers.get("X-Custom-Auth");
    if (authHeader !== env.API_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Route handling
    if (url.pathname === "/download/loader") {
      // Fetch from R2
      const object = await env.MY_BUCKET.get('loader.exe');

      if (!object) {
        return new Response("File Not Found", { status: 404 });
      }

      // Prepare file headers
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Content-Type', 'application/octet-stream');
      headers.set('Content-Disposition', 'attachment; filename="loader.exe"');

      return new Response(object.body, { headers });
    }

    return new Response("BOE API System Active", { status: 200 });
  },
};
