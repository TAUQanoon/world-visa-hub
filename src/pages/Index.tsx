import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Globe, FileCheck, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">GlobalVisa Consultancy</h1>
          <div className="space-x-2">
            {user ? (
              <Button onClick={() => navigate("/portal")}>
                Go to Portal
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl font-bold text-foreground">
            Your Journey to Study Abroad Starts Here
          </h2>
          <p className="text-xl text-muted-foreground">
            Expert visa consultation services for students heading to China, Saudi Arabia, and beyond
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="mt-8">
            Start Your Application
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card p-8 rounded-lg border text-center">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
            <p className="text-muted-foreground">
              Specialized visa services for multiple countries including China and Saudi Arabia
            </p>
          </div>
          <div className="bg-card p-8 rounded-lg border text-center">
            <FileCheck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Processing</h3>
            <p className="text-muted-foreground">
              Professional guidance through every step of your visa application
            </p>
          </div>
          <div className="bg-card p-8 rounded-lg border text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
            <p className="text-muted-foreground">
              Personal consultants to help you throughout your journey
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
