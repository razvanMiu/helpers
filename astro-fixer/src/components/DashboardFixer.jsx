import { createSignal } from "solid-js";
import { fixHost } from "../helpers";

const tableauHost = "https://tableau-public.discomap.eea.europa.eu";

const parser = typeof window !== "undefined" && new DOMParser();

export default function DashboardFixer() {
  const [fixed, setFixed] = createSignal(false);
  const [data, setData] = createSignal([]);
  const [properties, setProperties] = createSignal({
    host: "",
  });
  const [error, setError] = createSignal({});

  function fixData() {
    if (fixed()) return;
    if (!data().length) {
      setError({ message: "No data to fix" });
      return;
    }
    setError({});

    const newData = [];

    data().forEach((item, index) => {
      const host = item["@id"].split("/").slice(0, 5).join("/");
      // Update properties
      item = fixHost(item, host, properties().host);
      if (item["@type"] !== "Dashboard") {
        newData.push(item);
        return;
      }
      const dashboardWindow = parser.parseFromString(item.embed, "text/html");
      // Fix tableau
      const paramsEl = dashboardWindow.querySelectorAll("param");
      const params = {};
      // Get params
      for (const param of paramsEl) {
        const name = param.getAttribute("name");
        const value = decodeURIComponent(param.getAttribute("value"));
        params[name] = value;
      }
      // Get sheetname
      const [, sheetname] = params["name"].split("/");
      // Update item
      item["@type"];
      item["tableau_visualization"] = {
        "@id": item["@id"],
        url: tableauHost + "/views" + `/${params["name"]}`,
        hideTabs: params["tabs"] === "no",
        hideToolbar: params["toolbar"] === "no",
        toolbarPosition: "Top",
        sheetname,
      };
      item["temporal_coverage"] = item.temporalCoverage.reduce((acc, value) => {
        if (!acc.temporal) {
          acc.temporal = [];
        }
        if (value < 0) return acc;
        acc.temporal.push({
          label: value,
          value,
        });
        return acc;
      }, {});

      delete item.embed;
      delete item.image;
      delete item.temporalCoverage;

      newData.push(item);
    });

    setData(newData);
    setFixed(true);
  }

  function download() {
    if (!data().length) {
      setError({ message: "No data to download" });
      return;
    }
    setError({});
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data(), null, 2)
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "fixed_data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  return (
    <div class="dashboard-fixer grid grid-cols-2">
      <div class="dashboard-fixer__content">
        <h2 class="text-2xl mb-2">Dashboard fixer</h2>
        <div class="mb-2">
          <input
            type="file"
            id="input"
            name="input"
            accept="application/json"
            onChange={(event) => {
              const reader = new FileReader();
              reader.onload = (event) => {
                const data = JSON.parse(event.target.result);
                setData(data);
                setFixed(false);
                if (data.length) {
                  setProperties({
                    host: data[0]["@id"].split("/").slice(0, 5).join("/"),
                  });
                }
              };
              reader.readAsText(event.target.files[0]);
            }}
          />
        </div>
        <div class="mb-2 flex gap-x-4">
          <button class="bg-white text-black px-10" onClick={fixData}>
            Fix
          </button>
          <button class="bg-white text-black px-10" onClick={download}>
            Download
          </button>
        </div>
        {error().message && <p class="text-red-500">{error().message}</p>}
        {fixed() && <p class="text-green-500">Ready to download</p>}
      </div>
      <div class="dashboard-fixer__properties">
        <h2 class="text-2xl mb-2">Properties</h2>
        <label class="mr-2" for="host">
          Host
        </label>
        <input
          class="text-black"
          type="text"
          name="host"
          value={properties().host}
          onChange={(event) => setProperties({ host: event.target.value })}
        />
      </div>
    </div>
  );
}
