module.exports = function (api) {

    const web = api.caller((caller) => { return Boolean(caller && caller.target == 'web'); });

    const webpack = api.caller((caller) => { return Boolean(caller && caller.name === 'babel-loader'); });

    const presets = [
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

    const plugins = [
        "@loadable/babel-plugin",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread"
    ];

    return {
        presets,
        plugins
    };
}