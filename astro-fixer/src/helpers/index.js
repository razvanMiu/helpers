import topics from "../resources/topics.json";

const timer = {};

export function debounce(func, wait = 300, id) {
  if (typeof func !== "function") return;
  const name = id || func.name || "generic";
  if (timer[name]) clearTimeout(timer[name]);
  timer[name] = setTimeout(func, wait);
}

export async function proxyFetch(url, options = {}) {
  const body = new FormData();
  body.append("headers", JSON.stringify(options.headers || {}));
  body.append("method", options.method || "GET");
  return await fetch(`/api/proxy?url=${encodeURIComponent(url)}`, {
    ...options,
    body,
    method: "POST",
  });
}

export function fixHost(item, oldHost, newHost) {
  return JSON.parse(JSON.stringify(item).replaceAll(oldHost, newHost));
}

export function fixTemporalCoverage(item, field) {
  return item[field].reduce((acc, value) => {
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
}

export function fixTopics(item, field) {
  console.log(item, topics);
  return item[field].reduce((acc, value) => {
    if (!topics[value]) return acc;
    acc.push(topics[value]);
    return acc;
  }, []);
}

export function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result.split(",")[1]); // Extract only the Base64 part
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
