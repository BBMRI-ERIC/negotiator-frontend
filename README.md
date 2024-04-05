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

# FOR DEVELOPERS - config files

## Setting Theme of project

Location of theme config file:
```sh 
src/
└── config/
    └── theme.js
```

### There are 3 variable

### 1. activeThemeFile - define the active theme scss file

default 
```sh 
activeThemeFile: "bbmri"
```
Location of theme scss files:
```sh 
src/
└── assets/
    └── scss/
        ├── theme-bbmri.js
        ├── theme-eucaim.js
        └── theme-canServ.js
```
You can change the values of the color variables as you see fit

### 2. activeLogosFiles - define the active logos files

default 
```sh
activeLogosFiles: "bbmri"
```
Location of logos files:
```sh 
src/
└── assets/
    └── images/
            ├── bbmri/
            │   ├── footer-bbmri.svg
            │   ├── home-bbmri.png
            │   └── nav-bar-bbmri.svg
            ├── canserv/
            │   ├── footer-canserv.png
            │   ├── home-canserv.png
            │   └── nav-bar-canserv.png
            └── eucaim/
                ├── footer-eucaim.png
                ├── home-eucaim.png
                └── nav-bar-eucaim.png
```
If you want to change the image, you can replace the existing one with a new one, but with the same name, file type and size

### 3. isFooterFollowUsVisible - define if item in footer are visible (Follow Us, Subscribe To Our Newsletter...)
default

```sh
isFooterFollowUsVisible: "true"
```
## Config for matomo analytics

Location of matomo config file:
```sh 
src/
└── config/
    └── matomo.js
```

### There are 2 variable

```sh
  matomoHost: "MATOMO_HOST_PLACEHOLDER",
  matomoId: "MATOMO_SITE_ID_PLACEHOLDER"
```
See [Configuration Reference](https://matomo.org/faq/new-to-piwik/how-do-i-install-the-matomo-tracking-code-on-websites-that-use-vue-js/).


## Config for Feature Flags

Location of featureFlags config file:
```sh 
src/
└── config/
    └── featureFlags.js
```
You can adjust the visibility of features, components or code that is ready for testing but not intended for realese is hidden behind feature flags.

## Config for external links

Location of external links config file:
```sh 
src/
└── config/
    └── externalLinks.js
```
You can set which URLs external links lead to

## Config for vuex-oidc

Location of matomo config file:
```sh 
src/
└── config/
    └── oidc.js
```

### About 
Library to provide OpenID Connect (OIDC) and OAuth2 protocol support for client-side, browser-based JavaScript client applications. Also included is support for user session and access token management.

See [Configuration Reference](https://github.com/perarnborg/vuex-oidc/wiki).