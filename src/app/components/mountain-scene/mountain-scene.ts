import {
  Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-mountain-scene',
  standalone: false,
  templateUrl: './mountain-scene.html',
  styleUrl:    './mountain-scene.scss',
})
export class MountainScene implements AfterViewInit, OnDestroy {
  @ViewChild('mountRef') mountRef!: ElementRef<HTMLDivElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!:    THREE.Scene;
  private camera!:   THREE.PerspectiveCamera;
  private material!: THREE.ShaderMaterial;
  private pointLight!: THREE.PointLight;
  private frameId!:  number;

  // ── GLSL – vertex shader (Simplex / Perlin noise mountain displacement) ────
  private readonly vertexShader = `
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vPosition;

    vec3 mod289v3(vec3 x) { return x - floor(x*(1.0/289.0))*289.0; }
    vec4 mod289v4(vec4 x) { return x - floor(x*(1.0/289.0))*289.0; }
    vec4 permute(vec4 x)  { return mod289v4(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g  = step(x0.yzx, x0.xyz);
      vec3 l  = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289v3(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x  = x_ * ns.x + ns.yyyy;
      vec4 y  = y_ * ns.x + ns.yyyy;
      vec4 h  = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy,  h.x);
      vec3 p1 = vec3(a0.zw,  h.y);
      vec3 p2 = vec3(a1.xy,  h.z);
      vec3 p3 = vec3(a1.zw,  h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
      m = m*m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    void main(){
      vNormal   = normal;
      vPosition = position;

      float freq = 0.8;
      float amp  = 0.6;

      float d = snoise(vec3(position.x*freq, position.y*freq - time*0.2, 0.0)) * amp;
      d += snoise(vec3(position.x*freq*2.0, position.y*freq*2.0 - time*0.2, 0.0)) * (amp*0.5);

      vec3 newPos = position + normal * d;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `;

  // ── GLSL – fragment shader ─────────────────────────────────────────────────
  private readonly fragmentShader = `
    uniform vec3 color;
    uniform vec3 pointLightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main(){
      vec3 n        = normalize(vNormal);
      vec3 lightDir = normalize(pointLightPosition - vPosition);
      float diffuse = max(dot(n, lightDir), 0.0);
      float fresnel = pow(1.0 - dot(n, vec3(0.0, 0.0, 1.0)), 2.0);
      vec3 finalColor = color * diffuse + color * fresnel * 0.5;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => this.init());
  }

  private init(): void {
    const el = this.mountRef.nativeElement;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 100);
    this.camera.position.set(0, 1.5, 3);
    this.camera.rotation.x = -0.3;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(el.clientWidth, el.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(this.renderer.domElement);

    // Geometry + material
    const geometry = new THREE.PlaneGeometry(12, 8, 128, 128);
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      wireframe: false,
      transparent: true,
      uniforms: {
        time:               { value: 0 },
        pointLightPosition: { value: new THREE.Vector3(0, 0, 5) },
        color:              { value: new THREE.Color('#7dd3fc') },
      },
      vertexShader:   this.vertexShader,
      fragmentShader: this.fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.rotation.x = -Math.PI / 2;
    this.scene.add(mesh);

    // Light
    this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
    this.pointLight.position.set(0, 0, 5);
    this.scene.add(this.pointLight);

    window.addEventListener('resize',    this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);

    this.animate(0);
  }

  private animate = (t: number): void => {
    this.frameId = requestAnimationFrame(this.animate);
    this.material.uniforms['time'].value = t * 0.0003;
    this.renderer.render(this.scene, this.camera);
  };

  private onResize = (): void => {
    const el = this.mountRef.nativeElement;
    this.camera.aspect = el.clientWidth / el.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(el.clientWidth, el.clientHeight);
  };

  private onMouseMove = (e: MouseEvent): void => {
    const x = (e.clientX / window.innerWidth)  *  2 - 1;
    const y = (e.clientY / window.innerHeight) * -2 + 1;
    const pos = new THREE.Vector3(x * 5, 2, 2 - y * 2);
    this.pointLight.position.copy(pos);
    this.material.uniforms['pointLightPosition'].value = pos;
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize',    this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.renderer.dispose();
  }
}
