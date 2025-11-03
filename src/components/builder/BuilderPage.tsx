import { BuilderComponent, builder, Builder } from '@builder.io/react';
import { useEffect, useState } from 'react';
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
        // Fetch content using Builder SDK
        const fetchedContent = await builder
          .get(model, {
            userAttributes: {
              urlPath: currentUrl,
            },
          })
          .promise();

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

  // Always render BuilderComponent for preview/edit mode or if content exists
  if (Builder.isPreviewing || Builder.isEditing || content) {
    return (
      <>
        {content && <BuilderSEO content={content} />}
        <BuilderComponent 
          model={model} 
          content={content}
        />
      </>
    );
  }

  if (notFound) {
    return null; // Let App.tsx handle 404
  }

  return null;
}
