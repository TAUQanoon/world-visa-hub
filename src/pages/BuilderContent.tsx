import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { BuilderPage } from '@/components/builder/BuilderPage';
import { supabase } from '@/integrations/supabase/client';

export default function BuilderContent() {
  const location = useLocation();
  const [contentExists, setContentExists] = useState<boolean | null>(null);

  useEffect(() => {
    const checkContent = async () => {
      try {
        // Check if this URL path has content in our database
        const { data, error } = await supabase
          .from('builder_content')
          .select('id')
          .eq('url_path', location.pathname)
          .eq('published', true)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking content:', error);
        }

        setContentExists(!!data);
      } catch (error) {
        console.error('Error checking Builder.io content:', error);
        setContentExists(false);
      }
    };

    checkContent();
  }, [location.pathname]);

  // Show loading state while checking
  if (contentExists === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If content exists, render Builder.io page
  if (contentExists) {
    return <BuilderPage />;
  }

  // If no content found, redirect to 404
  return <Navigate to="/404" replace />;
}
