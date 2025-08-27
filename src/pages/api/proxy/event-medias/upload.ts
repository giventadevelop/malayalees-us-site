import type { NextApiRequest, NextApiResponse } from "next";
import { getCachedApiJwt, generateApiJwt } from "@/lib/api/jwt";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!API_BASE_URL) {
      res.status(500).json({ error: "API base URL not configured" });
      return;
    }

    if (req.method !== "POST") {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
    }

    let token = await getCachedApiJwt();
    if (!token) {
      token = await generateApiJwt();
    }

    // Forward all query params
    const params = new URLSearchParams();
    for (const key in req.query) {
      const value = req.query[key];
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (typeof value !== 'undefined') {
        params.append(key, value);
      }
    }

    let apiUrl = `${API_BASE_URL}/api/event-medias/upload`;
    const qs = params.toString();
    if (qs) apiUrl += `?${qs}`;

    const fetch = (await import("node-fetch")).default;
    const headers = { ...req.headers, authorization: `Bearer ${token}` };
    delete headers["host"];
    delete headers["connection"];

    // Sanitize headers
    const sanitizedHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (Array.isArray(value)) sanitizedHeaders[key] = value.join("; ");
      else if (typeof value === "string") sanitizedHeaders[key] = value;
    }

    const apiRes = await fetch(apiUrl, {
      method: "POST",
      headers: sanitizedHeaders,
      body: req,
    });

    res.status(apiRes.status);
    apiRes.body.pipe(res);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Internal server error', details: String(err) });
  }
}
