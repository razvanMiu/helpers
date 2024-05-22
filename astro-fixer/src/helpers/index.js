const timer = {};

export function debounce(func, wait = 300, id) {
  if (typeof func !== "function") return;
  const name = id || func.name || "generic";
  if (timer[name]) clearTimeout(timer[name]);
  timer[name] = setTimeout(func, wait);
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
