#!/bin/bash

echo "Replacing env constants in JS"
for file in assets/index.*.js;
do
  echo "Processing $file ...";

  sed -i '' 's|AUTH_URL_PLACEHOLDER|'"${AUTH_URL}"'|g' "$file"
  sed -i '' 's|CLIENT_ID_PLACEHOLDER|'"${CLIENT_ID}"'|g' "$file"
  sed -i '' 's|REDIRECT_URI_PLACEHOLDER|'"${REDIRECT_URI}"'|g' "$file"
  sed -i '' 's|LOGOUT_URI_PLACEHOLDER|'"${LOGOUT_URI}"'|g' "$file"
  sed -i '' 's|RESOURCES_PLACEHOLDER|'"${API_RESOURCES}"'|g' "$file"
  sed -i '' 's|MATOMO_HOST_PLACEHOLDER|'"${MATOMO_HOST}"'|g' "$file"
  sed -i '' 's|MATOMO_SITE_ID_PLACEHOLDER|'"${MATOMO_SITE_ID}"'|g' "$file"
  sed -i '' 's|ACTIVE_THEME_PLACEHOLDER|'"${ACTIVE_THEME:-bbmri}"'|g' "$file"
  sed -i '' 's|ACTIVE_LOGOS_PLACEHOLDER|'"${ACTIVE_LOGOS:-bbmri}"'|g' "$file"
  sed -i '' 's|FEATURE_FLAG_FAQPAGE_PLACEHOLDER|'"${FEATURE_FLAG_FAQPAGE:-false}"'|g' "$file"
  sed -i '' 's|FEATURE_FLAG_VUETOUR_PLACEHOLDER|'"${FEATURE_FLAG_VUETOUR:-false}"'|g' "$file"
  sed -i '' 's|FEATURE_FLAG_NOTIFICATIONS|'"${FEATURE_FLAG_NOTIFICATIONS:-false}"'|g' "$file"
  sed -i '' 's|AUTH_MANAGEMENT_LINK_PLACEHOLDER|'"${AUTH_MANAGEMENT_LINK:-none}"'|g' "$file"
  sed -i '' 's|EXTERNAL_LINK_DIRECTORY_PLACEHOLDER|'"${EXTERNAL_LINK_DIRECTORY:-https://directory.bbmri-eric.eu}"'|g' "$file"
  sed -i '' 's|FOOTER_FOLLOW_US_LINKEDIN_PLACEHOLDER|'"${FOOTER_FOLLOW_US_LINKEDIN:-true}"'|g' "$file"
  sed -i '' 's|FOLLOW_US_VISIBLE_PLACEHOLDER|'"${FOLLOW_US_VISIBLE:-true}"'|g' "$file"
  sed -i '' 's|FOOTER_FOLLOW_US_X_PLACEHOLDER|'"${FOOTER_FOLLOW_US_X:-https://twitter.com/BBMRIERIC}"'|g' "$file"
  sed -i '' 's|FOOTER_FOLLOW_US_PODCAST_PLACEHOLDER|'"${FOOTER_FOLLOW_US_PODCAST:-https://www.linkedin.com/company/bbmri-eric}"'|g' "$file"
  sed -i '' 's|FOOTER_FOLLOW_US_YOUTUBE_PLACEHOLDER|'"${FOOTER_FOLLOW_US_YOUTUBE:-https://www.bbmri-eric.eu/bbmri-eric/bbmri-eric-podcast/}"'|g' "$file"
  sed -i '' 's|FOOTER_BBMRIERIC_STATUS_PAGE_VISIBLE_PLACEHOLDER|'"${FOOTER_BBMRIERIC_STATUS_PAGE_VISIBLE:-true}"'|g' "$file"
  sed -i '' 's|FOOTER_STATUS_PAGE_LINK_PLACEHOLDER|'"${FOOTER_STATUS_PAGE_LINK:-https://status.bbmri-eric.eu/}"'|g' "$file"
  sed -i '' 's|FOOTER_STATUS_PAGE_TEXT_PLACEHOLDER|'"${FOOTER_STATUS_PAGE_TEXT:-BBMRI-ERIC Status Page}"'|g' "$file"
  sed -i '' 's|FOOTER_WORK_PROGRAMME_VISIBLE_PLACEHOLDER|'"${FOOTER_WORK_PROGRAMME_VISIBLE:-true}"'|g' "$file"
  sed -i '' 's|FOOTER_WORK_PROGRAMME_LINK_PLACEHOLDER|'"${FOOTER_WORK_PROGRAMME_LINK:-https://www.bbmri-eric.eu/wp-content/uploads/BBMRI-ERIC_work-program_2022-2024_DIGITAL.pdf}"'|g' "$file"
  sed -i '' 's|FOOTER_PRIVACY_POLICY_VISIBLE_PLACEHOLDER|'"${FOOTER_PRIVACY_POLICY_VISIBLE:-true}"'|g' "$file"
  sed -i '' 's|FOOTER_PRIVACY_POLICY_PLACEHOLDER|'"${FOOTER_PRIVACY_POLICY:-https://www.bbmri-eric.eu/wp-content/uploads/AoM_10_8_Access-Policy_FINAL_EU.pdf}"'|g' "$file"
  sed -i '' 's|FOOTER_HELP_LINK_VISIBLE_PLACEHOLDER|'"${FOOTER_HELP_LINK_VISIBLE:-true}"'|g' "$file"
  sed -i '' 's|FOOTER_HELP_LINK_PLACEHOLDER|'"${FOOTER_HELP_LINK:-mailto:negotiator@helpdesk.bbmri-eric.eu}"'|g' "$file"
  sed -i '' 's|FOOTER_COPYRIGHT_VISIBLE_PLACEHOLDER|'"${FOOTER_COPYRIGHT_VISIBLE:-true}"'|g' "$file"
  sed -i '' 's|FOOTER_COPYRIGHT_PLACEHOLDER|'"${FOOTER_COPYRIGHT:-© 2024 BBMRI-ERIC}"'|g' "$file"
  sed -i '' 's|FOOTER_LEFT_SIDE_ICON_VISIBLE_PLACEHOLDER|'"${FOOTER_LEFT_SIDE_ICON_VISIBLE:-true}"'|g' "$file"
  sed -i '' 's|FOOTER_LEFT_SIDE_ICON_PLACEHOLDER|'"${FOOTER_LEFT_SIDE_ICON:-@/assets/images/bbmri/home-bbmri-png}"'|g' "$file"
  sed -i '' 's|FOOTER_LEFT_SIDE_ICON_LINK_PLACEHOLDER|'"${FOOTER_LEFT_SIDE_ICON_LINK:-https://www.bbmri-eric.eu/}"'|g' "$file"
  sed -i '' 's|FOOTER_NEWSLETTER_VISIBLE_PLACEHOLDER|'"${FOOTER_NEWSLETTER_VISIBLE:-true}"'|g' "$file"
  sed -i '' 's|FOOTER_NEWSLETTER_PLACEHOLDER|'"${FOOTER_NEWSLETTER:-https://www.bbmri-eric.eu/news-event/}"'|g' "$file"
done

exec nginx -g 'daemon off;'
