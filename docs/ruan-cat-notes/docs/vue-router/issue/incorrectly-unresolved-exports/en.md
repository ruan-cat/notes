# Missing export for `vue-router.esm-bundler.js`

> The reporter is not a native English speaker. The following content is translated using translation software:

In `vue-router@4.6.0`, there is a failure due to missing `vue-router.esm-bundler.js` file export, which causes other downstream dependencies.

Read the [making workflow line](https://github.com/nwt-q/001-Smart-Community/actions/runs/18517921823/job/52772087484), an error, We can see that `vue-router@4.6.0` is missing the `vue-router.esm-bundler.js` export causing other downstream dependencies to fail. In this case, it's a failure that depends on `@dcloudio/uni-h5@3.0.0-4070520250711001`.

The following contents are all kinds of error screenshots, you can skip it as appropriate.

## Minimal replication error on stackblitz

<!-- https://stackblitz.com/~/github.com/ruan-cat/bug-in-vue-router-4.6.0-with-uniapp?file=package.json -->

![2025-10-15-15-14-44](https://gh-img-store.ruan-cat.com/img/2025-10-15-15-14-44.png)

![2025-10-15-15-15-18](https://gh-img-store.ruan-cat.com/img/2025-10-15-15-15-18.png)

## Errors when github workflow runs

Error due to missing `vue-router/dist/vue-router.esm-bundler.js`.

![2025-10-15-13-37-22](https://gh-img-store.ruan-cat.com/img/2025-10-15-13-37-22.png)

## Running locally based on unibest template failures

Error `Cannot find module 'vue-router\dist\vue-router.esm-bundler.js'`.

![2025-10-15-13-38-32](https://gh-img-store.ruan-cat.com/img/2025-10-15-13-38-32.png)

## Why does my minimal replication still have several other dependencies?

To illustrate how issues with `vue-router@4.6.0` affect other dependencies, a minimal usage example in the context of the `uniapp` framework has been provided.

According to yesterday's [update log](https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#460-2025-10-14), vue-router uses tsup for packaging projects in version `4.6.0`. This can lead to a situation of missing file exports.

This example provides a minimal number of dependencies to illustrate how `vue-router@4.6.0` affects other downstream dependencies. **No backward compatibility**.
