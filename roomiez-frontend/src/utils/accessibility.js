/**
 * Accessibility utilities for RoomieZ
 * Provides helpers for keyboard navigation, focus management, and announcements
 */

// Announce messages to screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 3000);
};

// Focus management
export const focusElement = (element) => {
  if (element) {
    element.focus();
    // Show focus indicator
    element.style.outline = '2px solid #FF6B6B';
    element.style.outlineOffset = '2px';
  }
};

// Keyboard event handlers
export const handleEscape = (callback) => {
  return (e) => {
    if (e.key === 'Escape') {
      callback();
    }
  };
};

export const handleEnter = (callback) => {
  return (e) => {
    if (e.key === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      callback();
    }
  };
};

// Skip to main content
export const createSkipLink = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.setAttribute('role', 'navigation');
  skipLink.setAttribute('aria-label', 'Skip to main content');
  skipLink.style.position = 'absolute';
  skipLink.style.left = '-10000px';
  skipLink.style.top = '0';
  skipLink.style.zIndex = '9999';
  skipLink.style.backgroundColor = '#FF6B6B';
  skipLink.style.color = 'white';
  skipLink.style.padding = '8px 16px';
  skipLink.style.textDecoration = 'none';
  skipLink.style.borderRadius = '4px';
  skipLink.textContent = 'Skip to main content';
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '10px';
    skipLink.style.top = '10px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-10000px';
  });
  
  return skipLink;
};

// Trap focus within modal
export const trapFocus = (element, e) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
};
