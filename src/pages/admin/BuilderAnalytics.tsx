import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BuilderAnalytics() {
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [formSubmits, setFormSubmits] = useState(0);
  const [buttonClicks, setButtonClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch page views grouped by URL
      const { data: views, error: viewsError } = await supabase
        .from('builder_analytics')
        .select('page_url')
        .eq('event_type', 'page_view');

      if (viewsError) throw viewsError;

      // Count page views by URL
      const viewCounts = views?.reduce((acc: any, item) => {
        const url = item.page_url || 'Unknown';
        acc[url] = (acc[url] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(viewCounts || {}).map(([url, count]) => ({
        url,
        views: count,
      }));

      setPageViews(chartData);

      // Fetch form submissions count
      const { count: formCount, error: formError } = await supabase
        .from('builder_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'form_submit');

      if (formError) throw formError;
      setFormSubmits(formCount || 0);

      // Fetch button clicks count
      const { count: clickCount, error: clickError } = await supabase
        .from('builder_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'button_click');

      if (clickError) throw clickError;
      setButtonClicks(clickCount || 0);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Builder.io Analytics</h1>
          <p className="text-muted-foreground">
            Track performance of your Builder.io pages
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {pageViews.reduce((sum, item) => sum + (item.views as number), 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Form Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formSubmits}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Button Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{buttonClicks}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Page Views by URL</CardTitle>
                <CardDescription>Traffic distribution across pages</CardDescription>
              </CardHeader>
              <CardContent>
                {pageViews.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pageViews}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="url" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No data available</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
  );
}
