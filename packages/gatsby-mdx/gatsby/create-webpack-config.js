const path = require("path");
const escapeStringRegexp = require("escape-string-regexp");
const defaultOptions = require("../utils/default-options");

module.exports = (
  { stage, loaders, actions, plugins, ...other },
  pluginOptions
) => {
  const options = defaultOptions(pluginOptions);
  const testPattern = new RegExp(
    options.extensions.map(ext => `${escapeStringRegexp(ext)}$`).join("|")
  );

  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, ".cache/gatsby-mdx"),
          use: [loaders.js()]
        },
        {
          test: testPattern,
          use: [
            loaders.js(),
            {
              loader: "@danielberndt/gatsby-mdx/loaders/mdx-loader",
              options: {
                ...other,
                pluginOptions: options
              }
            }
          ]
        }
      ]
    },
    plugins: [
      plugins.define({
        __DEVELOPMENT__: stage === `develop` || stage === `develop-html`
      })
    ]
  });
};
