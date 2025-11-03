import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { fetchBuilderContent } from '@/lib/builder';
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
        const fetchedContent = await fetchBuilderContent(model, currentUrl);

        if (fetchedContent) {
          setPageContent(fetchedContent);
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
      <div className="builder-content">
        {pageContent.data?.html && (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(pageContent.data.html, {
                ALLOWED_TAGS: ['p', 'div', 'span', 'img', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'br', 'strong', 'em', 'u', 'section', 'article', 'header', 'footer', 'nav', 'button', 'form', 'input', 'label', 'textarea', 'select', 'option'],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'id', 'style', 'target', 'rel', 'type', 'placeholder', 'name', 'value', 'data-*']
              })
            }} 
          />
        )}
        {!pageContent.data?.html && pageContent.data?.blocks && (
          <div>
            {/* Simple fallback rendering for blocks */}
            <pre className="p-4 bg-muted text-xs overflow-auto">
              {JSON.stringify(pageContent.data.blocks, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}
