module.exports = function(api) {

    const web = api.caller((caller) => { return Boolean(caller && caller.target == 'web'); });

    const webpack = api.caller((caller) => { return Boolean(caller && caller.name === 'babel-loader'); });

    var presets = [
        '@babel/preset-react',
        [
            '@babel/preset-env',
            {
                corejs: "3",
                useBuiltIns: 'usage',
                targets: !web ? { node: 'current' } : undefined,
                modules: webpack ? false : 'commonjs',
            },
        ],
    ];

    var plugins = [
        "@loadable/babel-plugin",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread"
    ];

    if (process.env.NODE_ENV != "production") {
        if (!web) {
            plugins.push(["dynamic-import-node", { noInterop: true }]);
        }
    }

    return {
        presets,
        plugins
    };
}