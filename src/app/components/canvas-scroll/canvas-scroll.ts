import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';

interface NetNode {
  id: string;
  label: string;
  sub: string;
  angle: number;
  color: string;
  glowColor: string;
  dotColor: string;
  appearAt: number;
  radius: number;
}

@Component({
  selector: 'app-canvas-scroll',
  standalone: false,
  templateUrl: './canvas-scroll.html',
  styleUrl: './canvas-scroll.scss',
})
export class CanvasScroll implements AfterViewInit, OnDestroy {
  @ViewChild('scrollSection') sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  anno1 = false;
  anno2 = false;
  anno3 = false;
  showCta = false;
  showHint = true;

  private ctx!: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private progress = 0;
  private ticking = false;
  private animFrame?: number;
  private scrollHandler!: EventListener;
  private resizeHandler!: EventListener;
  private startTime = Date.now();

  private centerNode: NetNode = {
    id: 'core', label: 'GhostOps', sub: 'AI Core',
    angle: 0, color: '#7c3aed', glowColor: 'rgba(124,58,237,0.5)',
    dotColor: '#22c55e', appearAt: 0.02, radius: 52,
  };

  private outerNodes: NetNode[] = [
    { id: 'whatsapp',  label: 'WhatsApp',  sub: 'Sales Agent',  angle: -Math.PI / 2,                color: '#3b82f6', glowColor: 'rgba(59,130,246,0.4)',  dotColor: '#22c55e', appearAt: 0.15, radius: 34 },
    { id: 'leads',     label: 'Lead AI',   sub: 'Qualifier',    angle: -Math.PI / 2 + Math.PI / 4, color: '#06b6d4', glowColor: 'rgba(6,182,212,0.4)',    dotColor: '#22c55e', appearAt: 0.21, radius: 34 },
    { id: 'recruit',   label: 'Recruit',   sub: 'Sourcing Bot', angle: 0,                           color: '#a78bfa', glowColor: 'rgba(167,139,250,0.4)', dotColor: '#22c55e', appearAt: 0.27, radius: 34 },
    { id: 'email',     label: 'Email',     sub: 'Outreach',     angle: Math.PI / 4,                 color: '#3b82f6', glowColor: 'rgba(59,130,246,0.4)',  dotColor: '#f59e0b', appearAt: 0.32, radius: 34 },
    { id: 'analytics', label: 'Analytics', sub: 'Dashboard',    angle: Math.PI / 2,                 color: '#06b6d4', glowColor: 'rgba(6,182,212,0.4)',    dotColor: '#22c55e', appearAt: 0.37, radius: 34 },
    { id: 'crm',       label: 'CRM',       sub: 'Integration',  angle: Math.PI / 2 + Math.PI / 4,  color: '#a78bfa', glowColor: 'rgba(167,139,250,0.4)', dotColor: '#22c55e', appearAt: 0.42, radius: 34 },
    { id: 'webai',     label: 'Web AI',    sub: 'Scraper',      angle: Math.PI,                     color: '#3b82f6', glowColor: 'rgba(59,130,246,0.4)',  dotColor: '#22c55e', appearAt: 0.46, radius: 34 },
    { id: 'instagram', label: 'Instagram', sub: 'AI Agent',     angle: Math.PI + Math.PI / 4,      color: '#06b6d4', glowColor: 'rgba(6,182,212,0.4)',    dotColor: '#f59e0b', appearAt: 0.50, radius: 34 },
  ];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.resizeCanvas();

      this.scrollHandler = () => {
        if (!this.ticking) {
          this.ticking = true;
          requestAnimationFrame(() => {
            this.updateProgress();
            this.ticking = false;
          });
        }
      };

      this.resizeHandler = () => this.resizeCanvas();

      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      window.addEventListener('resize', this.resizeHandler, { passive: true });

