import React, { useRef, useEffect, useState, useCallback } from 'react';
import { HARDWARE_TIERS } from './themes';
import { RotateCcw, Zap, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';

export default function CitadelCanvas({
  theme,
  telemetry,
  isDefcon,
  isSurging,
  onTriggerSurge,
  activeTexture,
  onSelectTexture,
  customTextureUrl,
  onUploadCustomTexture,
  explodedView,
  onToggleExplodedView
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const textureImgRef = useRef(null);

  // Physics-based Damped Orbit Camera (Smooth LERP)
  const targetYawRef = useRef(0);
  const targetPitchRef = useRef(0);
  const targetZoomRef = useRef(1.0);
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(0);
  const currentZoomRef = useRef(1.0);

  const [hudStats, setHudStats] = useState({ yaw: 0, pitch: 0, zoom: 100 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, startYaw: 0, startPitch: 0, lastX: 0, lastY: 0 });
  const momentumRef = useRef({ x: 0, y: 0 });
  const lastDragTimeRef = useRef(0);

  // Floating particles and laser packets state
  const particlesRef = useRef([]);
  const laserPacketsRef = useRef([]);
  const lightningBoltsRef = useRef([]);

  // Load backdrop texture image
  useEffect(() => {
    let url = null;
    if (activeTexture === 'citadel') {
      url = '/textures/citadel_monolith.webp';
    } else if (activeTexture === 'manhattan') {
      url = '/textures/manhattan_conduits.jpg';
    } else if (activeTexture === 'logo') {
      url = '/textures/cyberpunk_logo.png';
    } else if (activeTexture === 'custom' && customTextureUrl) {
      url = customTextureUrl;
    }

    if (url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        textureImgRef.current = img;
      };
      img.onerror = () => {
        textureImgRef.current = null;
      };
    } else {
      textureImgRef.current = null;
    }
  }, [activeTexture, customTextureUrl]);

  // Handle Drag & Drop of custom texture onto the canvas
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onUploadCustomTexture(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onUploadCustomTexture]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Mouse interaction for Orbit controls with smooth drag & angular momentum inertia
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    momentumRef.current = { x: 0, y: 0 };
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startYaw: targetYawRef.current,
      startPitch: targetPitchRef.current,
      lastX: e.clientX,
      lastY: e.clientY,
    };
    lastDragTimeRef.current = performance.now();
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastDragTimeRef.current);
    const stepX = e.clientX - dragStartRef.current.lastX;
    const stepY = e.clientY - dragStartRef.current.lastY;

    // Track instantaneous angular velocity
    momentumRef.current = {
      x: (stepX / dt) * 4.5,
      y: (-stepY / dt) * 3.5,
    };
    dragStartRef.current.lastX = e.clientX;
    dragStartRef.current.lastY = e.clientY;
    lastDragTimeRef.current = now;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const newYaw = Math.max(-45, Math.min(45, dragStartRef.current.startYaw + dx * 0.35));
    const newPitch = Math.max(-30, Math.min(30, dragStartRef.current.startPitch - dy * 0.25));
    targetYawRef.current = newYaw;
    targetPitchRef.current = newPitch;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    targetZoomRef.current = Math.max(0.65, Math.min(1.85, targetZoomRef.current + delta));
  };

  const resetView = () => {
    targetYawRef.current = 0;
    targetPitchRef.current = 0;
    targetZoomRef.current = 1.0;
  };

  // Trigger lightning surges when isSurging turns true
  useEffect(() => {
    if (isSurging) {
      const bolts = [];
      for (let i = 0; i < 7; i++) {
        bolts.push({
          progress: 0,
          speed: 0.035 + Math.random() * 0.045,
          tierFrom: 0,
          tierTo: 5,
          jitter: (Math.random() - 0.5) * 60,
          color: i % 2 === 0 ? theme.primary : theme.secondary,
        });
      }
      lightningBoltsRef.current = bolts;
    }
  }, [isSurging, theme]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    // Initialize atmospheric floating dust particles
    if (particlesRef.current.length === 0) {
      const p = [];
      for (let i = 0; i < 90; i++) {
        p.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() * 2 + 0.8,
          speedY: Math.random() * 0.0006 + 0.0002,
          speedX: (Math.random() - 0.5) * 0.0003,
          alpha: Math.random() * 0.7 + 0.2,
          pulse: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = p;
    }

    // Initialize elevated sky-bridge laser packets
    if (laserPacketsRef.current.length === 0) {
      const packets = [];
      for (let i = 0; i < 18; i++) {
        packets.push({
          progress: Math.random(),
          speed: Math.random() * 0.008 + 0.004,
          pathIndex: i % 4,
          size: Math.random() * 4 + 2,
          color: i % 2 === 0 ? theme.primary : theme.secondary,
        });
      }
      laserPacketsRef.current = packets;
    }

    const render = () => {
      time += 0.016;

      // Apply weighted angular glide momentum when mouse is released
      if (!isDraggingRef.current) {
        targetYawRef.current = Math.max(-45, Math.min(45, targetYawRef.current + momentumRef.current.x));
        targetPitchRef.current = Math.max(-30, Math.min(30, targetPitchRef.current + momentumRef.current.y));
        momentumRef.current.x *= 0.92;
        momentumRef.current.y *= 0.92;
      }

      // Smooth Physics Damping (LERP) for Camera
      currentYawRef.current += (targetYawRef.current - currentYawRef.current) * 0.12;
      currentPitchRef.current += (targetPitchRef.current - currentPitchRef.current) * 0.12;
      currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.14;

      const curYaw = currentYawRef.current;
      const curPitch = currentPitchRef.current;
      const curZoom = currentZoomRef.current;

      // Periodic HUD stat update
      if (Math.floor(time * 60) % 6 === 0) {
        setHudStats({
          yaw: Math.round(curYaw),
          pitch: Math.round(curPitch),
          zoom: Math.round(curZoom * 100),
        });
      }

      // Handle high-DPI sizing
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Clear background with theme void
      ctx.fillStyle = theme.void;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Backdrop Texture (Citadel / Manhattan reference image)
      if (textureImgRef.current && textureImgRef.current.complete && textureImgRef.current.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.42;
        ctx.globalCompositeOperation = 'screen';

        // Parallax shift based on smooth yaw & pitch
        const parallaxX = (curYaw / 45) * 35;
        const parallaxY = (curPitch / 30) * 25;

        const img = textureImgRef.current;
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;
        let drawW, drawH, drawX, drawY;

        if (canvasAspect > imgAspect) {
          drawW = width * 1.08;
          drawH = drawW / imgAspect;
        } else {
          drawH = height * 1.08;
          drawW = drawH * imgAspect;
        }
        drawX = (width - drawW) / 2 + parallaxX;
        drawY = (height - drawH) / 2 - parallaxY;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      // 3. Smooth Breathing Volumetric Overhead Spotlight
      ctx.save();
      const spotApexX = width * 0.5 + (curYaw / 45) * 40;
      const spotApexY = height * 0.02;
      const spotBaseY = height * 0.95;
      const spotBaseRadius = width * 0.42 * curZoom;

      const spotGrad = ctx.createRadialGradient(
        spotApexX, spotApexY, 10,
        spotApexX, spotBaseY * 0.65, spotBaseRadius
      );

      const spotColorBase = isDefcon ? 'rgba(239, 68, 68, ' : theme.spotlightColor.replace(/[\d.]+\)$/, '');
      const spotAlphaMax = isDefcon ? (0.35 + Math.sin(time * 5) * 0.12) : (0.22 + Math.sin(time * 1.8) * 0.04);

      spotGrad.addColorStop(0, `${spotColorBase}${spotAlphaMax * 1.5})`);
      spotGrad.addColorStop(0.35, `${spotColorBase}${spotAlphaMax})`);
      spotGrad.addColorStop(0.8, `${spotColorBase}${spotAlphaMax * 0.2})`);
      spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.moveTo(spotApexX, spotApexY);
      ctx.lineTo(spotApexX - spotBaseRadius, spotBaseY);
      ctx.lineTo(spotApexX + spotBaseRadius, spotBaseY);
      ctx.closePath();
      ctx.fillStyle = spotGrad;
      ctx.globalCompositeOperation = 'screen';
      ctx.fill();
      ctx.restore();

      // 4. Wet Reflective Tiled Floor Plane
      const horizonY = height * 0.68;
      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      floorGrad.addColorStop(0, 'rgba(3, 7, 18, 0.4)');
      floorGrad.addColorStop(0.4, 'rgba(8, 15, 30, 0.7)');
      floorGrad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');

      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Floor grid lines with perspective vanishing point
      ctx.save();
      ctx.strokeStyle = isDefcon ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 245, 212, 0.18)';
      ctx.lineWidth = 1;

      const vpX = width * 0.5 + (curYaw / 45) * 50;
      const vpY = horizonY;

      // Radial floor lines
      for (let x = -width * 0.6; x <= width * 1.6; x += 65) {
        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal perspective steps
      for (let i = 1; i <= 8; i++) {
        const stepY = horizonY + Math.pow(i / 8, 2.2) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, stepY);
        ctx.lineTo(width, stepY);
        ctx.stroke();
      }

      // Wet floor mirrored neon streaks with gentle wave shimmer
      ctx.globalCompositeOperation = 'screen';
      const streakGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      streakGrad.addColorStop(0, isDefcon ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0, 245, 212, 0.28)');
      streakGrad.addColorStop(0.5, isDefcon ? 'rgba(239, 68, 68, 0.12)' : 'rgba(247, 37, 133, 0.22)');
      streakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = streakGrad;
      const shimmerOffset = Math.sin(time * 2) * 8;
      ctx.fillRect(width * 0.35 + (curYaw / 45) * 20 + shimmerOffset, horizonY, width * 0.3, height - horizonY);
      ctx.restore();

      // 5. Procedural 3D Citadel Monolith Spire & Data Center Wings
      const centerX = width * 0.5;
      const centerY = height * 0.52;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(curZoom, curZoom);

      // 3D Yaw & Pitch skew
      const radYaw = (curYaw * Math.PI) / 180;
      const radPitch = (curPitch * Math.PI) / 180;
      const cosY = Math.cos(radYaw);
      const sinY = Math.sin(radYaw);
      const sinP = Math.sin(radPitch);

      const explodeYOffset = explodedView ? 40 : 0;

      const project3D = (x, y, z) => {
        const rotX = x * cosY - z * sinY;
        const rotZ = x * sinY + z * cosY;
        const projY = y + rotZ * sinP * 0.45;
        const depthScale = 800 / (800 + rotZ);
        return {
          x: rotX * depthScale,
          y: projY * depthScale,
          scale: depthScale,
        };
      };

      // Draw Surrounding Data Center Wings
      const drawServerWing = (side) => {
        const sign = side === 'left' ? -1 : 1;
        const wingX = sign * 260;
        const wingW = 110;
        const wingH = 280;
        const wingY = 30;

        ctx.save();
        ctx.strokeStyle = isDefcon ? 'rgba(239, 68, 68, 0.4)' : `${theme.primary}55`;
        ctx.fillStyle = 'rgba(6, 12, 28, 0.75)';
        ctx.lineWidth = 1.2;

        const p1 = project3D(wingX - wingW * 0.5, wingY - wingH * 0.5, -50);
        const p2 = project3D(wingX + wingW * 0.5, wingY - wingH * 0.5, -50);
        const p3 = project3D(wingX + wingW * 0.5, wingY + wingH * 0.5, -50);
        const p4 = project3D(wingX - wingW * 0.5, wingY + wingH * 0.5, -50);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Server rack shelf slots
        for (let r = -wingH * 0.42; r < wingH * 0.45; r += 24) {
          const lp1 = project3D(wingX - wingW * 0.4, wingY + r, -48);
          const lp2 = project3D(wingX + wingW * 0.4, wingY + r, -48);
          ctx.beginPath();
          ctx.moveTo(lp1.x, lp1.y);
          ctx.lineTo(lp2.x, lp2.y);
          ctx.stroke();

          const led1 = project3D(wingX - wingW * 0.35, wingY + r - 4, -48);
          const ledBlink = Math.sin(time * 4 + r) > 0.1;
          ctx.fillStyle = ledBlink ? theme.primary : `${theme.secondary}88`;
          ctx.fillRect(led1.x, led1.y, 3, 3);
        }

        ctx.restore();
      };

      drawServerWing('left');
      drawServerWing('right');

      // Draw Elevated Highway Sky-Bridges
      ctx.save();
      ctx.strokeStyle = `${theme.accent || theme.primary}77`;
      ctx.lineWidth = 2;

      const bL1 = project3D(-70, -20, 0);
      const bL2 = project3D(-200, 20, -40);
      ctx.beginPath();
      ctx.moveTo(bL1.x, bL1.y);
      ctx.lineTo(bL2.x, bL2.y);
      ctx.stroke();

      const bR1 = project3D(70, -40, 0);
      const bR2 = project3D(200, 0, -40);
      ctx.beginPath();
      ctx.moveTo(bR1.x, bR1.y);
      ctx.lineTo(bR2.x, bR2.y);
      ctx.stroke();

      // Laser packets traversing the bridges with smooth motion tail
      laserPacketsRef.current.forEach((pkt) => {
        pkt.progress = (pkt.progress + pkt.speed) % 1;
        let startP, endP;
        if (pkt.pathIndex === 0) {
          startP = bL1; endP = bL2;
        } else if (pkt.pathIndex === 1) {
          startP = bL2; endP = bL1;
        } else if (pkt.pathIndex === 2) {
          startP = bR1; endP = bR2;
        } else {
          startP = bR2; endP = bR1;
        }

        const currX = startP.x + (endP.x - startP.x) * pkt.progress;
        const currY = startP.y + (endP.y - startP.y) * pkt.progress;

        // Multi-Segment Exponential Phosphor Comet Tail
        const tailSegments = 6;
        for (let s = 1; s <= tailSegments; s++) {
          const tailProgress = Math.max(0, pkt.progress - (s * 0.016));
          const tX = startP.x + (endP.x - startP.x) * tailProgress;
          const tY = startP.y + (endP.y - startP.y) * tailProgress;
          const prevProgress = Math.max(0, pkt.progress - ((s - 1) * 0.016));
          const prevX = startP.x + (endP.x - startP.x) * prevProgress;
          const prevY = startP.y + (endP.y - startP.y) * prevProgress;

          ctx.strokeStyle = isDefcon ? '#ef4444' : pkt.color;
          ctx.globalAlpha = Math.pow(1 - (s / tailSegments), 1.8) * 0.9;
          ctx.lineWidth = pkt.size * (1 - (s / tailSegments) * 0.5);
          ctx.beginPath();
          ctx.moveTo(tX, tY);
          ctx.lineTo(prevX, prevY);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = isDefcon ? '#ef4444' : pkt.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(currX, currY, pkt.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();

      // Central Armored Black Spire
      ctx.save();
      const spireW = 120;
      const spireH = 380;
      const spireY = -10;

      const f1 = project3D(-spireW * 0.9, spireY + spireH * 0.5 + explodeYOffset, 30);
      const f2 = project3D(spireW * 0.9, spireY + spireH * 0.5 + explodeYOffset, 30);
      const f3 = project3D(spireW * 1.3, spireY + spireH * 0.58 + explodeYOffset, 60);
      const f4 = project3D(-spireW * 1.3, spireY + spireH * 0.58 + explodeYOffset, 60);

      ctx.fillStyle = 'rgba(8, 14, 26, 0.92)';
      ctx.strokeStyle = isDefcon ? '#ef4444' : theme.secondary;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(f1.x, f1.y);
      ctx.lineTo(f2.x, f2.y);
      ctx.lineTo(f3.x, f3.y);
      ctx.lineTo(f4.x, f4.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const m1 = project3D(-spireW * 0.5, spireY - spireH * 0.5, 0);
      const m2 = project3D(spireW * 0.5, spireY - spireH * 0.5, 0);
      const m3 = project3D(spireW * 0.65, spireY + spireH * 0.5, 20);
      const m4 = project3D(-spireW * 0.65, spireY + spireH * 0.5, 20);

      const spireGrad = ctx.createLinearGradient(0, m1.y, 0, m3.y);
      spireGrad.addColorStop(0, '#0a0d18');
      spireGrad.addColorStop(0.5, '#04070f');
      spireGrad.addColorStop(1, '#020308');
      ctx.fillStyle = spireGrad;
      ctx.strokeStyle = isDefcon ? 'rgba(239, 68, 68, 0.8)' : `${theme.primary}aa`;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(m1.x, m1.y);
      ctx.lineTo(m2.x, m2.y);
      ctx.lineTo(m3.x, m3.y);
      ctx.lineTo(m4.x, m4.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const sideSign = curYaw >= 0 ? 1 : -1;
      const bA = sideSign > 0 ? m2 : m1;
      const bB = sideSign > 0 ? m3 : m4;
      const bC = project3D(sideSign * spireW * 0.85, spireY + spireH * 0.45, -70);
      const bD = project3D(sideSign * spireW * 0.65, spireY - spireH * 0.45, -70);

      ctx.fillStyle = '#060912';
      ctx.strokeStyle = isDefcon ? 'rgba(239, 68, 68, 0.4)' : `${theme.secondary}66`;
      ctx.beginPath();
      ctx.moveTo(bA.x, bA.y);
      ctx.lineTo(bD.x, bD.y);
      ctx.lineTo(bC.x, bC.y);
      ctx.lineTo(bB.x, bB.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Vertical Glowing Power Conduits
      for (let c = -35; c <= 35; c += 18) {
        const cTop = project3D(c, spireY - spireH * 0.46, 5);
        const cBot = project3D(c * 1.25, spireY + spireH * 0.48, 22);

        ctx.strokeStyle = isDefcon ? '#ef4444' : (c === 0 ? theme.primary : theme.secondary);
        ctx.lineWidth = c === 0 ? 2.5 : 1.2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = c === 0 ? 10 : 5;

        ctx.beginPath();
        ctx.moveTo(cTop.x, cTop.y);
        ctx.lineTo(cBot.x, cBot.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 6. 90° Manhattan Neural Bus Routing
      const anchorPoints = HARDWARE_TIERS.map((tier) => {
        const normOffsetX = (tier.normX - 0.5) * 440;
        const normOffsetY = (tier.normY - 0.5) * 480;
        const zDepth = tier.id === 'T6_NEURAL_CROWN' ? 10 : (tier.id === 'T1_STORAGE' ? 40 : 15);
        return {
          ...tier,
          proj: project3D(normOffsetX, normOffsetY, zDepth),
        };
      });

      ctx.lineWidth = 1.8;
      for (let i = 0; i < anchorPoints.length - 1; i++) {
        const pA = anchorPoints[i].proj;
        const pB = anchorPoints[i + 1].proj;

        const cornerX = pB.x;
        const cornerY = pA.y;

        ctx.strokeStyle = isDefcon ? 'rgba(239, 68, 68, 0.7)' : (i % 2 === 0 ? `${theme.primary}bb` : `${theme.secondary}bb`);
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(cornerX, cornerY);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        const pulseRatio = (time * 1.5 + i * 0.3) % 1;
        let beadX, beadY;
        const leg1Len = Math.abs(cornerX - pA.x);
        const leg2Len = Math.abs(pB.y - cornerY);
        const totalLen = leg1Len + leg2Len || 1;

        if (pulseRatio < leg1Len / totalLen) {
          const subR = pulseRatio / (leg1Len / totalLen);
          beadX = pA.x + (cornerX - pA.x) * subR;
          beadY = pA.y;
        } else {
          const subR = (pulseRatio - leg1Len / totalLen) / (leg2Len / totalLen || 1);
          beadX = cornerX;
          beadY = cornerY + (pB.y - cornerY) * subR;
        }

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = isDefcon ? '#ef4444' : theme.primary;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(beadX, beadY, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Neural Surge Lightning Bolts
      if (lightningBoltsRef.current.length > 0) {
        ctx.save();
        lightningBoltsRef.current.forEach((bolt) => {
          bolt.progress += bolt.speed;
          if (bolt.progress <= 1.0) {
            const pStart = anchorPoints[bolt.tierFrom].proj;
            const pEnd = anchorPoints[bolt.tierTo].proj;

            ctx.strokeStyle = bolt.color;
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 14;
            ctx.lineWidth = 2.5;

            ctx.beginPath();
            ctx.moveTo(pStart.x, pStart.y);

            const segments = 8;
            for (let s = 1; s < segments; s++) {
              const segR = s / segments;
              const straightX = pStart.x + (pEnd.x - pStart.x) * segR;
              const straightY = pStart.y + (pEnd.y - pStart.y) * segR;
              const jX = straightX + (Math.sin(time * 30 + s * 4) * bolt.jitter);
              const jY = straightY + (Math.cos(time * 25 + s * 3) * bolt.jitter);
              ctx.lineTo(jX, jY);
            }
            ctx.lineTo(pEnd.x, pEnd.y);
            ctx.stroke();
          }
        });
        lightningBoltsRef.current = lightningBoltsRef.current.filter((b) => b.progress <= 1.0);
        ctx.restore();
      }

      // Draw the 6 Hardware Anchor Reticles & Badges
      anchorPoints.forEach((anchor, idx) => {
        const { proj, label } = anchor;

        ctx.save();
        ctx.translate(proj.x, proj.y);

        ctx.strokeStyle = isDefcon ? '#ef4444' : (idx === 5 ? theme.secondary : theme.primary);
        ctx.lineWidth = 1.6;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 8;

        const dSize = 7.5;
        ctx.beginPath();
        ctx.moveTo(0, -dSize);
        ctx.lineTo(dSize, 0);
        ctx.lineTo(0, dSize);
        ctx.lineTo(-dSize, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.save();
        ctx.rotate(time * (idx % 2 === 0 ? 1.2 : -1.2));
        ctx.strokeStyle = `${theme.primary}88`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, dSize * 1.8, 0, Math.PI * 0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, dSize * 1.8, Math.PI, Math.PI * 1.6);
        ctx.stroke();
        ctx.restore();

        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(label, 14, 3);
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      ctx.restore();

      // 7. Atmospheric Floating Dust Particles with Volumetric Spotlight Mie Scattering
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      particlesRef.current.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = 1;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;

        const pX = p.x * width;
        const pY = p.y * height;

        // Calculate proximity to overhead spotlight cone for realistic forward Mie scattering
        const coneRadiusAtY = spotBaseRadius * Math.max(0.12, (pY - spotApexY) / (spotBaseY - spotApexY));
        const distFromSpotAxis = Math.abs(pX - spotApexX);
        const isInsideCone = pY > spotApexY && distFromSpotAxis < coneRadiusAtY;
        const scatteringMultiplier = isInsideCone
          ? 1.0 + Math.pow(1 - distFromSpotAxis / coneRadiusAtY, 1.5) * 2.4
          : 0.55;

        const currentAlpha = Math.min(0.95, p.alpha * (0.5 + Math.sin(time * 2.5 + p.pulse) * 0.5) * scatteringMultiplier);

        ctx.fillStyle = isInsideCone
          ? `rgba(255, 255, 255, ${currentAlpha})`
          : (isDefcon ? `rgba(239, 68, 68, ${currentAlpha})` : `rgba(0, 245, 212, ${currentAlpha})`);

        ctx.beginPath();
        ctx.arc(pX, pY, isInsideCone ? p.size * 1.25 : p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [theme, isDefcon, explodedView]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Top Floating Viewport Control Toolbar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1.5 rounded border border-white/10 text-xs shadow-lg">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1 flex items-center gap-1">
          <Layers className="w-3 h-3 text-cyan-400" />
          CITADEL MONOLITH
        </span>

        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded border border-white/5">
          <button
            onClick={() => onSelectTexture('citadel')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all duration-200 ${
              activeTexture === 'citadel'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,245,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CITADEL
          </button>
          <button
            onClick={() => onSelectTexture('manhattan')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all duration-200 ${
              activeTexture === 'manhattan'
                ? 'bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-400/50 shadow-[0_0_8px_rgba(247,37,133,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            MANHATTAN
          </button>
          <button
            onClick={() => onSelectTexture('logo')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all duration-200 ${
              activeTexture === 'logo'
                ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/50 shadow-[0_0_8px_rgba(252,238,10,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            LOGO
          </button>
          <button
            onClick={() => onSelectTexture('procedural')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all duration-200 ${
              activeTexture === 'procedural'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PURE WIRE
          </button>
        </div>

        <label className="cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] border border-white/10 transition-colors">
          <ImageIcon className="w-3 h-3 text-emerald-400" />
          LOAD IMAGE
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (ev) => onUploadCustomTexture(ev.target.result);
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
        </label>

        <button
          onClick={onToggleExplodedView}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-all duration-300 ${
            explodedView
              ? 'bg-purple-500/30 text-purple-200 border-purple-400/60 shadow-[0_0_8px_rgba(157,78,221,0.5)]'
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
          }`}
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          EXPLODE TIERS
        </button>

        <button
          onClick={resetView}
          className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10 transition-colors"
          title="Reset Orbit & Zoom"
        >
          <RotateCcw className="w-3 h-3" />
        </button>

        <button
          onClick={onTriggerSurge}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 border border-cyan-400/40 text-cyan-200 hover:brightness-125 text-[10px] font-bold shadow-[0_0_10px_rgba(0,245,212,0.3)] ml-1 transition-all"
        >
          <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse" />
          SURGE
        </button>
      </div>

      {/* Orbit & Zoom HUD Indicator */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[10px] font-mono text-slate-400 pointer-events-none shadow-md">
        <span>YAW: {hudStats.yaw}°</span>
        <span>PITCH: {hudStats.pitch}°</span>
        <span>ZOOM: {hudStats.zoom}%</span>
      </div>

      {/* =========================================================================
          DIEGETIC 3D HUD BILLBOARDS (Floating in Perspective with Smooth CSS)
          ========================================================================= */}

      {/* 1. Upper-Right HUD: BRIDGE // TELEMETRY.01 */}
      <div
        className="absolute top-14 right-4 z-10 w-64 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(900px) rotateY(${(-hudStats.yaw * 0.45 - 8)}deg) rotateX(${hudStats.pitch * 0.3}deg)`,
          transformOrigin: 'top right',
        }}
      >
        <div className="bg-black/85 backdrop-blur-md p-2.5 rounded-lg border border-cyan-400/40 shadow-[0_0_15px_rgba(0,245,212,0.25)] text-slate-200">
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1 mb-1.5">
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 font-orbitron">
              BRIDGE // TELEMETRY.01
            </span>
            <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-mono">
              DMA_CH_04
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-2">
            <div>
              <div className="text-[9px] text-slate-400">LLM TOKENS</div>
              <div className="text-base font-bold text-white flex items-baseline gap-1">
                {(telemetry.tokSec || 84.6).toFixed(1)}
                <span className="text-[9px] text-cyan-400">tok/s</span>
              </div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400">TTFT LATENCY</div>
              <div className="text-base font-bold text-white flex items-baseline gap-1">
                {telemetry.ttftMs || 142}
                <span className="text-[9px] text-fuchsia-400">ms</span>
              </div>
            </div>
          </div>

          <div className="h-8 w-full bg-slate-950/80 rounded border border-white/5 relative overflow-hidden flex items-end px-1 gap-1">
            {[45, 60, 52, 78, 65, 88, 92, 70, 85, 95, 80, 110, 98, 120, 85, 92].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-fuchsia-500 rounded-t-sm transition-all duration-300"
                style={{ height: `${(val / 130) * 100}%`, opacity: 0.75 }}
              />
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400 font-mono">
            <span>BUS LINK: 128 GB/s</span>
            <span className="text-emerald-400">SYNC: 99.98%</span>
          </div>
        </div>
      </div>

      {/* 2. Bottom-Center HUD: MONOLITH // CORE.02 */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-72 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-50%) perspective(900px) rotateX(${(-hudStats.pitch * 0.4 + 10)}deg) rotateY(${-hudStats.yaw * 0.3}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div className="bg-black/85 backdrop-blur-md p-2.5 rounded-lg border border-fuchsia-500/40 shadow-[0_0_15px_rgba(247,37,133,0.25)] text-slate-200">
          <div className="flex items-center justify-between border-b border-fuchsia-500/30 pb-1 mb-1.5">
            <span className="text-[10px] font-bold tracking-widest text-fuchsia-400 font-orbitron">
              MONOLITH // CORE.02
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              CPU: {telemetry.cpuLoad || 42}% @ {(telemetry.cpuTemp || 56.4).toFixed(1)}°C
            </span>
          </div>

          <div className="flex items-end justify-between h-9 px-1 gap-1.5 bg-slate-950/70 rounded p-1 border border-white/5">
            {(telemetry.cpuCores ? telemetry.cpuCores.slice(0, 8) : Array(8).fill({ load: 45 })).map((core, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                <div
                  className="w-full rounded-t-xs transition-all duration-300 ease-out"
                  style={{
                    height: `${Math.max(15, core.load)}%`,
                    backgroundColor: core.load > 75 ? '#ef4444' : (core.load > 55 ? '#f59e0b' : theme.primary),
                  }}
                />
                <span className="text-[7px] text-slate-500 font-mono">C{i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom-Right HUD: CITADEL // MATRIX.03 */}
      <div
        className="absolute bottom-4 right-4 z-10 w-72 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(900px) rotateY(${(-hudStats.yaw * 0.45 - 10)}deg) rotateX(${(-hudStats.pitch * 0.3 + 8)}deg)`,
          transformOrigin: 'bottom right',
        }}
      >
        <div className="bg-black/85 backdrop-blur-md p-2.5 rounded-lg border border-amber-400/40 shadow-[0_0_15px_rgba(252,238,10,0.2)] text-slate-200">
          <div className="flex items-center justify-between border-b border-amber-400/30 pb-1 mb-1.5">
            <span className="text-[10px] font-bold tracking-widest text-amber-300 font-orbitron">
              CITADEL // MATRIX.03
            </span>
            <span className="text-[9px] text-emerald-400 font-mono">
              PCIe 5.0 x16
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-white/5 p-1 rounded">
              <div className="text-[8px] text-slate-400">NVMe READ</div>
              <div className="text-xs font-bold text-white">
                {(telemetry.diskReadMbs || 940.5).toFixed(0)} <span className="text-[8px] text-cyan-400">MB/s</span>
              </div>
            </div>
            <div className="bg-white/5 p-1 rounded">
              <div className="text-[8px] text-slate-400">VRAM USED</div>
              <div className="text-xs font-bold text-white">
                {(telemetry.vramUsedGb || 20.4).toFixed(1)} <span className="text-[8px] text-fuchsia-400">GB</span>
              </div>
            </div>
            <div className="bg-white/5 p-1 rounded">
              <div className="text-[8px] text-slate-400">GPU TDP</div>
              <div className="text-xs font-bold text-white">
                {(telemetry.gpuWatts || 285).toFixed(0)} <span className="text-[8px] text-amber-400">W</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
