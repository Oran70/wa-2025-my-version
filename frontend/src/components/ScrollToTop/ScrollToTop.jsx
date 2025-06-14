import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls the window to the top
 * whenever the route changes.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top when pathname changes
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Use 'auto' for instant scrolling without animation
        });
    }, [pathname]);

    // This component doesn't render anything
    return null;
};

export default ScrollToTop;
