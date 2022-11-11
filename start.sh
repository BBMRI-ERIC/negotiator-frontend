sed -i 's|CLIENT_ID_PLACEHOLDER|'"${CLIENT_ID}"'|g' .env
sed -i 's|AUTH_URL_PLACEHOLDER|'"${AUTH_URL}"'|g' .env
sed -i 's|REDIRECT_URI_PLACEHOLDER|'"${REDIRECT_URI}"'|g' .env
http-server dist