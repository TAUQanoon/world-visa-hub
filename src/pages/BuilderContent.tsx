import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { BuilderPage } from '@/components/builder/BuilderPage';
import { builderApiKey, isBuilderPreview } from '@/lib/builder';

export default function BuilderContent() {
  const location = useLocation();
  const [shouldRender, setShouldRender] = useState<boolean | null>(null);

  useEffect(() => {
    const checkContent = async () => {
      // Always render in preview mode
      if (isBuilderPreview()) {
        setShouldRender(true);
        return;
      }

      try {
        // Check if content exists for this URL
        const url = `https://cdn.builder.io/api/v3/content/page?apiKey=${builderApiKey}&url=${encodeURIComponent(location.pathname)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          setShouldRender(false);
          return;
        }

        const data = await response.json();
        const content = data.results?.[0];

        setShouldRender(!!content);
      } catch (error) {
        console.error('Error checking Builder.io content:', error);
        setShouldRender(false);
      }
    };

    checkContent();
  }, [location.pathname]);

  // Show loading state while checking
  if (shouldRender === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If content exists or in preview mode, render Builder.io page
  if (shouldRender) {
    return <BuilderPage />;
  }

  // If no content found, redirect to 404
  return <Navigate to="/404" replace />;
}
