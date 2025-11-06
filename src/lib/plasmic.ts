import { initPlasmicLoader } from "@plasmicapp/loader-react";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: import.meta.env.PLASMIC_PROJECT_ID,
      token: import.meta.env.PLASMIC_API_TOKEN,
    },
  ],
  preview: false,
});
