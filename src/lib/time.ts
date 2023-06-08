export default function stringifyTime(time: Date) {
  return time.toLocaleString("zh").split(":", 2).join(":");
}
