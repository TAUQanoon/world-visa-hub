import { builder } from '@builder.io/react';

// Builder.io API configuration
export const builderApiKey = import.meta.env.VITE_BUILDER_IO_API_KEY || '';

// Initialize Builder
if (builderApiKey) {
  builder.init(builderApiKey);
  builder.apiVersion = 'v3';
}
