module.exports = {
  siteMetadata: {
    title: `Seiya Yoshitaka`,
    siteUrl: `https://yo7.dev`,
    description: `Personal site by Seiya Yoshitaka`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `articles`,
        path: `${__dirname}/articles`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `seiya yoshitaka`,
        short_name: `sy`,
        start_url: `/`,
        background_color: `#1a1a1a`,
        theme_color: `#1a1a1a`,
        display: `minimal-ui`,
        icon: `images/icon.png`,
      },
    },
    `gatsby-plugin-typescript`,
    "gatsby-plugin-emotion",
  ],
}
