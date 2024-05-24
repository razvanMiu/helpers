import { createSignal, onMount } from "solid-js";
import cx from "classnames";

import { debounce, fixTemporalCoverage, fixTopics } from "../helpers";
import { defaultDisallowedProperties } from "../constants";

const tableauHost = "https://tableau-public.discomap.eea.europa.eu";

const parser = typeof window !== "undefined" && new DOMParser();

export default function DashboardFixer() {
  const [editor, setEditor] = createSignal(null);
  const [fixed, setFixed] = createSignal(false);
  const [data, setData] = createSignal([]);
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

  function fixData() {
    if (fixed()) return;
    if (!data().length) {
      setError({ message: "No data to fix" });
      return;
    }
    setError({});

    const newData = [];

    data().forEach((item) => {
      if (item["@type"] !== "Dashboard") {
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
      const [, sheetname] = params["name"]?.split("/") || [];
      // Update item
      item["@type"] = "tableau_visualization";
      item["tableau_visualization"] = {
        "@id": item["@id"],
        url: tableauHost + "/views" + `/${params["name"]}`,
        hideTabs: params["tabs"] === "no",
        hideToolbar: params["toolbar"] === "no",
        toolbarPosition: "Top",
        sheetname,
      };
      item["preview_image"] = item["image"];
      item["temporal_coverage"] = fixTemporalCoverage(item, "temporalCoverage");
      item["topics"] = fixTopics(item, "themes");

      disallowedProperties().forEach((key) => delete item[key]);

      newData.push(item);
    });

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
                const data = JSON.parse(event.target.result);
                editor().set({
                  data,
                });
                setData(data);
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
