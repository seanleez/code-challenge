import React, { useState, useEffect, useRef } from 'react';

export interface ISVGIconProps {
  name: string;
}

export const SVGIcon: React.FC<ISVGIconProps> = (props) => {
  const { name } = props;
  const [loading, setLoading] = useState(false);
  const bundlePath = useRef<any>(null);

  useEffect(() => {
    setLoading(true);

    const importIcon = async () => {
      try {
        const { default: _bundleRelativePath } = await import(
          `../../assets/tokens/${name}.svg`
        );
        bundlePath.current = _bundleRelativePath;
      } catch (err) {
        bundlePath.current = '#';
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name]);

  if (!loading && bundlePath.current) {
    return <img src={bundlePath.current} alt="" />;
  }

  return null;
};
