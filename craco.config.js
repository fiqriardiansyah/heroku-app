const CracoLessPlugin = require("craco-less");

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            "@primary-color": "#3498FF",
                            "@table-header-bg": "@primary-color",
                            "@table-header-color": "#ffffff",
                            "@table-border-radius-base": "@border-radius-base",
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
