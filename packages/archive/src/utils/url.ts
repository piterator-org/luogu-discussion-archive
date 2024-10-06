const backendGlobal = process.env.LUOGU_URL ?? "https://www.luogu.com";
const backendCN = process.env.LUOGU_CN_URL ?? "https://www.luogu.com.cn";

export default function lgUrl(path: string, global = true): string {
  if (global) return `${backendGlobal}${path}`;
  return `${backendCN}${path}`;
}
