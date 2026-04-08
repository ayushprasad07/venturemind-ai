"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref">;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const [isDark, setIsDark] = useState(true);

  // Track the custom theme toggler
  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains("dark");
    setIsDark(checkDark());

    const observer = new MutationObserver(() => {
      setIsDark(checkDark());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    points: THREE.Points;
    animationId: number;
  } | null>(null);

  // Initialize Three.js scene only once
  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      1,
      10000,
    );
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(scene.fog.color, 0);

    containerRef.current.appendChild(renderer.domElement);

    // Create geometry for all particles
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    // Store initial x and z positions for reference
    const initialXZ: { x: number; z: number }[] = [];

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

        positions.push(x, 0, z);
        initialXZ.push({ x, z });
        
        // Set initial colors
        if (isDark) {
          colors.push(200 / 255, 200 / 255, 200 / 255);
        } else {
          colors.push(0, 0, 0);
        }
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    // Create material
    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    // Create points object
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frameCount = 0;
    
    // Animation function
    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      const positionAttribute = geometry.attributes.position;
      const positionsArray = positionAttribute.array as Float32Array;

      // Update Y positions
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = (ix * AMOUNTY + iy) * 3;
          
          // Animate Y position with sine waves
          positionsArray[index + 1] =
            Math.sin((ix + frameCount) * 0.3) * 50 +
            Math.sin((iy + frameCount) * 0.5) * 50;
        }
      }

      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      frameCount += 0.1;
    };

    // Handle container resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    // Start animation
    animate();

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      points,
      animationId: 0, // We'll store the latest animation ID
    };

    // Update the animation ID reference
    const originalAnimate = animate;
    
    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      
      // Cancel all animation frames
      if (sceneRef.current) {
        // We need to cancel the animation properly
        cancelAnimationFrame(sceneRef.current.animationId);
      }

      // Clean up Three.js objects
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []); // Empty dependency array - only initialize once

  // Update colors when theme changes
  useEffect(() => {
    if (!sceneRef.current?.points) return;
    
    const points = sceneRef.current.points;
    const geometry = points.geometry;
    const colorAttribute = geometry.attributes.color;
    
    if (!colorAttribute) return;
    
    const colorsArray = colorAttribute.array as Float32Array;
    const AMOUNTX = 40;
    const AMOUNTY = 60;
    
    // Update all particle colors
    for (let i = 0; i < AMOUNTX * AMOUNTY; i++) {
      const index = i * 3;
      if (isDark) {
        // Light color for dark mode
        colorsArray[index] = 200 / 255;
        colorsArray[index + 1] = 200 / 255;
        colorsArray[index + 2] = 200 / 255;
      } else {
        // Dark color for light mode
        colorsArray[index] = 0;
        colorsArray[index + 1] = 0;
        colorsArray[index + 2] = 0;
      }
    }
    
    colorAttribute.needsUpdate = true;
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none fixed inset-0 -z-1", className)}
      {...props}
    />
  );
}