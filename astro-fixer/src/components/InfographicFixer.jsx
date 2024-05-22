import { createSignal, onMount } from "solid-js";
import cx from "classnames";

import { debounce, fixHost, fixTemporalCoverage } from "../helpers";

const defaultDisallowedProperties = ["image", "embed", "temporalCoverage"];

export default function InfographicFixer() {
  const [editor, setEditor] = createSignal(null);
  const [fixed, setFixed] = createSignal(false);
  const [data, setData] = createSignal([]);
  const [properties, setProperties] = createSignal({
    host: "",
  });
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
      const host = item["@id"].split("/").slice(0, 5).join("/");
      // Update properties
      item = fixHost(item, host, properties().host);
      if (item["@type"] !== "Infographic") {
        newData.push(item);
        return;
      }
      item["@type"] = "infographic";
      item["preview_image"] = item["image"];
      item["temporal_coverage"] = fixTemporalCoverage(item, "temporalCoverage");

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
        <h2 class="text-2xl mb-2">Infographic</h2>
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
        <div class="mb-4">
          <h2 class="text-2xl mb-2">Editable properties</h2>
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
