/**
 * Utility function to dynamically load a script
 * @param src - Script source URL
 * @returns Promise that resolves when script is loaded
 */
export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Cannot load script on server side'));
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    // Set up event listeners
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    // Add script to document
    document.body.appendChild(script);
  });
};
