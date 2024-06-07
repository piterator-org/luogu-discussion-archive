import Script from "next/script";

export default function AdSense({ publisherId }: { publisherId: string }) {
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${publisherId}`}
    />
  );
}
