// Custom components for Builder.io
// Note: These are React components that will be used in the app
// To register them in Builder.io dashboard, you'll need to:
// 1. Go to your Builder.io Models settings
// 2. Add custom components with these specifications

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useBuilderAnalytics } from '@/hooks/useBuilderAnalytics';

// Custom CTA Button Component
export const CTAButton = ({ text, href, variant = 'default' }: any) => {
  const { trackButtonClick } = useBuilderAnalytics(window.location.pathname);

  const handleClick = () => {
    trackButtonClick(text);
  };

  return (
    <Button
      variant={variant as any}
      onClick={handleClick}
      asChild={!!href}
    >
      {href ? <a href={href}>{text}</a> : <span>{text}</span>}
    </Button>
  );
};

// Service Card Component
export const ServiceCard = ({ title, description, icon }: any) => {
  return (
    <Card>
      <CardHeader>
        {icon && <div className="mb-2 text-4xl">{icon}</div>}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

// FAQ Accordion Component
export const FAQAccordion = ({ items }: any) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items?.map((item: any, index: number) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

// Testimonial Block Component
export const TestimonialBlock = ({ quote, author, role, image }: any) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <p className="text-lg italic">"{quote}"</p>
          <div className="flex items-center gap-3">
            {image && (
              <img
                src={image}
                alt={author}
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold">{author}</p>
              {role && <p className="text-sm text-muted-foreground">{role}</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Stats Counter Component
export const StatsCounter = ({ number, label, suffix = '' }: any) => {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-primary">
        {number}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
    </div>
  );
};

// Export for registration info
export const BUILDER_CUSTOM_COMPONENTS = [
  {
    name: 'CTAButton',
    component: CTAButton,
    inputs: [
      { name: 'text', type: 'string', defaultValue: 'Click Me', required: true },
      { name: 'href', type: 'string', helperText: 'Optional link URL' },
      {
        name: 'variant',
        type: 'string',
        enum: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        defaultValue: 'default',
      },
    ],
  },
  {
    name: 'ServiceCard',
    component: ServiceCard,
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Service Title', required: true },
      { name: 'description', type: 'longText', defaultValue: 'Service description' },
      { name: 'icon', type: 'string', helperText: 'Emoji or icon' },
    ],
  },
  {
    name: 'FAQAccordion',
    component: FAQAccordion,
    inputs: [
      {
        name: 'items',
        type: 'list',
        defaultValue: [{ question: 'Question?', answer: 'Answer.' }],
        subFields: [
          { name: 'question', type: 'string', required: true },
          { name: 'answer', type: 'longText', required: true },
        ],
      },
    ],
  },
  {
    name: 'TestimonialBlock',
    component: TestimonialBlock,
    inputs: [
      { name: 'quote', type: 'longText', required: true },
      { name: 'author', type: 'string', required: true },
      { name: 'role', type: 'string' },
      { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'png', 'webp'] },
    ],
  },
  {
    name: 'StatsCounter',
    component: StatsCounter,
    inputs: [
      { name: 'number', type: 'number', required: true },
      { name: 'label', type: 'string', required: true },
      { name: 'suffix', type: 'string', helperText: 'e.g., +, %, K' },
    ],
  },
];

export const registerCustomComponents = () => {
  console.log('Custom components available for Builder.io:', BUILDER_CUSTOM_COMPONENTS.map(c => c.name));
};
