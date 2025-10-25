# Azlok WhatsApp Chat Components

This directory contains components for integrating WhatsApp chat functionality into the Azlok website. These components are customized with Azlok branding, advanced graphics, and animations.

## Components

### 1. WhatsAppChat

A floating WhatsApp chat button that appears on all pages of the website. Features Azlok branding, animated effects, and a modern design.

```tsx
import WhatsAppChat from '../components/WhatsAppChat';

// In your layout or page component
<WhatsAppChat 
  phoneNumber="918800412138" 
  welcomeMessage="Hello! I'm interested in Azlok products and would like more information." 
  buttonStyle="floating" // 'floating' or 'inline'
  position="bottom-right" // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  companyName="Azlok Pvt Ltd" // Optional, defaults to 'Azlok Pvt Ltd'
/>
```

### 2. WhatsAppChatButton

A customizable WhatsApp chat button that can be placed anywhere in your UI. Features the same Azlok branding and design as the floating button.

```tsx
import WhatsAppChatButton from '../components/WhatsAppChatButton';

// In your page component
<WhatsAppChatButton 
  phoneNumber="918800412138"
  welcomeMessage="Hello! I'm interested in the Kerala Spices Bundle and would like more information."
  buttonText="Ask about this product"
  buttonClassName="your-custom-button-classes" // Optional
  companyName="Azlok Pvt Ltd" // Optional, defaults to 'Azlok Pvt Ltd'
/>
```

### 3. AzlokLogo

A custom SVG logo component used in the WhatsApp chat components.

```tsx
import AzlokLogo from './icons/AzlokLogo';

// In your component
<AzlokLogo width={24} height={24} className="optional-classes" />
```

## Props

### WhatsAppChat Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| phoneNumber | string | required | Phone number with country code but without + or spaces |
| welcomeMessage | string | "Hello! I'm interested in Azlok products and would like more information." | Default message shown in the chat popup |
| buttonStyle | 'floating' \| 'inline' | 'floating' | Style of the button |
| position | 'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left' | 'bottom-right' | Position of the button if floating |
| companyName | string | 'Azlok Pvt Ltd' | Company name displayed in the chat header |

### WhatsAppChatButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| phoneNumber | string | required | Phone number with country code but without + or spaces |
| welcomeMessage | string | "Hello! I'm interested in Azlok products and would like more information." | Default message shown in the chat popup |
| buttonText | string | "Chat Now" | Text displayed on the button |
| buttonClassName | string | "" | Custom CSS classes for the button |
| companyName | string | 'Azlok Pvt Ltd' | Company name displayed in the chat header |

### AzlokLogo Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | 24 | Width of the logo in pixels |
| height | number | 24 | Height of the logo in pixels |
| className | string | '' | Additional CSS classes for the logo |

## Features

### Advanced Graphics and Animations

- **Animated Button**: The floating button features a pulse animation to attract attention
- **Gradient Effects**: Custom gradients for buttons and backgrounds
- **Hover Effects**: Interactive hover effects with shine animations
- **Decorative Elements**: Background blur and decorative gradient orbs
- **Custom Azlok Logo**: Branded SVG logo integrated into the components

### Responsive Design

- Fully responsive on all device sizes
- Optimized for mobile interactions
- Accessible design with proper focus states and ARIA attributes

## Example

See the example implementation at `/examples/whatsapp-chat` to see how these components can be used in different contexts.

## WhatsApp API

This component uses the WhatsApp Click to Chat API. More information can be found at:
https://faq.whatsapp.com/5913398998672934

## Customization

The components are designed to be easily customized for Azlok's branding. The primary color scheme uses green gradients to match WhatsApp's branding while incorporating Azlok's identity.
