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
  @ViewChild('canvas')        canvasRef!: ElementRef<HTMLCanvasElement>;

  anno1 = false;
  anno2 = false;
  anno3 = false;
  showCta  = false;
  showHint = true;

  private ctx!: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private progress  = 0;
  private ticking   = false;
  private animFrame?: number;
  private scrollHandler!: EventListener;
  private resizeHandler!: EventListener;
  private startTime = Date.now();

  private centerNode: NetNode = {
    id: 'core', label: 'GhostOps', sub: 'AI Core',
    angle: 0, color: '#7c3aed', glowColor: 'rgba(124,58,237,0.5)',
    dotColor: '#22c55e', appearAt: 0.02, radius: 56,
  };

  private outerNodes: NetNode[] = [
    { id: 'whatsapp',  label: 'WhatsApp',  sub: 'Sales Agent',   angle: -Math.PI / 2,                color: '#3b82f6', glowColor: 'rgba(59,130,246,0.35)',  dotColor: '#22c55e', appearAt: 0.04, radius: 32 },
    { id: 'leads',     label: 'Lead AI',   sub: 'Qualifier',     angle: -Math.PI / 2 + Math.PI / 4, color: '#06b6d4', glowColor: 'rgba(6,182,212,0.35)',    dotColor: '#22c55e', appearAt: 0.08, radius: 32 },
    { id: 'recruit',   label: 'Recruit',   sub: 'Sourcing Bot',  angle: 0,                           color: '#a78bfa', glowColor: 'rgba(167,139,250,0.35)', dotColor: '#22c55e', appearAt: 0.12, radius: 32 },
    { id: 'email',     label: 'Email',     sub: 'Outreach',      angle: Math.PI / 4,                 color: '#3b82f6', glowColor: 'rgba(59,130,246,0.35)',  dotColor: '#f59e0b', appearAt: 0.17, radius: 32 },
    { id: 'analytics', label: 'Analytics', sub: 'Dashboard',     angle: Math.PI / 2,                 color: '#06b6d4', glowColor: 'rgba(6,182,212,0.35)',    dotColor: '#22c55e', appearAt: 0.22, radius: 32 },
    { id: 'crm',       label: 'CRM',       sub: 'Integration',   angle: Math.PI / 2 + Math.PI / 4,  color: '#a78bfa', glowColor: 'rgba(167,139,250,0.35)', dotColor: '#22c55e', appearAt: 0.27, radius: 32 },
    { id: 'webai',     label: 'Web AI',    sub: 'Scraper',       angle: Math.PI,                     color: '#3b82f6', glowColor: 'rgba(59,130,246,0.35)',  dotColor: '#22c55e', appearAt: 0.32, radius: 32 },
    { id: 'instagram', label: 'Instagram', sub: 'AI Agent',      angle: Math.PI + Math.PI / 4,      color: '#06b6d4', glowColor: 'rgba(6,182,212,0.35)',    dotColor: '#f59e0b', appearAt: 0.37, radius: 32 },
  ];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.resizeCanvas();

      this.scrollHandler = () => {
        if (!this.ticking) {
          this.ticking = true;
          requestAnimationFrame(() => { this.updateProgress(); this.ticking = false; });
        }
      };
      this.resizeHandler = () => this.resizeCanvas();

      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      window.addEventListener('resize', this.resizeHandler, { passive: true });

      const loop = () => { this.draw(); this.animFrame = requestAnimationFrame(loop); };
      this.animFrame = requestAnimationFrame(loop);
    });
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.dpr = window.devicePixelRatio || 1;
    this.W   = window.innerWidth;
    this.H   = window.innerHeight;
    canvas.width  = this.W * this.dpr;
    canvas.height = this.H * this.dpr;
    canvas.style.width  = this.W + 'px';
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
    const a1 = p >= 0.12, a2 = p >= 0.35, a3 = p >= 0.55;
    const cta = p >= 0.72, hint = p < 0.04;

    if (a1 !== this.anno1 || a2 !== this.anno2 || a3 !== this.anno3 || cta !== this.showCta || hint !== this.showHint) {
      this.zone.run(() => {
        this.anno1 = a1; this.anno2 = a2; this.anno3 = a3;
        this.showCta = cta; this.showHint = hint;
      });
    }
  }

  private nodePos(node: NetNode): { x: number; y: number } {
    if (node.id === 'core') return { x: this.W / 2, y: this.H / 2 };
    const r = Math.min(this.W, this.H) * (this.W < 768 ? 0.27 : 0.32);
    return {
      x: this.W / 2 + Math.cos(node.angle) * r,
      y: this.H / 2 + Math.sin(node.angle) * r,
    };
  }

  // ─── Hexagon path helper ────────────────────────────────────────────────────
  private hexPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot = 0): void {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + rot;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  // ─── Main draw ──────────────────────────────────────────────────────────────
  private draw(): void {
    const { ctx, W, H } = this;
    const p = this.progress;
    const t = (Date.now() - this.startTime) / 1000;

    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.75);
    bg.addColorStop(0, '#090d1f');
    bg.addColorStop(1, '#03040a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    this.drawGrid(ctx, W, H, p);

    // Scan line sweep
    this.drawScanLine(ctx, W, H, t);

    const center = this.nodePos(this.centerNode);

    // Connections
    this.outerNodes.forEach(node => {
      const pos    = this.nodePos(node);
      const connP  = Math.max(0, Math.min(1, (p - node.appearAt - 0.03) / 0.1));
      if (connP > 0) this.drawConnection(ctx, pos, center, node, connP, t);
    });

    // Outer nodes
    this.outerNodes.forEach(node => {
      const op = Math.max(0, Math.min(1, (p - node.appearAt) / 0.07));
      if (op > 0) this.drawHexNode(ctx, node, this.nodePos(node), op, t);
    });

    // Center node
    const centerOp = Math.max(0, Math.min(1, (p - this.centerNode.appearAt) / 0.07));
    if (centerOp > 0) this.drawCenterHex(ctx, center, centerOp, t, p);
  }

  // ─── Grid ───────────────────────────────────────────────────────────────────
  private drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, p: number): void {
    const alpha = Math.min(0.055, p * 0.09);
    if (alpha < 0.004) return;
    const sp = 56;
    ctx.save();
    ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let x = 0; x <= W; x += sp) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = 0; y <= H; y += sp) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
    // Grid dots at intersections
    ctx.fillStyle = `rgba(139,92,246,${alpha * 1.6})`;
    for (let x = 0; x <= W; x += sp) {
      for (let y = 0; y <= H; y += sp) {
        ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  // ─── Scan line ──────────────────────────────────────────────────────────────
  private drawScanLine(ctx: CanvasRenderingContext2D, W: number, H: number, t: number): void {
    const y = (t * 90) % (H + 80) - 40;
    const gr = ctx.createLinearGradient(0, y - 60, 0, y + 30);
    gr.addColorStop(0, 'transparent');
    gr.addColorStop(0.6, 'rgba(59,130,246,0.032)');
    gr.addColorStop(1, 'transparent');
    ctx.fillStyle = gr;
    ctx.fillRect(0, y - 60, W, 90);
  }

  // ─── Connection line ─────────────────────────────────────────────────────────
  private drawConnection(
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    node: NetNode,
    connP: number,
    t: number
  ): void {
    const ex = from.x + (to.x - from.x) * connP;
    const ey = from.y + (to.y - from.y) * connP;

    ctx.save();
    const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    grad.addColorStop(0, node.color + '70');
    grad.addColorStop(0.5, node.color + '30');
    grad.addColorStop(1, '#7c3aed50');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 7]);
    ctx.lineDashOffset = -(t * 22);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.setLineDash([]);

    // Particles along the connection (only when fully drawn)
    if (connP >= 0.98) {
      [0, 0.38, 0.72].forEach((offset) => {
        const tt  = ((t * 0.42 + node.angle * 0.15 + offset) % 1);
        const px  = from.x + (to.x - from.x) * tt;
        const py  = from.y + (to.y - from.y) * tt;
        const fade = Math.sin(tt * Math.PI) * 0.95;
        ctx.globalAlpha = fade;
        // Glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 6);
        grd.addColorStop(0, node.color);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
        // Bright core
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
      });
    }
    ctx.restore();
  }

  // ─── Outer hex node ──────────────────────────────────────────────────────────
  private drawHexNode(
    ctx: CanvasRenderingContext2D,
    node: NetNode,
    pos: { x: number; y: number },
    op: number,
    t: number
  ): void {
    const r = node.radius;
    const pulse = 1 + Math.sin(t * 1.6 + node.angle) * 0.035;

    ctx.save();
    ctx.globalAlpha = op;

    // Ambient glow
    const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 3.2);
    grd.addColorStop(0, node.glowColor.replace('0.35', '0.18'));
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(pos.x, pos.y, r * 3.2, 0, Math.PI * 2); ctx.fill();

    // Outer hex ring
    this.hexPath(ctx, pos.x, pos.y, r * pulse + 8, Math.PI / 6);
    ctx.strokeStyle = node.color + '28';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Main hex body
    this.hexPath(ctx, pos.x, pos.y, r * pulse, Math.PI / 6);
    ctx.fillStyle = '#06091a';
    ctx.fill();
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Inner hex fill
    this.hexPath(ctx, pos.x, pos.y, r * 0.45, Math.PI / 6);
    const innerG = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 0.45);
    innerG.addColorStop(0, node.color + '55');
    innerG.addColorStop(1, 'transparent');
    ctx.fillStyle = innerG;
    ctx.fill();

    // Status dot with pulse ring
    const dotX = pos.x + r * 0.7;
    const dotY = pos.y - r * 0.55;
    const pRing = 5 + (Math.sin(t * 3 + node.angle) * 0.5 + 0.5) * 5;
    ctx.beginPath(); ctx.arc(dotX, dotY, pRing, 0, Math.PI * 2);
    ctx.strokeStyle = node.dotColor + '35';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
    ctx.fillStyle = node.dotColor;
    ctx.fill();

    // Labels
    ctx.fillStyle = '#d1d5db';
    ctx.font = '600 12px "Inter", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(node.label, pos.x, pos.y + r + 11);
    ctx.fillStyle = '#4b5563';
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillText(node.sub, pos.x, pos.y + r + 25);

    ctx.restore();
  }

  // ─── Center hex node ─────────────────────────────────────────────────────────
  private drawCenterHex(
    ctx: CanvasRenderingContext2D,
    pos: { x: number; y: number },
    op: number,
    t: number,
    p: number
  ): void {
    const r     = this.centerNode.radius;
    const allOn = p > 0.42;
    const pulse = 1 + (allOn ? Math.sin(t * 1.8) * 0.04 : 0);

    ctx.save();
    ctx.globalAlpha = op;

    // Large ambient glow
    const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 4.5);
    grd.addColorStop(0, 'rgba(124,58,237,0.28)');
    grd.addColorStop(0.4, 'rgba(59,130,246,0.08)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(pos.x, pos.y, r * 4.5, 0, Math.PI * 2); ctx.fill();

    // Slowest rotating outer hex
    if (allOn) {
      ctx.save();
      ctx.translate(pos.x, pos.y); ctx.rotate(t * 0.18); ctx.translate(-pos.x, -pos.y);
      this.hexPath(ctx, pos.x, pos.y, r * 2.4, Math.PI / 6);
      ctx.strokeStyle = 'rgba(124,58,237,0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 9]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Medium rotating hex (counter-rotate)
    if (allOn) {
      ctx.save();
      ctx.translate(pos.x, pos.y); ctx.rotate(-t * 0.28); ctx.translate(-pos.x, -pos.y);
      this.hexPath(ctx, pos.x, pos.y, r * 1.75, Math.PI / 6);
      ctx.strokeStyle = 'rgba(59,130,246,0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Static inner ring
    this.hexPath(ctx, pos.x, pos.y, r * 1.3, Math.PI / 6);
    ctx.strokeStyle = 'rgba(124,58,237,0.45)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Core hex (filled, pulsing)
    this.hexPath(ctx, pos.x, pos.y, r * pulse, Math.PI / 6);
    ctx.fillStyle = '#06091a';
    ctx.fill();
    ctx.strokeStyle = this.centerNode.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Inner gradient fill
    this.hexPath(ctx, pos.x, pos.y, r * 0.6 * pulse, Math.PI / 6);
    const inner = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 0.6);
    inner.addColorStop(0, 'rgba(124,58,237,0.5)');
    inner.addColorStop(1, 'transparent');
    ctx.fillStyle = inner;
    ctx.fill();

    // Corner accent dots on the hex vertices
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      const dx = pos.x + r * Math.cos(a);
      const dy = pos.y + r * Math.sin(a);
      ctx.beginPath(); ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = allOn ? this.centerNode.color : 'rgba(124,58,237,0.5)';
      ctx.fill();
    }

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(r * 0.42)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('GhostOps', pos.x, pos.y - 9);
    ctx.fillStyle = '#94a3b8';
    ctx.font = `${Math.round(r * 0.26)}px "Inter", sans-serif`;
    ctx.fillText('AI Core', pos.x, pos.y + 11);

    ctx.restore();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
    if (this.animFrame !== undefined) cancelAnimationFrame(this.animFrame);
  }
}
