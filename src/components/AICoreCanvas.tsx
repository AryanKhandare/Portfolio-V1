import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Neural Sphere / Particle Cloud Component
const NeuralSphere: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate spherical particle positions
  const [particlePositions, lineIndices] = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    const radius = 2.4;

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution on sphere for uniform look
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    // Connect close points to draw neural lines
    const indices: number[] = [];
    const maxDistance = 1.0;

    for (let i = 0; i < count; i++) {
      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];

      for (let j = i + 1; j < count; j++) {
        const x2 = positions[j * 3];
        const y2 = positions[j * 3 + 1];
        const z2 = positions[j * 3 + 2];

        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
        if (dist < maxDistance && Math.random() > 0.45) {
          indices.push(i, j);
        }
      }
    }

    return [positions, new Uint16Array(indices)];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const targetX = state.pointer.x * 0.4;
    const targetY = state.pointer.y * 0.4;

    // Slow rotation + cursor parallax
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.15;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetY, 0.05);
      pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, targetX, 0.05);
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.15;
      linesRef.current.rotation.x = THREE.MathUtils.lerp(linesRef.current.rotation.x, targetY, 0.05);
      linesRef.current.rotation.z = THREE.MathUtils.lerp(linesRef.current.rotation.z, targetX, 0.05);
    }
  });

  return (
    <group>
      {/* 3D Points Cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#22d3ee"
          size={0.06}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
        />
      </points>

      {/* Connecting Neural Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[lineIndices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#a855f7"
          transparent={true}
          opacity={0.3}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
};

// Gyroscopic Rings Component
const HUDGyros: React.FC = () => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const targetX = state.pointer.x * 0.5;
    const targetY = state.pointer.y * 0.5;

    // Rotate rings in opposite directions
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = time * 0.25;
      outerRingRef.current.rotation.x = THREE.MathUtils.lerp(outerRingRef.current.rotation.x, targetY + Math.PI / 2, 0.05);
      outerRingRef.current.rotation.y = THREE.MathUtils.lerp(outerRingRef.current.rotation.y, targetX, 0.05);
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -time * 0.4;
      innerRingRef.current.rotation.y = THREE.MathUtils.lerp(innerRingRef.current.rotation.y, targetX + Math.PI / 4, 0.05);
      innerRingRef.current.rotation.x = THREE.MathUtils.lerp(innerRingRef.current.rotation.x, targetY, 0.05);
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.x = time * 0.3;
      midRingRef.current.rotation.y = -time * 0.2;
    }
  });

  return (
    <group>
      {/* Outer Gyro Ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.015, 8, 64]} />
        <meshBasicMaterial color="#a855f7" wireframe={true} transparent opacity={0.4} />
      </mesh>

      {/* Mid Orbit Ring */}
      <mesh ref={midRingRef}>
        <torusGeometry args={[2.8, 0.01, 8, 48]} />
        <meshBasicMaterial color="#8b5cf6" wireframe={true} transparent opacity={0.3} />
      </mesh>

      {/* Inner Fast Ring */}
      <mesh ref={innerRingRef} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1.8, 0.02, 6, 32]} />
        <meshBasicMaterial color="#22d3ee" wireframe={true} transparent opacity={0.55} />
      </mesh>
    </group>
  );
};

// Main Canvas Assembly
const AICoreCanvas: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[380px] bg-black/20 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center">
      {/* HUD Scanner Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-purple-accent/5 to-transparent bg-[length:100%_4px] bg-repeat z-10 opacity-30" />
      
      {/* SVG corner brackets and overlay details */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 5,15 L 5,5 L 15,5" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="0.75" />
        <path d="M 95,15 L 95,5 L 85,5" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="0.75" />
        <path d="M 5,85 L 5,95 L 15,95" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="0.75" />
        <path d="M 95,85 L 95,95 L 85,95" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="0.75" />
        
        {/* Reticles */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(34,207,238,0.06)" strokeWidth="0.5" strokeDasharray="2, 4" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(168,85,247,0.04)" strokeWidth="0.5" strokeDasharray="8, 8" />
      </svg>

      {/* React Three Fiber Canvas */}
      <Canvas
        camera={{ position: [0, 0, 7], fof: 60 } as any}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[1, 3, 2]} intensity={2} />
        <NeuralSphere />
        <HUDGyros />
      </Canvas>
    </div>
  );
};

export default AICoreCanvas;
