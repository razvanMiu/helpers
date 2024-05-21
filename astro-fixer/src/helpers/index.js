const timer = {};

export function fixHost(item, oldHost, newHost) {
  return JSON.parse(JSON.stringify(item).replaceAll(oldHost, newHost));
}

export function debounce(func, wait = 300, id) {
  if (typeof func !== "function") return;
  const name = id || func.name || "generic";
  if (timer[name]) clearTimeout(timer[name]);
  timer[name] = setTimeout(func, wait);
}
