export const isMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Check for mobile devices
  if (/android/i.test(userAgent)) {
    return true;
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return true;
  }

  // Check for other mobile patterns
  if (/Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return true;
  }

  // Also check screen width as a fallback
  if (window.innerWidth <= 768) {
    return true;
  }

  return false;
};

export const getCanvasSize = () => {
  const mobile = isMobile();
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;

  if (mobile) {
    // For mobile, use 90% of viewport width/height, maintaining aspect ratio
    const size = Math.min(maxWidth * 0.9, maxHeight * 0.7);
    return {
      width: size,
      height: size,
      isMobile: true,
    };
  }

  // Desktop default size
  return {
    width: 600,
    height: 600,
    isMobile: false,
  };
};
