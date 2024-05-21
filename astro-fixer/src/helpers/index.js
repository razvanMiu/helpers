export function fixHost(item, oldHost, newHost) {
  return JSON.parse(JSON.stringify(item).replaceAll(oldHost, newHost));
}
