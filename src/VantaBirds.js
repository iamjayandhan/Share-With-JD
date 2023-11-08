import React, { useState, useEffect, useRef } from 'react';
import BIRDS from 'vanta/dist/vanta.birds.min';

const VantaBirds = (props) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(BIRDS({
        el: myRef.current,
        ...props, // Pass all props as configurations
      }));
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    }
  }, [vantaEffect, props]);

  return <div ref={myRef}>
    {props.children}
  </div>;
}

export default VantaBirds;
