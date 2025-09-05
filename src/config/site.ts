export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + HeroUI",
  description: "Travelling package planning and scheduling made easy.",
  agentItems: [
    {
      label: "Packages",
      href: "/packages",
    },
    {
      label: "Schedule",
      href: "/schedule",
    },
    {
      label: "Participants",
      href: "/participants",
    },
    // {
    //   label: "Dashboard",
    //   href: "/dashboard",
    // },
  ],
  participantItems: [
    {
      label: "My Trips",
      href: "/trips",
    },
    // {
    //   label: "Attractions Nearby",
    //   href: "/attractions",
    // },
    // {
    //   label: "Tips & Guides",
    //   href: "/guides",
    // },
  ],
};
