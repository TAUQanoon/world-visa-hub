import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { BuilderPage } from '@/components/builder/BuilderPage';
<<<<<<< HEAD
import { builder } from '@builder.io/react';
import { isBuilderInitialized } from '@/lib/builder';
=======
import { builder, Builder } from '@builder.io/react';
>>>>>>> 39269faf625baee062631ef980df2e912ca0bfaf

export default function BuilderContent() {
  const location = useLocation();
  const [shouldRender, setShouldRender] = useState<boolean | null>(null);

  useEffect(() => {
    const checkContent = async () => {
<<<<<<< HEAD
      // Always render in preview/edit mode if builder has been initialized
      try {
        if (
          isBuilderInitialized() &&
          (((builder as any).isPreviewing?.() as boolean) || ((builder as any).isEditing?.() as boolean))
        ) {
          setShouldRender(true);
          return;
        }
      } catch (err) {
        console.warn('Builder preview check threw an error:', err);
=======
      // Always render in preview/edit mode
      if (Builder.isPreviewing || Builder.isEditing) {
        setShouldRender(true);
        return;
>>>>>>> 39269faf625baee062631ef980df2e912ca0bfaf
      }

      try {
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

  if (shouldRender === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (shouldRender) {
    return <BuilderPage />;
  }

  return <Navigate to="/404" replace />;
}
