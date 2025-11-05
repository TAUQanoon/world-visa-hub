import { builder, Builder } from '@builder.io/react';
import { CTAButton, ServiceCard, FAQAccordion, TestimonialBlock, StatsCounter } from '@/components/builder/CustomComponents';

export const builderApiKey = import.meta.env.VITE_BUILDER_IO_API_KEY || '';

// Initialize Builder safely and add debug logs to help diagnose preview issues
try {
  if (builderApiKey) {
    // Mask key in logs to avoid leaking secrets
    const masked = `${builderApiKey.slice(0, 6)}...${builderApiKey.slice(-4)}`;
    // Init inside try/catch so any runtime error is surfaced to console
    builder.init(builderApiKey);
    // Set API version after init
    (builder as any).apiVersion = 'v3';
    // Some builder helper methods are only available after init; warn if missing
    if (typeof (builder as any).isPreviewing !== 'function') {
      console.warn('[builder] initialized but `isPreviewing` is not available on the builder instance');
    }
    // Only log masked key to help debugging (safe for public logs)
    console.info(`[builder] initialized (key=${masked})`);
  } else {
    console.warn('[builder] VITE_BUILDER_IO_API_KEY is not set. Builder will not be initialized.');
  }
} catch (err) {
  console.error('[builder] error during initialization:', err);
}

// Check if in Builder.io preview mode (query param based check)
export function isBuilderPreview(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('builder.preview') === 'true' || params.get('builder.space') !== null;
  } catch (e) {
    // In case URL parsing throws for some reason, fail closed
    return false;
  }
}

// Small helper to check if builder appears initialized
export function isBuilderInitialized(): boolean {
  return typeof (builder as any).init === 'function' && typeof (builder as any).isPreviewing === 'function';
}
