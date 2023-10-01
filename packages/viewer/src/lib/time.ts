export default function stringifyTime(time: Date) {
  return new Date(time).toLocaleString("zh").split(":", 2).join(":");
}
