"use client";

/**
 * FluidBackground — R3F canvas fixed behind the DOM.
 * A fullscreen plane runs a domain-warped fbm noise shader: dark liquid
 * distortion in the void, with Lumin's volt-lime (signal) and pink (ember)
 * bioluminescence leaning toward the cursor. Mouse is lerped in the frame
 * loop for the fluid, physics-y chase.
 *
 * Mount ONCE (e.g. in app/page.tsx) — it stays behind every section.
 */

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;      // smoothed, 0..1
  uniform vec2  uResolution;
  varying vec2  vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.0 + vec2(13.7, 7.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 p = uv * aspect;

    // Domain-warped fbm = the liquid look
    float t = uTime * 0.06;
    vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t * 0.7));
    vec2 r = vec2(fbm(p * 1.6 + q * 1.8 + t * 0.5),
                  fbm(p * 1.6 + q * 1.8 - t * 0.3));
    float field = fbm(p * 1.6 + r * 1.4);

    // Cursor proximity glow
    float md = distance(uv * aspect, uMouse * aspect);
    float glow = smoothstep(0.55, 0.0, md);

    // Lumin palette — night void, signal lime, ember pink
    vec3 signal = vec3(0.851, 1.0, 0.231);   // #d9ff3b
    vec3 ember  = vec3(1.0, 0.620, 0.878);   // #ff9ee0

    vec3 col = vec3(0.0196);                  // #050505 night
    col += ember  * pow(field, 3.0) * 0.16;                 // pink veins
    col += signal * pow(fbm(p * 2.2 - r + t), 4.0) * 0.10;  // lime filaments
    col += mix(ember, signal, field) * glow * 0.14;          // cursor bioluminescence

    // Vignette keeps the edges pure void
    float vig = smoothstep(1.15, 0.35, distance(uv, vec2(0.5)));
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function FluidPlane() {
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uResolution.value.set(size.width, size.height);

    // Pointer (-1..1) → UV space (0..1)
    targetMouse.current.set(
      state.pointer.x * 0.5 + 0.5,
      state.pointer.y * 0.5 + 0.5
    );
    // Lerp = laggy, fluid chase
    uniforms.uMouse.value.lerp(targetMouse.current, 0.05);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function FluidBackground() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]} // cap DPR — 5-octave fbm is fill-rate heavy
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 1] }}
      >
        <FluidPlane />
      </Canvas>
    </div>
  );
}
