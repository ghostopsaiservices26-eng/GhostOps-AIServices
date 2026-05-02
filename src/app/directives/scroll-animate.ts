import { Directive, ElementRef, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[appScrollAnimate]',
  standalone: false,
})
export class ScrollAnimate implements OnInit, OnDestroy {
  /** Stagger delay offset in seconds */
  @Input() animDelay = 0;

  private trigger!: ScrollTrigger;

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngOnInit(): void {
    const el = this.el.nativeElement;

    this.zone.runOutsideAngular(() => {
      // Set initial state — scale + rotateX + slight Z for true 3D depth
      gsap.set(el, {
        opacity: 0,
        y: 70,
        rotateX: 18,
        scale: 0.93,
        transformPerspective: 1200,
        transformOrigin: 'center 120%',
      });

      // Scrubbed scroll animation
      gsap.to(el, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1,
        delay: this.animDelay / 1000,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'top 45%',
          scrub: 0.9,
        },
      });
    });
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => {
      if (t.trigger === this.el.nativeElement) t.kill();
    });
  }
}
