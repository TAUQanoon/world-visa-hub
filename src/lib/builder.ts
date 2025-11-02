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

// Render Builder.io blocks to HTML
export function renderBuilderBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  return blocks.map((block) => {
    const { component, children, ...props } = block;
    
    // Handle text blocks
    if (component?.name === 'Text') {
      return `<div>${props.text || ''}</div>`;
    }
    
    // Handle core blocks
    if (component?.name === 'Core:Section') {
      return `<section>${children ? renderBuilderBlocks(children) : ''}</section>`;
    }
    
    // Recursively render children
    if (children) {
      return renderBuilderBlocks(children);
    }
    
    return '';
  }).join('');
}
