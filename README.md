# NegotiatorV3 Frontend

## Development mode

To run the application in fully accessible development mode you need to run an instance of a [mock OIDC server](https://github.com/Soluto/oidc-server-mock).
You can spin up a preconfigured instance with the following command.
```
cd oidc_mock && docker-compose up -d
```
Then to run the application with correct settings run:
```
vite dev
```

## Production build
```
vite build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
