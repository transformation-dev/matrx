![](https://img.shields.io/github/workflow/status/matrx-transformation/matrx/Deploy%20and%20Test%20in%20Staging?label=Cypress%20Tests%20in%20PR%20Staging&style=for-the-badge)

![](https://img.shields.io/github/workflow/status/matrx-transformation/matrx/Lint?label=Lint&style=for-the-badge)

![Codecov](https://img.shields.io/codecov/c/github/matrx-transformation/matrx?style=for-the-badge)

[![Total alerts](https://img.shields.io/lgtm/alerts/g/matrx-transformation/matrx.svg?logo=lgtm&logoWidth=18&style=for-the-badge)](https://lgtm.com/projects/g/matrx-transformation/matrx/alerts/)

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/matrx-transformation/matrx.svg?logo=lgtm&logoWidth=18&style=for-the-badge)](https://lgtm.com/projects/g/matrx-transformation/matrx/context:javascript)


![Azure DevOps releases](https://img.shields.io/azure-devops/release/matrx-transformation/eeebab5f-7e66-4a67-bd67-c98a299f2aae/1/1?style=for-the-badge)

# `@matrx/matrx`

This is the repository for the [MatrX](https://matrx.co) product.

## License

All of the components found in the packages folder are open sourced under the MIT license but this main project is not open source licensed... eventhough the source is currently "open". Right now, it's current purpose is to provide end-to-end testing for the open sourced components. Feel free to look at the code in this main project as an example for how to use the open sourced components and of course, we'd love for you to use the open sourced components. Please contact us if you wish to use this parent project for commercial purposes.

## Notes for development


### Using external components

When using Svelte components installed from npm, such as [@sveltejs/svelte-virtual-list](https://github.com/sveltejs/svelte-virtual-list), Svelte needs the original component source (rather than any precompiled JavaScript that ships with the component). This allows the component to be rendered server-side, and also keeps your client-side app smaller.

Because of that, it's essential that the bundler doesn't treat the package as an *external dependency*. You can either modify the `external` option under `server` in [rollup.config.js](rollup.config.js) or the `externals` option in [webpack.config.js](webpack.config.js), or simply install the package to `devDependencies` rather than `dependencies`, which will cause it to get bundled (and therefore compiled) with your app:

```bash
npm install -D @sveltejs/svelte-virtual-list
```

