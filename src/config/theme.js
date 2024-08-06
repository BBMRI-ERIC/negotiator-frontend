// This file is used to define the active theme for the website.
const devSettings = {
  activeThemeFile: "bbmri",
  activeLogosFiles: "bbmri",
  isFooterStatusPageVisible: true,
  footerStatusPageLink: "https://status.bbmri-eric.eu/",
  footerStatusPageText: "BBMRI-ERIC Status Page",
  isFooterFollowUsVisible: true,
  footerFollowUsLinkedin: "https://www.linkedin.com/company/bbmri-eric",
  footerFollowUsX: "https://twitter.com/BBMRIERIC",
  footerFollowUsPodcast: "https://www.bbmri-eric.eu/bbmri-eric/bbmri-eric-podcast/",
  isFooterWorkProgrammeVisible: true,
  footerWorkProgrammeLink: "https://www.bbmri-eric.eu/wp-content/uploads/BBMRI-ERIC_work-program_2022-2024_DIGITAL.pdf",
  isFooterPrivacyPolicyVisible: true,
  footerPrivacyPolicy: "https://www.bbmri-eric.eu/wp-content/uploads/AoM_10_8_Access-Policy_FINAL_EU.pdf",
  isFooterHelpLinkVisible: true,
  footerHelpLink: "mailto:negotiator@helpdesk.bbmri-eric.eu",
  isFooterCopyRightVisible: true,
  footerCopyRight: "© 2024 BBMRI-ERIC",
  isFooterLeftSideIconVisible: true,
  footerLeftSideIcon: "@/assets/images/bbmri/home-bbmri-png",
  footerLeftSideIconLink: "https://www.bbmri-eric.eu/",
  isFooterNewsletterVisible: true,
  footerNewsletter: "https://www.bbmri-eric.eu/news-event/"
}

const prodSettings = {
  activeThemeFile: "ACTIVE_THEME_PLACEHOLDER",
  activeLogosFiles: "ACTIVE_LOGOS_PLACEHOLDER",
  isFooterStatusPageVisible: "FOOTER_BBMRIERIC_STATUS_PAGE_VISIBLE_PLACEHOLDER",
  footerStatusPageLink: "FOOTER_STATUS_PAGE_LINK_PLACEHOLDER",
  footerStatusPageText: "FOOTER_STATUS_PAGE_TEXT_PLACEHOLDER",
  isFooterFollowUsVisible: "FOLLOW_US_VISIBLE_PLACEHOLDER",
  footerFollowUsLinkedin: "FOOTER_FOLLOW_US_LINKEDIN_PLACEHOLDER",
  footerFollowUsX: "FOOTER_FOLLOW_US_X_PLACEHOLDER",
  footerFollowUsPodcast: "FOOTER_FOLLOW_US_PODCAST_PLACEHOLDER",
  isFooterWorkProgrammeVisible: "FOOTER_WORK_PROGRAMME_VISIBLE_PLACEHOLDER",
  footerWorkProgrammeLink: "FOOTER_WORK_PROGRAMME_LINK_PLACEHOLDER",
  isFooterPrivacyPolicyVisible: "FOOTER_PRIVACY_POLICY_VISIBLE_PLACEHOLDER",
  footerPrivacyPolicy: "FOOTER_PRIVACY_POLICY_PLACEHOLDER",
  isFooterHelpLinkVisible: "FOOTER_HELP_LINK_VISIBLE_PLACEHOLDER",
  footerHelpLink: "FOOTER_HELP_LINK_PLACEHOLDER",
  isFooterCopyRightVisible: "FOOTER_COPYRIGHT_VISIBLE_PLACEHOLDER",
  footerCopyRight: "FOOTER_COPYRIGHT_PLACEHOLDER",
  isFooterLeftSideIconVisible: "FOOTER_LEFT_SIDE_ICON_VISIBLE_PLACEHOLDER",
  footerLeftSideIcon: "FOOTER_LEFT_SIDE_ICON_PLACEHOLDER",
  footerLeftSideIconLink: "FOOTER_LEFT_SIDE_ICON_LINK_PLACEHOLDER",
  isFooterNewsletterVisible: "FOOTER_NEWSLETTER_VISIBLE_PLACEHOLDER",
  footerNewsletter: "FOOTER_NEWSLETTER_PLACEHOLDER"
}

let activeTheme

if (import.meta.env.DEV) {
  activeTheme = devSettings
} else {
  activeTheme = prodSettings
}

export default activeTheme
