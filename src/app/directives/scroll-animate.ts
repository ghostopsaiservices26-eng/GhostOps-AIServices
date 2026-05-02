import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: false,
})
export class ScrollAnimate implements OnInit, OnDestroy {
  /** Optional stagger delay in ms */
  @Input() animDelay = 0;

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const el = this.el.nativeElement;
    el.classList.add('scroll-hidden');
    if (this.animDelay) {
      el.style.transitionDelay = `${this.animDelay}ms`;
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.remove('scroll-hidden');
            el.classList.add('scroll-visible');
            this.observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }
}
