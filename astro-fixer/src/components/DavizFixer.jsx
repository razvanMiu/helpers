import { createSignal, onMount } from "solid-js";
import cx from "classnames";

import {
  debounce,
  fixTemporalCoverage,
  proxyFetch,
  convertBlobToBase64,
} from "../helpers";

const defaultDisallowedProperties = [
  "image",
  "embed",
  "temporalCoverage",
  "spreadsheet",
];

export default function DavizFixer() {
  const [editor, setEditor] = createSignal(null);
  const [fixed, setFixed] = createSignal(false);
  const [data, setData] = createSignal([]);
  const [files, setFiles] = createSignal({});
  const [disallowedProperties, setDisallowedProperties] = createSignal(
    defaultDisallowedProperties
  );
  const [error, setError] = createSignal({});
  let jsoneditorEl;

  onMount(() => {
    if (typeof window === "undefined") return;
    const editor = new window.JSONEditor(jsoneditorEl, {
      onChange: () => {
        debounce(
          () => {
            const data = editor.get().data;
            if (data) {
              setData(data);
            }
          },
          200,
          "jsoneditor:onChange"
        );
      },
    });
    editor.set({
      data: data(),
    });
    setEditor(editor);
  });

  async function fixData() {
    if (fixed()) return;
    if (!data().length) {
      setError({ message: "No data to fix" });
      return;
    }
    setError({});

    const newData = [];

    for (const item of data()) {
      // Update properties
      if (item["@type"] !== "DavizVisualization") {
        return;
      }
      const url = new URL(item["@id"]);

      const chartsResponse = await proxyFetch(
        url.origin + "/api/SITE" + url.pathname + "/@charts",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const csvResponse = await proxyFetch(
        url.origin + "/api/SITE" + url.pathname + "/download.csv",
        {
          headers: {
            Accept: "text/csv; charset=utf-8",
          },
        }
      );

      const charts = chartsResponse.ok ? await chartsResponse.json() : {};
      const csvFile = csvResponse.ok ? await csvResponse.blob() : null;
      const csvBase64 = csvFile && (await convertBlobToBase64(csvFile));

      const chartId = charts.items?.reduce((acc, item) => {
        if (item.title === "Chart") {
          acc = item.name;
        }
        return acc;
      }, "");

      let chart = files()[item["UID"]]?.reduce((acc, item) => {
        const [id, ext] = item["id"].split(".");
        if (id === chartId) {
          acc[ext] = item;
        }
        return acc;
      }, {});
      chart = chart.svg || chart.png || chart.jpeg || chart.jpg;

      // Update item
      item["@type"] = "chart_static";
      item["preview_image"] = chart?.file;
      item["file"] = {
        data: csvBase64,
        filename: null,
        encoding: "base64",
        "content-type": "text/csv",
      };
      item["temporal_coverage"] = fixTemporalCoverage(item, "temporalCoverage");

      disallowedProperties().forEach((key) => delete item[key]);

      newData.push(item);
    }

    editor().set({
      data: newData,
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
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  return (
    <div class="dashboard-fixer grid grid-cols-[2fr_1fr] gap-x-8">
      <div class="dashboard-fixer__content">
        <h2 class="text-2xl mb-2">Dashboard</h2>
        <div class="mb-2">
          <input
            type="file"
            id="input"
            name="input"
            accept="application/json"
            onChange={(event) => {
              const reader = new FileReader();
              reader.onload = (event) => {
                const result = JSON.parse(event.target.result);
                const data = [];
                const files = {};

                for (const item of result) {
                  if (item["@type"] === "DavizVisualization") {
                    data.push(item);
                  }
                  if (["File", "Image"].includes(item["@type"])) {
                    const parentUid = item["parent"]?.["UID"];
                    if (parentUid && !files[parentUid]) {
                      files[parentUid] = [];
                    }
                    files[parentUid].push(item);
                  }
                }

                editor().set({
                  data,
                });
                setData(data);
                setFiles(files);
                setFixed(false);
              };
              reader.readAsText(event.target.files[0]);
            }}
          />
        </div>
        <div class="mb-2 flex gap-x-4">
          <button
            class={cx("bg-white text-black px-10", {
              "opacity-50": !data().length || fixed(),
            })}
            onClick={fixData}
            disabled={!data().length || fixed()}
          >
            Fix
          </button>
          <button
            class={cx("bg-white text-black px-10", {
              "opacity-50": !fixed(),
            })}
            onClick={download}
            disabled={!fixed()}
          >
            Download
          </button>
        </div>
        {error().message && <p class="text-red-500">{error().message}</p>}
        {fixed() && <p class="text-green-500">Ready to download</p>}
        <div ref={jsoneditorEl} id="jsoneditor" class="h-[700px]" />
      </div>
      <div class="dashboard-fixer__properties">
        {!!data().length && !fixed() && (
          <div class="mb-4">
            <h2 class="text-2xl mb-2">Disallowed properties</h2>
            <div class="mb-2">
              <button
                onClick={() => {
                  setDisallowedProperties(Object.keys(data()[0]));
                }}
              >
                Select all
              </button>{" "}
              |{" "}
              <button
                onClick={() => {
                  setDisallowedProperties([]);
                }}
              >
                Unselect all
              </button>{" "}
              |{" "}
              <button
                onClick={() => {
                  setDisallowedProperties(defaultDisallowedProperties);
                }}
              >
                Select defaults
              </button>
            </div>
            {Object.keys(data()[0]).map((key) => (
              <>
                <p>
                  <input
                    class="mr-2"
                    type="checkbox"
                    id={key}
                    name={key}
                    checked={disallowedProperties().includes(key)}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setDisallowedProperties((properties) => [
                          ...properties,
                          key,
                        ]);
                      } else {
                        setDisallowedProperties((properties) =>
                          properties.filter((item) => item !== key)
                        );
                      }
                    }}
                  />
                  {key}
                </p>
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
