import type { APIRoute } from "astro";
// import { generateOgImageForSite } from "@/utils/generateOgImages";

export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 404,
    statusText: "Not found",
  });

  // const buffer = await generateOgImageForSite();
  // return new Response(new Uint8Array(buffer), {
  //   headers: { "Content-Type": "image/png" },
  // });
};
