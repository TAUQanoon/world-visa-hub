import { BuilderComponent, builder } from '@builder.io/react';
import { useEffect, useState } from 'react';
import { builderApiKey } from '@/lib/builder';
import { useBuilderAnalytics } from '@/hooks/useBuilderAnalytics';
import { BuilderSEO } from './BuilderSEO';

interface BuilderPageProps {
  model?: string;
  content?: any;
}

export function BuilderPage({ model = 'page', content }: BuilderPageProps) {
  const [pageContent, setPageContent] = useState(content);
  const [loading, setLoading] = useState(!content);
  const [notFound, setNotFound] = useState(false);
  const currentUrl = window.location.pathname;
  
  useBuilderAnalytics(currentUrl);

  useEffect(() => {
    if (content) return;

    const fetchContent = async () => {
      try {
        const content = await builder
          .get(model, {
            url: currentUrl,
            apiKey: builderApiKey,
          })
          .promise();

        if (content) {
          setPageContent(content);
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
  }, [currentUrl, model, content]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound || !pageContent) {
    return null; // Let App.tsx handle 404
  }

  return (
    <>
      <BuilderSEO content={pageContent} />
      <BuilderComponent model={model} content={pageContent} />
    </>
  );
}
