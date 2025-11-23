import { initPlasmicLoader } from "@plasmicapp/loader-react";
import {
  SignInButton,
  SignUpButton,
  GetStartedButton,
  LogoutButton,
  UserAvatar,
  ProtectedContent,
  NavigationLink,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
} from "@/components/plasmic-components";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: import.meta.env.VITE_PLASMIC_PROJECT_ID,
      token: import.meta.env.VITE_PLASMIC_API_TOKEN,
    },
  ],
  preview: false,
});

// Register Functional Action Components
PLASMIC.registerComponent(SignInButton, {
  name: "SignInButton",
  props: {
    text: {
      type: "string",
      defaultValue: "Sign In",
      description: "Button text",
    },
    variant: {
      type: "choice",
      options: ["default", "outline", "secondary", "ghost", "link"],
      defaultValue: "default",
    },
    size: {
      type: "choice",
      options: ["default", "sm", "lg", "icon"],
      defaultValue: "default",
    },
    className: "string",
  },
  importPath: "@/components/plasmic-components",
});

PLASMIC.registerComponent(SignUpButton, {
  name: "SignUpButton",
  props: {
    text: {
      type: "string",
      defaultValue: "Sign Up",
      description: "Button text",
    },
    variant: {
      type: "choice",
      options: ["default", "outline", "secondary", "ghost", "link"],
      defaultValue: "default",
    },
    size: {
      type: "choice",
      options: ["default", "sm", "lg", "icon"],
      defaultValue: "default",
    },
    className: "string",
  },
  importPath: "@/components/plasmic-components",
});

PLASMIC.registerComponent(GetStartedButton, {
  name: "GetStartedButton",
  props: {
    text: {
      type: "string",
      defaultValue: "Get Started",
      description: "Button text",
    },
    variant: {
      type: "choice",
      options: ["default", "outline", "secondary", "ghost", "link"],
      defaultValue: "default",
    },
    size: {
      type: "choice",
      options: ["default", "sm", "lg", "icon"],
      defaultValue: "lg",
    },
    redirectTo: {
      type: "string",
      defaultValue: "/auth",
      description: "Where to redirect when clicked",
    },
    className: "string",
  },
  importPath: "@/components/plasmic-components",
});

PLASMIC.registerComponent(LogoutButton, {
  name: "LogoutButton",
  props: {
    text: {
      type: "string",
      defaultValue: "Logout",
      description: "Button text",
    },
    variant: {
      type: "choice",
      options: ["default", "outline", "secondary", "ghost", "link"],
      defaultValue: "ghost",
    },
    size: {
      type: "choice",
      options: ["default", "sm", "lg", "icon"],
      defaultValue: "default",
    },
    showIcon: {
      type: "boolean",
      defaultValue: true,
      description: "Show logout icon",
    },
    className: "string",
  },
  importPath: "@/components/plasmic-components",
});

// Register Auth Components
PLASMIC.registerComponent(UserAvatar, {
  name: "UserAvatar",
  props: {
    showName: {
      type: "boolean",
      defaultValue: false,
      description: "Show user name next to avatar",
    },
    size: {
      type: "choice",
      options: ["sm", "default", "lg"],
      defaultValue: "default",
    },
    className: "string",
  },
  importPath: "@/components/plasmic-components",
});

PLASMIC.registerComponent(ProtectedContent, {
  name: "ProtectedContent",
  props: {
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Protected content - only visible when logged in",
      },
    },
    fallback: {
      type: "slot",
      defaultValue: null,
    },
    requireAuth: {
      type: "boolean",
      defaultValue: true,
      description: "If true, shows children when logged in. If false, shows children when logged out.",
    },
  },
  importPath: "@/components/plasmic-components",
});

PLASMIC.registerComponent(NavigationLink, {
  name: "NavigationLink",
  props: {
    href: {
      type: "string",
      defaultValue: "/",
      description: "URL to navigate to",
    },
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Link",
      },
    },
    className: "string",
  },
  importPath: "@/components/plasmic-components",
});

// Register UI Components
PLASMIC.registerComponent(Button, {
  name: "Button",
  props: {
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Button",
      },
    },
    variant: {
      type: "choice",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      defaultValue: "default",
    },
    size: {
      type: "choice",
      options: ["default", "sm", "lg", "icon"],
      defaultValue: "default",
    },
    className: "string",
  },
  importPath: "@/components/ui/button",
});

PLASMIC.registerComponent(Card, {
  name: "Card",
  props: {
    children: {
      type: "slot",
      defaultValue: [{
        type: "component",
        name: "CardHeader",
      }],
    },
    className: "string",
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(CardHeader, {
  name: "CardHeader",
  props: {
    children: {
      type: "slot",
    },
    className: "string",
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(CardTitle, {
  name: "CardTitle",
  props: {
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Card Title",
      },
    },
    className: "string",
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(CardDescription, {
  name: "CardDescription",
  props: {
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Card description",
      },
    },
    className: "string",
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(CardContent, {
  name: "CardContent",
  props: {
    children: {
      type: "slot",
    },
    className: "string",
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(CardFooter, {
  name: "CardFooter",
  props: {
    children: {
      type: "slot",
    },
    className: "string",
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(Input, {
  name: "Input",
  props: {
    type: {
      type: "string",
      defaultValue: "text",
      description: "Input type (text, email, password, etc.)",
    },
    placeholder: {
      type: "string",
      defaultValue: "",
    },
    className: "string",
  },
  importPath: "@/components/ui/input",
});

PLASMIC.registerComponent(Badge, {
  name: "Badge",
  props: {
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Badge",
      },
    },
    variant: {
      type: "choice",
      options: ["default", "secondary", "destructive", "outline"],
      defaultValue: "default",
    },
    className: "string",
  },
  importPath: "@/components/ui/badge",
});

PLASMIC.registerComponent(Alert, {
  name: "Alert",
  props: {
    children: {
      type: "slot",
    },
    variant: {
      type: "choice",
      options: ["default", "destructive"],
      defaultValue: "default",
    },
    className: "string",
  },
  importPath: "@/components/ui/alert",
});

PLASMIC.registerComponent(AlertTitle, {
  name: "AlertTitle",
  props: {
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Alert Title",
      },
    },
    className: "string",
  },
  importPath: "@/components/ui/alert",
});

PLASMIC.registerComponent(AlertDescription, {
  name: "AlertDescription",
  props: {
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Alert description text",
      },
    },
    className: "string",
  },
  importPath: "@/components/ui/alert",
});

PLASMIC.registerComponent(Separator, {
  name: "Separator",
  props: {
    orientation: {
      type: "choice",
      options: ["horizontal", "vertical"],
      defaultValue: "horizontal",
    },
    className: "string",
  },
  importPath: "@/components/ui/separator",
});
