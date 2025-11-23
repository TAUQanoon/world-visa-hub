import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlasmicComponent, PlasmicRootProvider } from "@plasmicapp/loader-react";
import { PLASMIC } from "@/lib/plasmic";

export function PlasmicPage() {
  const { "*": path } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Convert path to component name
  const componentName = path || "Homepage";
  const formattedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

  useEffect(() => {
    async function prefetchData() {
      setLoading(true);
      setError(null);
      try {
        console.log("Attempting to load Plasmic component:", formattedName);
        const data = await PLASMIC.maybeFetchComponentData(formattedName);
        console.log("Plasmic data fetched:", data);
        if (!data) {
          setError(`Component "${formattedName}" not found in Plasmic. Make sure the component name matches exactly.`);
        }
      } catch (err: any) {
        console.error("Error fetching Plasmic component:", err);
        setError(err.message || "Failed to load page");
      } finally {
        setLoading(false);
      }
    }
    
    prefetchData();
  }, [formattedName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading Plasmic page...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg">
          <h1 className="text-2xl font-bold mb-2">Error Loading Page</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Looking for component: <code className="bg-gray-100 px-2 py-1 rounded">{formattedName}</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <PlasmicComponent
        component={formattedName}
        componentProps={{}}
      />
    </PlasmicRootProvider>
  );
}
