// Analytics utility for GA4 and Meta (Facebook) Pixel tracking

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// ─── GA4 ─────────────────────────────────────────────────────────────────────

export function trackGA4Event(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// ─── Meta Pixel ──────────────────────────────────────────────────────────────

export function trackMetaEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
}

// ─── Composed event helpers ──────────────────────────────────────────────────

export function trackProductView(product: {
  id: number;
  name: string;
  price: number;
  category?: string;
}) {
  trackGA4Event('view_item', {
    currency: 'INR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });

  trackMetaEvent('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    value: product.price,
    currency: 'INR',
  });
}

export function trackAddToCart(product: {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}) {
  trackGA4Event('add_to_cart', {
    currency: 'INR',
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });

  trackMetaEvent('AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price * product.quantity,
    currency: 'INR',
  });
}

export function trackBeginCheckout(value: number, itemCount: number) {
  trackGA4Event('begin_checkout', {
    currency: 'INR',
    value,
    num_items: itemCount,
  });

  trackMetaEvent('InitiateCheckout', {
    value,
    currency: 'INR',
    num_items: itemCount,
  });
}

export function trackPurchase(orderId: string | number, value: number, tax?: number) {
  trackGA4Event('purchase', {
    transaction_id: String(orderId),
    currency: 'INR',
    value,
    tax: tax ?? 0,
  });

  trackMetaEvent('Purchase', {
    value,
    currency: 'INR',
  });
}

export function trackLogin(method: string = 'email') {
  trackGA4Event('login', { method });

  trackMetaEvent('Lead', { content_name: 'login' });
}