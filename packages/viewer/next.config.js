const { DefinePlugin } = require("webpack");
const { GitRevisionPlugin } = require("git-revision-webpack-plugin");

const gitRevisionPlugin = new GitRevisionPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  /** @param config {import("webpack").Configuration} */
  webpack: (config) => {
    config.plugins.push(
      new DefinePlugin({
        VERSION: JSON.stringify(gitRevisionPlugin.version()),
        COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
        LASTCOMMITDATETIME: JSON.stringify(
          gitRevisionPlugin.lastcommitdatetime(),
        ),
      }),
    );

    // https://webpack.js.org/guides/asset-modules/#replacing-inline-loader-syntax
    config.module.rules.forEach((rule) => {
      // eslint-disable-next-line no-param-reassign
      if (!rule.resourceQuery) rule.resourceQuery = { not: [/raw/] };
    });
    config.module.rules.push({
      resourceQuery: /raw/,
      type: "asset/source",
    });
    return config;
  },

  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.luogu.com.cn" }],
  },

  output: "standalone",
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
