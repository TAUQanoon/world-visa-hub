import { useEffect, useState } from 'react';
import { Content, isPreviewing } from '@builder.io/sdk-react';
import { fetchBuilderContent, builderApiKey } from '@/lib/builder';
import { useBuilderAnalytics } from '@/hooks/useBuilderAnalytics';
import { BuilderSEO } from './BuilderSEO';

interface BuilderPageProps {
  model?: string;
}

export function BuilderPage({ model = 'page' }: BuilderPageProps) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const currentUrl = window.location.pathname;
  
  useBuilderAnalytics(currentUrl);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const fetchedContent = await fetchBuilderContent(model, currentUrl);

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
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Always render Content component for preview/edit mode or if content exists
  if (isPreviewing() || content) {
    return (
      <>
        {content && <BuilderSEO content={content} />}
        <Content 
          model={model}
          content={content}
          apiKey={builderApiKey}
        />
      </>
    );
  }

  if (notFound) {
    return null; // Let App.tsx handle 404
  }

  return null;
}
