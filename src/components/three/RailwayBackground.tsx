import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 500;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial color="#7C3AED" size={0.08} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Rails() {
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.z = (clock.getElapsedTime() * 0.5) % 2;
    }
  });

  const railPoints = useMemo(() => {
    const points: [number, number, number][] = [];
    for (let i = 0; i < 50; i++) {
      points.push([0, 0, i * 0.8 - 20]);
    }
    return points;
  }, []);

  return (
    <group ref={ref}>
      <group position={[-0.6, -2, 0]}>
        <Line points={railPoints} color="#7C3AED" lineWidth={1} transparent opacity={0.3} />
      </group>
      <group position={[0.6, -2, 0]}>
        <Line points={railPoints} color="#7C3AED" lineWidth={1} transparent opacity={0.3} />
      </group>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, -2.05, i * 2 - 20]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.05, 1.4, 0.1]} />
          <meshBasicMaterial color="#1E1E3E" opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  );
}

const RailwayBackground: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handler = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 opacity-30 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#0A0A14', 5, 30]} />
        <ambientLight intensity={0.3} />
        <Particles />
        <Rails />
      </Canvas>
    </div>
  );
};

export default RailwayBackground;