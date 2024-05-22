export const prerender = false;

export const POST = async ({ request }) => {
  const url = new URL(request.url);
  const requestedUrl = url.searchParams.get("url");

  if (!requestedUrl) {
    return new Response(
      JSON.stringify({
        message: "Missing required url parameter",
      }),
      { status: 400 }
    );
  }

  const data = await request.formData();
  const headers = JSON.parse(data.get("headers") || "{}");
  const method = data.get("method") || "GET";

  const response = await fetch(requestedUrl, {
    method,
    headers,
  });

  return response;
};
