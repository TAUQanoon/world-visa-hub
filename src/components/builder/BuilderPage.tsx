import { useEffect, useState, useRef } from 'react';
import { builderApiKey, isBuilderPreview } from '@/lib/builder';
import { useBuilderAnalytics } from '@/hooks/useBuilderAnalytics';
import { BuilderSEO } from './BuilderSEO';

interface BuilderPageProps {
  model?: string;
}

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'builder-component': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        model?: string;
        'api-key'?: string;
      };
    }
  }
}

export function BuilderPage({ model = 'page' }: BuilderPageProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const scriptLoadedRef = useRef(false);
  const currentUrl = window.location.pathname;
  
  useBuilderAnalytics(currentUrl);

  // Load Builder.io web components script
  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.builder.io/js/webcomponents';
    script.async = true;
    document.head.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      // Cleanup is handled by the browser
    };
  }, []);

  // Fetch content for SEO and 404 handling
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const url = `https://cdn.builder.io/api/v3/content/${model}?apiKey=${builderApiKey}&url=${encodeURIComponent(currentUrl)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const fetchedContent = data.results?.[0];

        if (fetchedContent) {
          setContent(fetchedContent);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching Builder.io content:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [currentUrl, model]);

  // Show loading state
  if (loading && !isBuilderPreview()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Always render in preview mode or if content exists
  if (isBuilderPreview() || content) {
    return (
      <>
        {content && <BuilderSEO content={content} />}
        <builder-component 
          model={model}
          api-key={builderApiKey}
        />
      </>
    );
  }

  if (notFound) {
    return null; // Let App.tsx handle 404
  }

  return null;
}
