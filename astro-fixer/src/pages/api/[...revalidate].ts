export const prerender = false;

import { revalidateAll, revalidateTags } from "fetch-cache";

const handlers = {
  "revalidate-all": async () => {
    const error = await revalidateAll();
    if (error) {
      return new Response(JSON.stringify({ message: error }), { status: 500 });
    }
    return new Response(JSON.stringify({ message: "Revalidation complete" }));
  },
  "revalidate-tags": async ({ request }) => {
    const formData = await request.formData();
    const tags = JSON.parse(formData.get("tags") || "[]");
    const error = await revalidateTags(tags);
    if (error) {
      return new Response(JSON.stringify({ message: error }), { status: 500 });
    }
    return new Response(JSON.stringify({ message: "Revalidation complete" }));
  },
};

export const POST = async (ctx) => {
  const handler = ctx.params.revalidate;
  if (handler in handlers) {
    return handlers[handler](ctx);
  }
  return new Response(
    JSON.stringify({
      message: `There is no handler for ${handler} revalidation.`,
    })
  );
};
