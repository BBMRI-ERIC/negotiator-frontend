#!/bin/bash

echo "Replacing env constants in JS"
for file in assets/index.*.js;
do
  echo "Processing $file ...";

  sed -i 's|AUTH_URL_PLACEHOLDER|'${AUTH_URL}'|g' $file
  sed -i 's|CLIENT_ID_PLACEHOLDER|'${CLIENT_ID}'|g' $file
  sed -i 's|REDIRECT_URI_PLACEHOLDER|'${REDIRECT_URI}'|g' $file
  sed -i 's|LOGOUT_URI_PLACEHOLDER|'${LOGOUT_URI}'|g' $file
  sed -i 's|RESOURCES_PLACEHOLDER|'${API_RESOURCES}'|g' $file
  sed -i 's|MATOMO_HOST_PLACEHOLDER|'${MATOMO_HOST}'|g' $file
  sed -i 's|MATOMO_SITE_ID_PLACEHOLDER|'${MATOMO_SITE_ID}'|g' $file
  sed -i 's|ACTIVE_THEME_EUCAIM_PLACEHOLDER|'${ACTIVE_THEME_EUCAIM}'|g' $file

done

exec nginx -g 'daemon off;'
