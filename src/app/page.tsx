'use client';

import React from 'react';

const ThreeDText = () => {
  const [rotation, setRotation] = React.useState({ x: 0, y: 0, z: 0 });
  const [hover, setHover] = React.useState(false);
  const requestRef = React.useRef<number | undefined>();
  const previousTimeRef = React.useRef<number | undefined>();
  const targetRotationRef = React.useRef({ x: 0, y: 0, z: 0 });

  const animate = React.useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = (time - previousTimeRef.current) / 1000;
        setRotation((prevRotation) => ({
          x:
            prevRotation.x +
            (targetRotationRef.current.x - prevRotation.x) * 5 * deltaTime,
          y:
            prevRotation.y +
            (targetRotationRef.current.y - prevRotation.y) * 5 * deltaTime,
          z:
            prevRotation.z +
            (targetRotationRef.current.z - prevRotation.z) * 5 * deltaTime,
        }));
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [previousTimeRef, requestRef],
  );

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientY / innerHeight - 0.5) * 50;
      const y = -(clientX / innerWidth - 0.5) * 50;
      const z = Math.sqrt(x * x + y * y) * 0.2;

      targetRotationRef.current = { x, y, z };
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 overflow-hidden bg-gray-900">
      <p className="font-mono text-2xl text-background">we are the</p>
      <div
        className="perspective-1000 relative cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <h1
          className="relative text-8xl font-extrabold text-white transition-all duration-300 ease-out"
          style={{
            transform: `
              rotateX(${rotation.x}deg) 
              rotateY(${rotation.y}deg) 
              rotateZ(${rotation.z}deg)
              scale(${hover ? 1.1 : 1})
              translateZ(${hover ? 50 : 0}px)
            `,
            textShadow: hover
              ? '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15), 0 30px 30px rgba(0,0,0,.1)'
              : '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)',
          }}
        >
          INTL TEAM
        </h1>
        <h1
          className="absolute left-0 top-0 text-8xl font-extrabold text-blue-500 opacity-50 blur-sm transition-all duration-300 ease-out"
          style={{
            transform: `
              rotateX(${rotation.x}deg) 
              rotateY(${rotation.y}deg) 
              rotateZ(${rotation.z}deg)
              translateZ(${hover ? -30 : -10}px)
              scale(${hover ? 1.2 : 1})
            `,
          }}
        >
          INTL TEAM
        </h1>
      </div>
    </div>
  );
};

export default ThreeDText;
