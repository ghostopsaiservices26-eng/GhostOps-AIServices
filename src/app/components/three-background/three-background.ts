import {
  Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-background',
  standalone: false,
  templateUrl: './three-background.html',
  styleUrl: './three-background.scss',
})
export class ThreeBackground implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private animId!: number;
  private scrollY = 0;
  private mouse = new THREE.Vector2(0, 0);
  private meshes: THREE.Mesh[] = [];
  private particles!: THREE.Points;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => this.init());
  }

  private init(): void {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 0, 12);

    this.createParticles();
    this.createWireframes();

    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);

    this.animate();
  }

  private createParticles(): void {
    const count = 2500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#3b82f6'),
      new THREE.Color('#7c3aed'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#60a5fa'),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  private createWireframes(): void {
    const wireMat = (hex: number, opacity = 0.18) =>
      new THREE.MeshBasicMaterial({ color: hex, wireframe: true, transparent: true, opacity });

    const defs: Array<{ geo: THREE.BufferGeometry; color: number; x: number; y: number; z: number; spd: number }> = [
      { geo: new THREE.IcosahedronGeometry(1.4, 1),          color: 0x3b82f6, x: -7,  y:  4,  z: -3,  spd: 0.35 },
      { geo: new THREE.OctahedronGeometry(1.0, 0),           color: 0x7c3aed, x:  7,  y: -2,  z: -4,  spd: 0.55 },
      { geo: new THREE.TorusGeometry(1.1, 0.35, 8, 14),      color: 0x06b6d4, x:  0,  y:  7,  z: -5,  spd: 0.28 },
      { geo: new THREE.TorusKnotGeometry(0.7, 0.22, 64, 8),  color: 0x8b5cf6, x: -9,  y: -6,  z: -6,  spd: 0.20 },
      { geo: new THREE.TetrahedronGeometry(1.1, 0),          color: 0x60a5fa, x:  8,  y:  6,  z: -3,  spd: 0.48 },
      { geo: new THREE.IcosahedronGeometry(0.75, 0),         color: 0xa78bfa, x: -3,  y: -8,  z: -4,  spd: 0.65 },
      { geo: new THREE.OctahedronGeometry(1.4, 0),           color: 0x38bdf8, x:  5,  y: -1,  z: -7,  spd: 0.30 },
      { geo: new THREE.IcosahedronGeometry(0.9, 1),          color: 0xc084fc, x: -5,  y:  9,  z: -8,  spd: 0.42 },
    ];

    defs.forEach(d => {
      const mesh = new THREE.Mesh(d.geo, wireMat(d.color));
      mesh.position.set(d.x, d.y, d.z);
      mesh.userData['spd'] = d.spd;
      mesh.userData['baseY'] = d.y;
      mesh.userData['seed'] = Math.random() * Math.PI * 2;
      this.meshes.push(mesh);
      this.scene.add(mesh);
    });
  }

  private animate = (): void => {
    this.animId = requestAnimationFrame(this.animate);
    const t = this.clock.getElapsedTime();

    this.meshes.forEach((m, i) => {
      const spd = m.userData['spd'] as number;
      m.rotation.x = t * spd * 0.5;
      m.rotation.y = t * spd;
      m.position.y = (m.userData['baseY'] as number) + Math.sin(t * 0.35 + (m.userData['seed'] as number)) * 0.5;
    });

    this.particles.rotation.y = t * 0.018;
    this.particles.rotation.x = t * 0.009;

    // Smooth scroll follow
    const targetY = -(this.scrollY * 0.006);
    this.camera.position.y += (targetY - this.camera.position.y) * 0.06;

    // Mouse parallax
    const targetX = this.mouse.x * 1.2;
    this.camera.position.x += (targetX - this.camera.position.x) * 0.04;

    this.renderer.render(this.scene, this.camera);
  };

  private onScroll = (): void => {
    this.scrollY = window.scrollY;
  };

  private onMouseMove = (e: MouseEvent): void => {
    this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  private onResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
