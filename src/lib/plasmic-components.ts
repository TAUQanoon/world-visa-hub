import { PLASMIC } from "./plasmic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Register shadcn/ui components with Plasmic
// This allows your team to drag and drop these components in the Plasmic editor

PLASMIC.registerComponent(Button, {
  name: "Button",
  props: {
    children: {
      type: "slot",
      defaultValue: "Click me",
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
    onClick: {
      type: "eventHandler",
      argTypes: [],
    },
  },
  importPath: "@/components/ui/button",
});

PLASMIC.registerComponent(Card, {
  name: "Card",
  props: {
    children: {
      type: "slot",
      defaultValue: [
        {
          type: "component",
          name: "CardHeader",
        },
      ],
    },
    className: {
      type: "string",
    },
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(CardHeader, {
  name: "CardHeader",
  props: {
    children: {
      type: "slot",
      defaultValue: "Card Header",
    },
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(CardTitle, {
  name: "CardTitle",
  props: {
    children: {
      type: "slot",
      defaultValue: "Card Title",
    },
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(CardDescription, {
  name: "CardDescription",
  props: {
    children: {
      type: "slot",
      defaultValue: "Card description text",
    },
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(CardContent, {
  name: "CardContent",
  props: {
    children: {
      type: "slot",
      defaultValue: "Card content",
    },
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(CardFooter, {
  name: "CardFooter",
  props: {
    children: {
      type: "slot",
      defaultValue: "Card footer",
    },
  },
  importPath: "@/components/ui/card",
});

PLASMIC.registerComponent(Input, {
  name: "Input",
  props: {
    type: {
      type: "choice",
      options: ["text", "email", "password", "number", "tel", "url"],
      defaultValue: "text",
    },
    placeholder: {
      type: "string",
      defaultValue: "Enter text...",
    },
    value: {
      type: "string",
    },
    onChange: {
      type: "eventHandler",
      argTypes: [{ name: "event", type: "object" }],
    },
  },
  importPath: "@/components/ui/input",
});

PLASMIC.registerComponent(Label, {
  name: "Label",
  props: {
    children: {
      type: "slot",
      defaultValue: "Label",
    },
    htmlFor: {
      type: "string",
    },
  },
  importPath: "@/components/ui/label",
});

PLASMIC.registerComponent(Separator, {
  name: "Separator",
  props: {
    orientation: {
      type: "choice",
      options: ["horizontal", "vertical"],
      defaultValue: "horizontal",
    },
  },
  importPath: "@/components/ui/separator",
});

export { PLASMIC };
