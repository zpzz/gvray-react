import { assetUrl } from '@/pages/Afribid/constants';
import React from 'react';

interface Props {
  name: string;
  alt?: string;
  className?: string;
}

const Photo: React.FC<Props> = ({ name, alt = '', className = 'photo' }) => {
  const isReference = name === 'reference-hilux';
  return (
    <div className={`${className}${isReference ? ' reference-hilux' : ''}`}>
      {!isReference ? (
        <img src={assetUrl(name)} alt={alt} />
      ) : (
        <img src={assetUrl('hilux-front.jpg')} alt={alt || 'Vehicle'} />
      )}
    </div>
  );
};

export default Photo;
