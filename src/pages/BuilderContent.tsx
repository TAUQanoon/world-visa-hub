import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { BuilderPage } from '@/components/builder/BuilderPage';
import { builder, Builder } from '@builder.io/react';

export default function BuilderContent() {
  const location = useLocation();
  const [shouldRender, setShouldRender] = useState<boolean | null>(null);

  useEffect(() => {
    const checkContent = async () => {
      // Always render in preview/edit mode
      if (Builder.isPreviewing || Builder.isEditing) {
        setShouldRender(true);
        return;
      }

      try {
        // Check if content exists for this URL using Builder SDK
        const content = await builder
          .get('page', {
            userAttributes: {
              urlPath: location.pathname,
            },
          })
          .promise();

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
