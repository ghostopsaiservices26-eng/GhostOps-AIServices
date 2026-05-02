import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: false,
})
export class Tilt implements OnInit {
  @Input() tiltMax = 10;
  @Input() tiltScale = 1.03;
  @Input() tiltGlow = false; // shift inner .sc-glow with cursor

  private el!: HTMLElement;

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.el = this.elRef.nativeElement;
    this.el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    this.el.style.willChange = 'transform';
  }

  @HostListener('mouseenter')
  onEnter(): void {
    this.el.style.transition = 'transform 0.12s ease';
  }

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    const rect = this.el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;  // -0.5 → 0.5
    const rx = -y * this.tiltMax;
    const ry =  x * this.tiltMax;
    this.el.style.transform =
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${this.tiltScale}) translateZ(0)`;

    // Shift the glow layer with the cursor (dark glass cards)
    if (this.tiltGlow) {
      const glow = this.el.querySelector<HTMLElement>('.sc-glow');
      if (glow) {
        const gx = 50 + x * 60;
        const gy = 50 + y * 60;
        glow.style.background =
          `radial-gradient(circle at ${gx}% ${gy}%, var(--glow-color, rgba(59,130,246,0.25)), transparent 70%)`;
      }
    }
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    this.el.style.transform =
      `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)`;
  }
}
