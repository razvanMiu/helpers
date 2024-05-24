export const prerender = false;
import articles from "../../resources/articles.json";

export const GET = async ({}) => {
  console.log("Fetching articles...");
  return Response.json(articles);
};
