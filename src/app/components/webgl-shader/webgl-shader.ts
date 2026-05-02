import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-webgl-shader',
  standalone: false,
  templateUrl: './webgl-shader.html',
  styleUrl: './webgl-shader.scss',
})
export class WebglShader implements AfterViewInit, OnDestroy {
  @ViewChild('shaderCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private mesh!: THREE.Mesh;
  private uniforms: any;
  private animationId!: number;

  private vertexShader = `
    attribute vec3 position;
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  private fragmentShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    uniform float xScale;
    uniform float yScale;
    uniform float distortion;

    void main() {
      vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
      float d = length(p) * distortion;

      float rx = p.x * (1.0 + d);
      float gx = p.x;
      float bx = p.x * (1.0 - d);

      float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
      float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
      float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();
    window.addEventListener('resize', this.onResize);
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(new THREE.Color(0x000000));

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    this.uniforms = {
      resolution: { value: [window.innerWidth, window.innerHeight] },
      time:       { value: 0.0 },
      xScale:     { value: 1.0 },
      yScale:     { value: 0.5 },
      distortion: { value: 0.05 },
    };

    const positions = new Float32Array([
      -1, -1, 0,   1, -1, 0,  -1,  1, 0,
       1, -1, 0,  -1,  1, 0,   1,  1, 0,
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.RawShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: this.uniforms,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.onResize();
  }

  private animate = (): void => {
    this.uniforms.time.value += 0.01;
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animate);
  };

  private onResize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.uniforms.resolution.value = [w, h];
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.renderer.dispose();
  }
}
