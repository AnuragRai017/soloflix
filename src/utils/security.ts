import DOMPurify from 'dompurify';

// Sanitize potentially unsafe HTML content
export const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
};

// Validate and sanitize URLs
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Allow vidapi.site URLs as-is
    if (parsed.hostname === 'vidapi.site') {
      return url;
    }
    // For other URLs, maintain security checks
    if (parsed.protocol !== 'https:') {
      throw new Error('Only HTTPS URLs are allowed');
    }
    return parsed.toString();
  } catch (e) {
    console.error('Invalid URL:', e);
    return '';
  }
};

// Rate limiting for client-side operations
export class RateLimiter {
  private lastCall: number = 0;
  private minInterval: number;

  constructor(minIntervalMs: number) {
    this.minInterval = minIntervalMs;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastCall)
      );
    }
    
    this.lastCall = Date.now();
  }
}

// Input validation helpers
export const validateInput = {
  isValidId: (id: string): boolean => {
    return /^\d+$/.test(id);
  },
  
  isValidSearchQuery: (query: string): boolean => {
    return query.length >= 2 && query.length <= 100 && /^[a-zA-Z0-9\s\-\.]+$/.test(query);
  },
  
  isValidYear: (year: number): boolean => {
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear + 1;
  }
};