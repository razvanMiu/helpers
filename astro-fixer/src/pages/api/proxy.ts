import api from "fetch-cache";

export const prerender = false;

export const POST = async ({ request }) => {
  const url = new URL(request.url);
  const requestedUrl = url.searchParams.get("url");

  if (!requestedUrl) {
    return Response.json(
      {
        message: "Missing required url parameter",
      },
      { status: 400 }
    );
  }

  let data: any;

  try {
    data = await request.formData();
  } catch {}

  const headers = JSON.parse(data?.get("headers") || "{}");
  const method = data?.get("method") || "GET";

  const response = await fetch(requestedUrl, {
    method,
    headers,
  });

  console.log(response.headers);
  return response;
};
