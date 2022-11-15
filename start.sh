#!/bin/bash

sed -i 's|VITE_AUTH_CLIENT_ID_PLACEHOLDER|'"${CLIENT_ID}"'|g' dist/.env
sed -i 's|VITE_AUTH_URL_PLACEHOLDER|'${AUTH_URL}'|g' dist/.env
sed -i 's|VITE_AUTH_REDIRECT_URI_PLACEHOLDER|'"${REDIRECT_URI}"'|g' dist/.env
sed -i 's|VITE_AUTH_POST_LOGOUT_REDIRECT_URI_PLACEHOLDER|'"${POST_LOGOUT_REDIRECT_URI}"'|g' dist/.env
http-server dist