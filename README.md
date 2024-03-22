# NegotiatorV3 Frontend

## Development mode

To run the application in fully accessible development mode you need to run an instance of a [mock OIDC server](https://github.com/Soluto/oidc-server-mock).
You can spin up a preconfigured instance with the following command.
```
cd oidc_mock && docker-compose up -d
```
Then to run the application with correct settings run:

## Recommended package manager is Yarn

# Because of some Legacy package (or the packages that has not updated for a few years) that specify a peer dependency which is in conflict with a package you want to install

## Project Setup

```sh
# yarn
yarn install

# npm
npm install
```

### Compile and Hot-Reload for Development

```sh
# yarn
yarn dev

# npm
npm run dev
```

### Compile and Minify for Production

```sh
# yarn
yarn build

# npm
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
# yarn
yarn lint

# npm
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
