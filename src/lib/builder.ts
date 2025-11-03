// Builder.io API configuration
export const builderApiKey = import.meta.env.VITE_BUILDER_IO_API_KEY || '';
export const builderApiUrl = 'https://cdn.builder.io/api/v3/content';

// Fetch Builder.io content by URL
export async function fetchBuilderContent(model: string, urlPath: string) {
  if (!builderApiKey) {
    console.warn('Builder.io API key not configured');
    return null;
  }

  try {
    const url = `${builderApiUrl}/${model}?apiKey=${builderApiKey}&url=${encodeURIComponent(urlPath)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.results?.[0] || null;
  } catch (error) {
    console.error('Error fetching Builder.io content:', error);
    return null;
  }
}

// Check if in Builder.io preview mode
export function isBuilderPreview(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('builder.preview') === 'true' || params.get('builder.space') !== null;
}
