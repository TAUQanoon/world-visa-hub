import { useParams } from "react-router-dom";
import { PlasmicComponent } from "@plasmicapp/loader-react";

export function PlasmicPage() {
  const { "*": path } = useParams();
  
  // Convert path to component name
  // e.g., "homepage" or "about-us" 
  const componentName = path || "Homepage";
  
  // Capitalize first letter if needed
  const formattedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

  return (
    <PlasmicComponent
      component={formattedName}
      componentProps={{}}
    />
  );
}
