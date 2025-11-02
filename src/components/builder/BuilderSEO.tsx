import { useEffect } from 'react';

interface BuilderSEOProps {
  content: any;
}

export function BuilderSEO({ content }: BuilderSEOProps) {
  useEffect(() => {
    if (!content) return;

    // Update document title
    if (content.data?.title) {
      document.title = content.data.title;
    }

    // Update meta description
    if (content.data?.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', content.data.description);
    }

    // Update OG tags
    if (content.data?.image) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', content.data.image);
    }

    if (content.data?.title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', content.data.title);
    }

    // Update keywords
    if (content.data?.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', content.data.keywords);
    }
  }, [content]);

  return null;
}
