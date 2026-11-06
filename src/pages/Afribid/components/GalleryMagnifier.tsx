import Photo from '@/pages/Afribid/components/Photo';
import { assetUrl } from '@/pages/Afribid/constants';
import React, { useEffect, useState } from 'react';
import {
  MagnifierContainer,
  MagnifierPreview,
  MagnifierZoom,
} from 'react-image-magnifiers';

interface Props {
  name: string;
  alt?: string;
}

type Prepared = { src: string; largeSrc: string } | null;

/** Large image must be wider than the preview box or zoom stays disabled. */
function usePreparedSources(name: string, minWidth = 1800): Prepared {
  const src = assetUrl(name === 'reference-hilux' ? 'hilux-front.jpg' : name);
  const [ready, setReady] = useState<Prepared>(null);

  useEffect(() => {
    let cancelled = false;
    setReady(null);
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      if (img.naturalWidth >= minWidth) {
        setReady({ src, largeSrc: src });
        return;
      }
      const scale = minWidth / img.naturalWidth;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setReady({ src, largeSrc: src });
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setReady({ src, largeSrc: canvas.toDataURL('image/jpeg', 0.92) });
    };
    img.onerror = () => {
      if (!cancelled) setReady({ src, largeSrc: src });
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, minWidth]);

  return ready;
}

/**
 * AutoCango-style zoom: left preview + selection box, right equal-size magnified pane.
 */
const GalleryMagnifier: React.FC<Props> = ({ name, alt = '' }) => {
  const ready = usePreparedSources(name);

  if (!ready) {
    return <Photo name={name} alt={alt} className="photo gallery-magnifier" />;
  }

  return (
    <MagnifierContainer className="gallery-magnifier">
      <div className="gallery-magnifier-stage">
        <MagnifierPreview
          className="gallery-magnifier-preview"
          imageSrc={ready.src}
          largeImageSrc={ready.largeSrc}
          imageAlt={alt}
          cursorStyle="crosshair"
          overlayOpacity={0.35}
          overlayBoxOpacity={0.55}
          overlayBackgroundColor="#000"
          overlayBoxColor="#fff"
        />
        <MagnifierZoom
          className="gallery-magnifier-zoom"
          imageSrc={ready.largeSrc}
          imageAlt={alt}
          transitionSpeed={0.15}
        />
      </div>
    </MagnifierContainer>
  );
};

export default GalleryMagnifier;
