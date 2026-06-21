import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Text, Trail, MeshDistortMaterial, Wireframe, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ============================================ */
/* Custom 3D Assets (Monochrome)                 */
/* ============================================ */

function HeroObject() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.2;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={ref} position={[0, 0, -5]}>
        <torusKnotGeometry args={[2, 0.4, 128, 32]} />
        <MeshDistortMaterial color="#ffffff" emissive="#222222" wireframe distort={0.2} speed={2} />
      </mesh>
    </Float>
  );
}

function ArchitectStructure() {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  return (
    <group ref={group} position={[0, -20, -10]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, i * 2 - 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3 + i * 0.5, 3.1 + i * 0.5, 64]} />
          <meshStandardMaterial color="#ffffff" emissive="#555555" side={THREE.DoubleSide} wireframe />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial color="#111111" wireframe />
      </mesh>
    </group>
  );
}

function NexusGalaxy() {
  const group = useRef<THREE.Group>(null!);
  const count = 2000;
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const radius = 10 + Math.random() * 20;
      const theta = Math.random() * 2 * Math.PI;
      const y = (Math.random() - 0.5) * 5;
      temp[i] = Math.cos(theta) * radius;
      temp[i + 1] = y;
      temp[i + 2] = Math.sin(theta) * radius;
    }
    return temp;
  }, []);

  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={group} position={[0, -40, -15]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
      </points>
    </group>
  );
}

function OracleCore() {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });
  return (
    <group ref={ref} position={[0, -60, -5]}>
      <mesh>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial color="#000000" emissive="#ffffff" emissiveIntensity={0.5} wireframe />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function HorizonObelisk() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 - 80;
  });
  return (
    <mesh ref={ref} position={[0, -80, -20]}>
      <boxGeometry args={[2, 10, 2]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

/* ============================================ */
/* Scroll Controller                             */
/* ============================================ */
function ScrollCamera() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 5));
  
  useFrame(() => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
    
    // Scene y-positions map
    // Hero: 0
    // Architect: -20
    // Nexus: -40
    // Oracle: -60
    // Horizon: -80
    
    const targetY = -(progress * 80);
    const targetZ = 5 - Math.sin(progress * Math.PI * 4) * 2; // slight push in/out

    targetPos.current.set(0, targetY, targetZ);
    camera.position.lerp(targetPos.current, 0.05);
    camera.lookAt(0, targetY, -10);
  });

  return null;
}

/* ============================================ */
/* Main Scene Container                          */
/* ============================================ */
export default function SceneContainer({ isFixedScroll = false }: { isFixedScroll?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ position: isFixedScroll ? 'fixed' : 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1 }}
    >
      <color attach="background" args={['#000000']} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#aaaaaa" />

      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {isFixedScroll ? (
        <>
          <ScrollCamera />
          <HeroObject />
          <ArchitectStructure />
          <NexusGalaxy />
          <OracleCore />
          <HorizonObelisk />
        </>
      ) : (
        // For minimal scenes like dashboard
        <OracleCore />
      )}

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.5} />
        <Noise opacity={0.15} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
