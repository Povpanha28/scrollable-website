import { useRef, useEffect, useCallback } from 'react';

const TOTAL_FRAMES = 100;

/**
 * Custom hook for scroll-synced canvas frame animation.
 * Preloads image frames, renders them to a canvas, and syncs with scroll position.
 * 
 * @param {Function} onProgress - Callback with loading percentage (0-100)
 * @param {Function} onComplete - Callback when all frames are loaded
 * @returns {{ canvasRef: React.RefObject }}
 */
export function useScrollAnimation(onProgress, onComplete) {
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES));
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const isReadyRef = useRef(false);
  const lenisRef = useRef(null);

  // Render a specific frame onto the canvas
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
    const img = imagesRef.current[frameIdx];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let dw, dh, dx, dy;
    if (canvasRatio > imgRatio) {
      dw = cw;
      dh = cw / imgRatio;
      dx = 0;
      dy = (ch - dh) / 2;
    } else {
      dh = ch;
      dw = ch * imgRatio;
      dx = (cw - dw) / 2;
      dy = 0;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // Resize canvas for High DPI
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    renderFrame();
  }, [renderFrame]);

  // Animation lerp loop
  useEffect(() => {
    let animId;

    const animate = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.001) {
        currentFrameRef.current += diff * 0.12;
        renderFrame();
      } else if (currentFrameRef.current !== targetFrameRef.current) {
        currentFrameRef.current = targetFrameRef.current;
        renderFrame();
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [renderFrame]);

  // Preload images + setup Lenis + scroll sync
  useEffect(() => {
    let loadedCount = 0;
    resizeCanvas();

    const getImagePath = (index) => {
      const num = String(index).padStart(3, '0');
      return `/frames/please_make_the_motion_moving_${num}.jpg`;
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();

      const onSingleLoad = () => {
        loadedCount++;
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        onProgress?.(pct);

        if (i === 0) {
          currentFrameRef.current = 0;
          targetFrameRef.current = 0;
          renderFrame();
        }

        if (loadedCount >= TOTAL_FRAMES) {
          finishLoading();
        }
      };

      img.onload = onSingleLoad;
      img.onerror = () => {
        // Count errors as loaded to avoid hanging
        onSingleLoad();
      };

      img.src = getImagePath(i);
      imagesRef.current[i] = img;
    }

    // Safety timeout
    const safetyTimer = setTimeout(() => {
      finishLoading();
    }, 5000);

    function finishLoading() {
      if (isReadyRef.current) return;
      isReadyRef.current = true;

      onComplete?.();

      window.addEventListener('resize', resizeCanvas);

      // Initialize Lenis
      import('@studio-freight/lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.9,
          smoothTouch: false,
        });

        lenisRef.current = lenis;

        lenis.on('scroll', (e) => {
          const scrollTop = e.scroll;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (maxScroll > 0) {
            const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));
            targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
          }
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Sync with initial scroll position
        const initialScroll = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll > 0) {
          targetFrameRef.current = (initialScroll / maxScroll) * (TOTAL_FRAMES - 1);
          currentFrameRef.current = targetFrameRef.current;
        }
        renderFrame();
      });
    }

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('resize', resizeCanvas);
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { canvasRef };
}
