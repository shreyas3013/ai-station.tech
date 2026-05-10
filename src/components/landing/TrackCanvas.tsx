import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Rails() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame(() => {
    if (!matRef.current) return;
    const s = Math.min(1, window.scrollY / 1200);
    matRef.current.emissiveIntensity = 0.4 + s * 1.6;
  });
  return (
    <group>
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, -1.1, -58]}>
          <boxGeometry args={[0.05, 0.04, 120]} />
          <meshStandardMaterial
            ref={matRef as any}
            color="#3D82C4"
            emissive="#1A3A6A"
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

function Ties() {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  React.useEffect(() => {
    if (!ref.current) return;
    for (let i = 0; i < 80; i++) {
      const z = 2 - i * 1.475;
      dummy.position.set(0, -1.12, z);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);
  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, 80]}>
      <boxGeometry args={[2.0, 0.03, 0.16]} />
      <meshStandardMaterial color="#12122A" roughness={0.95} />
    </instancedMesh>
  );
}

function SignalLight({ pos, color, phase }: { pos: [number, number, number]; color: string; phase: number }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.emissiveIntensity = 1.2 + (Math.sin(clock.elapsedTime * 1.4 + phase) * 0.5 + 0.5) * 1.8;
    }
  });
  return (
    <group position={pos}>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 3.5, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14 + 1;
      arr[i * 3 + 2] = -Math.random() * 84 + 4;
    }
    return arr;
  }, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pos = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < 120; i++) {
      pos[i * 3 + 1] += Math.sin(clock.elapsedTime * 0.3 + i) * 0.001;
    }
    (ref.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={120} />
      </bufferGeometry>
      <pointsMaterial color="#3D82C4" size={0.055} transparent opacity={0.35} />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 1.8, 9));
  useFrame(() => {
    const s = Math.min(1, window.scrollY / 1400);
    target.current.set(0, 1.8 - s * 1.6, 9 - s * 17);
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, 0, -10);
  });
  return null;
}

const TrackCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ fov: 55, position: [0, 1.8, 9] }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <CameraRig />
        <ambientLight intensity={0.35} color="#0A0A2A" />
        <pointLight color="#3D82C4" intensity={4} position={[0, 3, 5]} />
        <pointLight color="#D4920A" intensity={2} position={[4, 1, -6]} />
        <directionalLight color="#FFFFFF" intensity={0.25} position={[8, 8, 4]} />
        <Rails />
        <Ties />
        <SignalLight pos={[-1.6, -1.1, -4]} color="#22C55E" phase={0} />
        <SignalLight pos={[1.6, -1.1, -12]} color="#F59E0B" phase={1.5} />
        <SignalLight pos={[-1.6, -1.1, -20]} color="#22C55E" phase={3} />
        <SignalLight pos={[1.6, -1.1, -28]} color="#F59E0B" phase={4.5} />
        <Particles />
      </Canvas>
    </div>
  );
};

export default TrackCanvas;