const withCSS = require("@zeit/next-css")

module.exports = withCSS({
  webpack(config) {
    config.module.rules.push({
      test: /\.(js|tsx)$/,
      use: [
        {
          loader: "linaria/loader",
          options: {
            sourceMap: process.env.NODE_ENV !== "production",
          },
        },
      ],
    })

    return config
  },
})
