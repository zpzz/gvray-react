declare module 'react-image-magnifiers' {
  import type { CSSProperties, ReactNode } from 'react';

  export const MOUSE_ACTIVATION: {
    CLICK: string;
    DOUBLE_CLICK: string;
  };

  export const TOUCH_ACTIVATION: {
    TAP: string;
    DOUBLE_TAP: string;
    LONG_TOUCH: string;
  };

  interface MagnifierBaseProps {
    imageSrc: string;
    largeImageSrc?: string;
    imageAlt?: string;
    className?: string;
    style?: CSSProperties;
    cursorStyle?: string;
    renderOverlay?: (active: boolean) => ReactNode;
    onImageLoad?: (event: unknown) => void;
    onLargeImageLoad?: (event: unknown) => void;
    onZoomStart?: () => void;
    onZoomEnd?: () => void;
  }

  export interface GlassMagnifierProps extends MagnifierBaseProps {
    allowOverflow?: boolean;
    magnifierBorderColor?: string;
    magnifierBorderSize?: number;
    magnifierBackgroundColor?: string;
    magnifierOffsetX?: number;
    magnifierOffsetY?: number;
    magnifierSize?: string | number;
    square?: boolean;
  }

  export interface SideBySideMagnifierProps extends MagnifierBaseProps {
    alwaysInPlace?: boolean;
    overlayOpacity?: number;
    overlayBoxOpacity?: number;
    overlayBackgroundColor?: string;
    overlayBoxColor?: string;
    overlayBoxImage?: string;
    overlayBoxImageSize?: string;
    transitionSpeed?: number;
    transitionSpeedInPlace?: number;
    switchSides?: boolean;
    fillAvailableSpace?: boolean;
    fillAlignTop?: boolean;
    fillGapLeft?: number;
    fillGapRight?: number;
    fillGapTop?: number;
    fillGapBottom?: number;
    inPlaceMinBreakpoint?: number;
    zoomContainerBorder?: string;
    zoomContainerBoxShadow?: string;
    mouseActivation?: string;
    touchActivation?: string;
  }

  export interface MagnifierPreviewProps extends MagnifierBaseProps {
    overlayOpacity?: number;
    overlayBoxOpacity?: number;
    overlayBackgroundColor?: string;
    overlayBoxColor?: string;
    overlayBoxImage?: string;
    overlayBoxImageSize?: string;
    transitionSpeed?: number;
    mouseActivation?: string;
    touchActivation?: string;
  }

  export interface MagnifierZoomProps {
    imageSrc: string;
    imageAlt?: string;
    className?: string;
    style?: CSSProperties;
    onImageLoad?: (event: unknown) => void;
    transitionSpeed?: number;
  }

  export interface MagnifierContainerProps {
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    autoInPlace?: boolean;
    inPlaceMinBreakpoint?: number;
  }

  export const GlassMagnifier: React.FC<GlassMagnifierProps>;
  export const Magnifier: React.FC<MagnifierBaseProps>;
  export const SideBySideMagnifier: React.FC<SideBySideMagnifierProps>;
  export const PictureInPictureMagnifier: React.FC<MagnifierBaseProps>;
  export const MagnifierContainer: React.FC<MagnifierContainerProps>;
  export const MagnifierPreview: React.FC<MagnifierPreviewProps>;
  export const MagnifierZoom: React.FC<MagnifierZoomProps>;
}
