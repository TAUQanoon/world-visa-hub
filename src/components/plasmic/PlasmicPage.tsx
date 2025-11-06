import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlasmicComponent } from "@plasmicapp/loader-react";
import { PLASMIC } from "@/lib/plasmic";

export function PlasmicPage() {
  const { "*": path } = useParams();
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      try {
        // Fetch the page metadata from Plasmic
        const pagePath = `/${path || ""}`;
        const pageMetadata = await PLASMIC.maybeFetchComponentData(pagePath);
        
        if (pageMetadata) {
          setPageData(pageMetadata);
        }
      } catch (error) {
        console.error("Error loading Plasmic page:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [path]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">
            This page hasn't been created in Plasmic yet.
          </p>
        </div>
      </div>
    );
  }

  // Render the Plasmic component
  return (
    <PlasmicComponent
      component={path || "homepage"}
      componentProps={{}}
    />
  );
}
