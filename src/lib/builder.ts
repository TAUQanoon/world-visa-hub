import { builder } from '@builder.io/react';

export const builderApiKey = import.meta.env.VITE_BUILDER_IO_API_KEY || '';

// Initialize Builder
if (builderApiKey) {
  builder.init(builderApiKey);
  builder.apiVersion = 'v3';
}

// Check if in Builder.io preview mode
export function isBuilderPreview(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('builder.preview') === 'true' || params.get('builder.space') !== null;
}
