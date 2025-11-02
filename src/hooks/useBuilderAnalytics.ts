import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: string;
  page_url?: string;
  metadata?: Record<string, any>;
}

export const useBuilderAnalytics = (pageUrl: string) => {
  useEffect(() => {
    // Track page view
    trackEvent({
      event_type: 'page_view',
      page_url: pageUrl,
      metadata: {
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
      },
    });
  }, [pageUrl]);

  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      await supabase.from('builder_analytics').insert({
        event_type: event.event_type,
        page_url: event.page_url,
        metadata: event.metadata || {},
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  };

  const trackFormSubmit = (formName: string) => {
    trackEvent({
      event_type: 'form_submit',
      page_url: pageUrl,
      metadata: { form_name: formName },
    });
  };

  const trackButtonClick = (buttonLabel: string) => {
    trackEvent({
      event_type: 'button_click',
      page_url: pageUrl,
      metadata: { button_label: buttonLabel },
    });
  };

  return { trackFormSubmit, trackButtonClick, trackEvent };
};
