export default function Revalidate({ tags }) {
  return (
    <div class="my-4 flex gap-x-4">
      <button
        class="bg-white text-black px-6 py-2"
        onClick={() => {
          fetch("http://localhost:3000/api/revalidate-all", {
            method: "POST",
          });
        }}
      >
        Revalidate all
      </button>

      <button
        class="bg-white text-black px-6 py-2"
        onClick={() => {
          const form = new FormData();
          form.append("tags", JSON.stringify(tags));
          fetch("http://localhost:3000/api/revalidate-tags", {
            method: "POST",
            body: form,
          });
        }}
      >
        Revalidate tags
      </button>

      <button
        class="bg-white text-black px-6 py-2"
        onClick={async () => {
          const r = await fetch(
            "http://localhost:3000/api/proxy?url=https://jsonplaceholder.typicode.com/todos",
            {
              method: "POST",
            }
          );
          console.log(await r.json());
        }}
      >
        Fetch articles
      </button>
    </div>
  );
}
