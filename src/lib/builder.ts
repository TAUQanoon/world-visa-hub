import { builder, Builder } from '@builder.io/react';
import { CTAButton, ServiceCard, FAQAccordion, TestimonialBlock, StatsCounter } from '@/components/builder/CustomComponents';

export const builderApiKey = import.meta.env.VITE_BUILDER_IO_API_KEY || '';

// Initialize Builder
if (builderApiKey) {
  builder.init(builderApiKey);
  builder.apiVersion = 'v3';
  
  // Register custom components
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

  Builder.registerComponent(ServiceCard, {
    name: 'ServiceCard',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Service Title', required: true },
      { name: 'description', type: 'longText', defaultValue: 'Service description' },
      { name: 'icon', type: 'string', helperText: 'Emoji or icon' },
    ],
  });

  Builder.registerComponent(FAQAccordion, {
    name: 'FAQAccordion',
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
  });

  Builder.registerComponent(TestimonialBlock, {
    name: 'TestimonialBlock',
    inputs: [
      { name: 'quote', type: 'longText', required: true },
      { name: 'author', type: 'string', required: true },
      { name: 'role', type: 'string' },
      { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'png', 'webp'] },
    ],
  });

  Builder.registerComponent(StatsCounter, {
    name: 'StatsCounter',
    inputs: [
      { name: 'number', type: 'number', required: true },
      { name: 'label', type: 'string', required: true },
      { name: 'suffix', type: 'string', helperText: 'e.g., +, %, K' },
    ],
  });
}

// Check if in Builder.io preview mode
export function isBuilderPreview(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('builder.preview') === 'true' || params.get('builder.space') !== null;
}
