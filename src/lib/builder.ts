import { fetchOneEntry } from '@builder.io/sdk-react';

// Builder.io API configuration
export const builderApiKey = import.meta.env.VITE_BUILDER_IO_API_KEY || '';

// Fetch Builder.io content
export async function fetchBuilderContent(model: string, urlPath: string) {
  if (!builderApiKey) {
    console.warn('Builder.io API key not configured');
    return null;
  }

  try {
    const content = await fetchOneEntry({
      model,
      apiKey: builderApiKey,
      userAttributes: {
        urlPath,
      },
    });

    return content || null;
  } catch (error) {
    console.error('Error fetching Builder.io content:', error);
    return null;
  }
}
