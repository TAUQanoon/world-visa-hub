import { Builder } from '@builder.io/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useBuilderAnalytics } from '@/hooks/useBuilderAnalytics';

// Custom CTA Button Component
const CTAButton = ({ text, href, variant = 'default' }: any) => {
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

Builder.registerComponent(CTAButton, {
  name: 'CTAButton',
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
});

// Service Card Component
const ServiceCard = ({ title, description, icon }: any) => {
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

Builder.registerComponent(ServiceCard, {
  name: 'ServiceCard',
  inputs: [
    { name: 'title', type: 'string', defaultValue: 'Service Title', required: true },
    { name: 'description', type: 'longText', defaultValue: 'Service description goes here' },
    { name: 'icon', type: 'string', helperText: 'Emoji or icon character' },
  ],
});

// FAQ Accordion Component
const FAQAccordion = ({ items }: any) => {
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

Builder.registerComponent(FAQAccordion, {
  name: 'FAQAccordion',
  inputs: [
    {
      name: 'items',
      type: 'list',
      defaultValue: [
        { question: 'What is your question?', answer: 'This is the answer.' },
      ],
      subFields: [
        { name: 'question', type: 'string', required: true },
        { name: 'answer', type: 'longText', required: true },
      ],
    },
  ],
});

// Testimonial Block Component
const TestimonialBlock = ({ quote, author, role, image }: any) => {
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

Builder.registerComponent(TestimonialBlock, {
  name: 'TestimonialBlock',
  inputs: [
    { name: 'quote', type: 'longText', required: true },
    { name: 'author', type: 'string', required: true },
    { name: 'role', type: 'string' },
    { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'png', 'webp'] },
  ],
});

// Stats Counter Component
const StatsCounter = ({ number, label, suffix = '' }: any) => {
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

Builder.registerComponent(StatsCounter, {
  name: 'StatsCounter',
  inputs: [
    { name: 'number', type: 'number', required: true },
    { name: 'label', type: 'string', required: true },
    { name: 'suffix', type: 'string', helperText: 'e.g., +, %, K' },
  ],
});

// Export for registration
export const registerCustomComponents = () => {
  // Components are registered on import
  console.log('Builder.io custom components registered');
};
