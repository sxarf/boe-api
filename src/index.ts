export interface Env {
  MY_BUCKET: R2Bucket;
  API_KEY: string; 
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const authHeader = request.headers.get("X-Custom-Auth");
    if (authHeader !== env.API_KEY) {
      return new Response("unauthorized", { status: 401 });
    }

    if (url.pathname === "/download/loader") {
      const object = await env.MY_BUCKET.get('boe.onl.exe');

      if (!object) {
        return new Response("file not found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Content-Type', 'application/octet-stream');
      
      return new Response(object.body, { headers });
    }

    return new Response("boe api is active twin");
  },
};
