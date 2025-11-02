import { builder, Builder } from '@builder.io/react';

// Get API key from environment variable
const BUILDER_API_KEY = import.meta.env.VITE_BUILDER_IO_API_KEY || '';

// Initialize Builder.io
if (BUILDER_API_KEY) {
  builder.init(BUILDER_API_KEY);
}

// Register custom models
Builder.register('insertMenu', {
  name: 'Page',
  fields: [
    {
      name: 'title',
      type: 'string',
      required: true,
      helperText: 'Page title for SEO',
    },
    {
      name: 'description',
      type: 'string',
      helperText: 'Page description for SEO',
    },
    {
      name: 'keywords',
      type: 'string',
      helperText: 'SEO keywords (comma-separated)',
    },
  ],
});

export { Builder };
export const builderApiKey = BUILDER_API_KEY;
