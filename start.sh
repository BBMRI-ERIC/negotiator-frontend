#!/bin/bash

echo "Replacing env constants in JS"
for file in dist/assets/*.js*;
do
  echo "Processing $file ...";

  sed -i 's|AUTH_URL_PLACEHOLDER|'${AUTH_URL}'|g' $file
  sed -i 's|CLIENT_ID_PLACEHOLDER|'${CLIENT_ID}'|g' $file
  sed -i 's|REDIRECT_URI_PLACEHOLDER|'${REDIRECT_URI}'|g' $file
  sed -i 's|LOGOUT_URI_PLACEHOLDER|'${LOGOUT_URI}'|g' $file

done

http-server dist