      const loop = () => {
        this.draw();
        this.animFrame = requestAnimationFrame(loop);
      };
      this.animFrame = requestAnimationFrame(loop);
    });
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.dpr = window.devicePixelRatio || 1;
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    canvas.width = this.W * this.dpr;
    canvas.height = this.H * this.dpr;
    canvas.style.width = this.W + 'px';
    canvas.style.height = this.H + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.scale(this.dpr, this.dpr);
    this.ctx = ctx;
  }

  private updateProgress(): void {
    const section = this.sectionRef.nativeElement;
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    this.progress = Math.max(0, Math.min(1, -rect.top / scrollable));

    const p = this.progress;
    const a1 = p >= 0.25, a2 = p >= 0.50, a3 = p >= 0.72;
    const cta = p >= 0.88, hint = p < 0.05;

    if (a1 !== this.anno1 || a2 !== this.anno2 || a3 !== this.anno3 || cta !== this.showCta || hint !== this.showHint) {
      this.zone.run(() => {
        this.anno1 = a1; this.anno2 = a2; this.anno3 = a3;
        this.showCta = cta; this.showHint = hint;
      });
    }
  }

  private nodePos(node: NetNode): { x: number; y: number } {
    if (node.id === 'core') return { x: this.W / 2, y: this.H / 2 };
    const r = Math.min(this.W, this.H) * (this.W < 768 ? 0.27 : 0.33);
    return {
      x: this.W / 2 + Math.cos(node.angle) * r,
      y: this.H / 2 + Math.sin(node.angle) * r,
    };
  }

  private draw(): void {
    const { ctx, W, H } = this;
    const p = this.progress;
    const t = (Date.now() - this.startTime) / 1000;

    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.7);
    bg.addColorStop(0, '#0f0829');
    bg.addColorStop(1, '#060912');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Dot grid
    const gridOp = Math.min(0.07, p * 0.12);
    if (gridOp > 0.005) {
      ctx.fillStyle = `rgba(99,102,241,${gridOp})`;
      for (let x = 0; x < W; x += 48) {
        for (let y = 0; y < H; y += 48) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const center = this.nodePos(this.centerNode);

    // Connections
    this.outerNodes.forEach((node, i) => {
      const connP = Math.max(0, Math.min(1, (p - node.appearAt - 0.03) / 0.1));
      if (connP <= 0) return;
      const pos = this.nodePos(node);
      const ex = pos.x + (center.x - pos.x) * connP;
      const ey = pos.y + (center.y - pos.y) * connP;
      ctx.save();
      const grad = ctx.createLinearGradient(pos.x, pos.y, center.x, center.y);
      grad.addColorStop(0, node.color + '55');
      grad.addColorStop(1, '#7c3aed55');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.restore();
    });

    // Particles
    if (p > 0.58) {
      const pAlpha = Math.min(1, (p - 0.58) / 0.12);
      this.outerNodes.forEach((node, i) => {
        const pos = this.nodePos(node);
        [0, 0.5].forEach(offset => {
          const tt = ((t * 0.5 + i * 0.37 + offset) % 1);
          const px = pos.x + (center.x - pos.x) * tt;
          const py = pos.y + (center.y - pos.y) * tt;
          const fade = pAlpha * Math.sin(tt * Math.PI);
          ctx.save();
          ctx.globalAlpha = fade;
          const grd = ctx.createRadialGradient(px, py, 0, px, py, 7);
          grd.addColorStop(0, node.color);
          grd.addColorStop(1, 'transparent');
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });
      });
    }

    // Outer nodes
    this.outerNodes.forEach(node => {
      const op = Math.max(0, Math.min(1, (p - node.appearAt) / 0.07));
      if (op <= 0) return;
      const pos = this.nodePos(node);
      this.drawOuterNode(ctx, node, pos, op, t);
    });

    // Center node
    const centerOp = Math.max(0, Math.min(1, (p - this.centerNode.appearAt) / 0.07));
    if (centerOp > 0) this.drawCenterNode(ctx, center, centerOp, t, p);
  }

  private drawOuterNode(ctx: CanvasRenderingContext2D, node: NetNode, pos: { x: number; y: number }, op: number, t: number): void {
    const r = node.radius;
    const pulse = 1 + Math.sin(t * 1.4 + node.angle) * 0.03;
    ctx.save();
    ctx.globalAlpha = op;

    const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2.8);
    grd.addColorStop(0, node.glowColor);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(pos.x, pos.y, r * 2.8, 0, Math.PI * 2); ctx.fill();

    ctx.beginPath(); ctx.arc(pos.x, pos.y, r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0e1f'; ctx.fill();
    ctx.strokeStyle = node.color; ctx.lineWidth = 2; ctx.stroke();

    ctx.beginPath(); ctx.arc(pos.x + r * 0.68, pos.y - r * 0.68, 5, 0, Math.PI * 2);
    ctx.fillStyle = node.dotColor; ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 12px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(node.label, pos.x, pos.y + r + 9);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(node.sub, pos.x, pos.y + r + 23);
    ctx.restore();
  }

  private drawCenterNode(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }, op: number, t: number, p: number): void {
    const r = this.centerNode.radius;
    const allOn = p > 0.6;
    const pulse = allOn ? 1 + Math.sin(t * 2) * 0.04 : 1;
    ctx.save();
    ctx.globalAlpha = op;

    if (allOn) {
      ctx.globalAlpha = (Math.sin(t * 2) * 0.5 + 0.5) * 0.2 * op;
      ctx.beginPath(); ctx.arc(pos.x, pos.y, r * 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = this.centerNode.color; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.globalAlpha = op;
    }

    const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 3);
    grd.addColorStop(0, this.centerNode.glowColor);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(pos.x, pos.y, r * 3, 0, Math.PI * 2); ctx.fill();

    ctx.beginPath(); ctx.arc(pos.x, pos.y, r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0e1f'; ctx.fill();
    ctx.strokeStyle = this.centerNode.color; ctx.lineWidth = 2.5; ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(r * 0.44)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('GhostOps', pos.x, pos.y - 7);
    ctx.fillStyle = '#94a3b8';
    ctx.font = `${Math.round(r * 0.27)}px Inter, sans-serif`;
    ctx.fillText('AI Core', pos.x, pos.y + 12);
    ctx.restore();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
    if (this.animFrame !== undefined) cancelAnimationFrame(this.animFrame);
  }
}
