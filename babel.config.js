module.exports = {
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: 'commonjs',
                        debug: false,
                        targets: {
                            node: 'current',
                        },
                    },
                    '@babel/preset-typescript'
                ]
            ]
        },
    },
}
