import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ============================================ */
/* Particle Field — Reusable instanced particles */
/* ============================================ */
function ParticleFieldMesh({ count = 200, color = '#00E5FF', size = 0.03, spread = 10, speed = 0.2 }: {
  count?: number; color?: string; size?: number; spread?: number; speed?: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * spread,
        y: (Math.random() - 0.5) * spread,
        z: (Math.random() - 0.5) * spread,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        vz: (Math.random() - 0.5) * speed,
        scale: Math.random() * 0.5 + 0.5,
      });
    }
    return temp;
  }, [count, spread, speed]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.z += p.vz * delta;

      if (Math.abs(p.x) > spread / 2) p.vx *= -1;
      if (Math.abs(p.y) > spread / 2) p.vy *= -1;
      if (Math.abs(p.z) > spread / 2) p.vz *= -1;

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale * size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
}

/* ============================================ */
/* Glowing Sphere                                */
/* ============================================ */
function GlowingSphere({ position = [0, 0, 0] as [number, number, number], color = '#00E5FF', scale = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

/* ============================================ */
/* Energy Ring                                   */
/* ============================================ */
function EnergyRing({ radius = 2, color = '#00E5FF', speed = 1, thickness = 0.02 }: {
  radius?: number; color?: string; speed?: number; thickness?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, thickness, 16, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

/* ============================================ */
/* Neural Network Visualization                  */
/* ============================================ */
function NeuralCore() {
  const groupRef = useRef<THREE.Group>(null!);
  
  const nodes = useMemo(() => {
    const positions: [number, number, number][] = [];
    // Create layered neural network structure
    const layers = [4, 8, 12, 8, 4];
    layers.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 0.8 + li * 0.4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (li - 2) * 0.6;
        positions.push([x, y, z]);
      }
    });
    return positions;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central core */}
      <mesh>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Neural nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#00E5FF' : i % 3 === 1 ? '#7C3AED' : '#22D3EE'} />
        </mesh>
      ))}

      {/* Energy rings */}
      <EnergyRing radius={1.5} color="#00E5FF" speed={0.5} thickness={0.015} />
      <EnergyRing radius={2.0} color="#7C3AED" speed={-0.3} thickness={0.01} />
      <EnergyRing radius={2.5} color="#22D3EE" speed={0.2} thickness={0.008} />
    </group>
  );
}

/* ============================================ */
/* Data Stream Lines                             */
/* ============================================ */
function DataStreams({ count = 20 }: { count?: number }) {
  const linesRef = useRef<THREE.Group>(null!);

  const lineObjects = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const points = [];
      const startAngle = Math.random() * Math.PI * 2;
      const startRadius = 4 + Math.random() * 2;
      for (let j = 0; j < 20; j++) {
        const t = j / 19;
        const angle = startAngle + t * Math.PI * 0.5;
        const radius = startRadius * (1 - t * 0.8);
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius
        ));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? '#00E5FF' : '#7C3AED',
        transparent: true,
        opacity: 0.3,
      });
      return new THREE.Line(geometry, material);
    });
  }, [count]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={linesRef}>
      {lineObjects.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
    </group>
  );
}

/* ============================================ */
/* Main Scene Container                          */
/* ============================================ */
export default function SceneContainer({ variant = 'hero' }: { variant?: 'hero' | 'core' | 'galaxy' | 'minimal' }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#00E5FF" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#7C3AED" />

      {variant === 'hero' && (
        <>
          <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
          <NeuralCore />
          <ParticleFieldMesh count={150} color="#00E5FF" size={0.02} spread={8} speed={0.1} />
          <DataStreams count={15} />
        </>
      )}

      {variant === 'core' && (
        <>
          <NeuralCore />
          <ParticleFieldMesh count={300} color="#7C3AED" size={0.015} spread={6} speed={0.15} />
          <EnergyRing radius={3} color="#00E5FF" speed={0.8} />
          <EnergyRing radius={3.5} color="#7C3AED" speed={-0.6} />
        </>
      )}

      {variant === 'galaxy' && (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
          <ParticleFieldMesh count={500} color="#22D3EE" size={0.025} spread={12} speed={0.08} />
          <GlowingSphere position={[2, 1, -1]} color="#00E5FF" scale={0.6} />
          <GlowingSphere position={[-2, -1, 0]} color="#7C3AED" scale={0.4} />
          <GlowingSphere position={[0, 2, -2]} color="#22D3EE" scale={0.3} />
        </>
      )}

      {variant === 'minimal' && (
        <>
          <ParticleFieldMesh count={100} color="#00E5FF" size={0.015} spread={10} speed={0.05} />
        </>
      )}

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.2}
        />
      </EffectComposer>
    </Canvas>
  );
}

export { ParticleFieldMesh, GlowingSphere, EnergyRing, NeuralCore, DataStreams };
