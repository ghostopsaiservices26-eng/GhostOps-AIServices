import { Component, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  @ViewChild('processSection') processSectionRef!: ElementRef<HTMLElement>;

  constructor(private zone: NgZone) {}

  services = [
    {
      icon: '🤖',
      tag: 'AI Services',
      title: 'Custom AI Automation',
      desc: 'End-to-end AI systems built for your exact business processes. Eliminate manual work and run smarter, leaner operations at scale.',
      features: ['Custom AI workflows & pipelines', 'Business process automation', 'AI model integration & fine-tuning', 'Real-time data automation'],
      color: 'blue',
    },
    {
      icon: '⚡',
      tag: 'AI Agents',
      title: 'Intelligent AI Agents',
      desc: 'Deploy autonomous AI agents on WhatsApp, Instagram, email, and more — engaging customers and generating leads 24/7 without you lifting a finger.',
      features: ['WhatsApp & Instagram AI bots', 'Lead generation & qualification', 'Automated customer support', 'Multi-channel marketing automation'],
      color: 'purple',
    },
    {
      icon: '💻',
      tag: 'Web Development',
      title: 'AI-Powered Websites',
      desc: 'High-converting websites with AI built in from day one. Designed to rank on Google, convert visitors, and integrate with your entire automation stack.',
      features: ['Conversion-optimised UI/UX', 'Built-in AI chat & lead capture', 'SEO & Core Web Vitals optimised', 'CRM & automation-ready'],
      color: 'cyan',
    },
  ];

  solutions = [
    { icon: '🔍', title: 'AI Candidate Sourcing', desc: 'Scan 50+ sources in minutes, not days' },
    { icon: '🎯', title: 'Smart Resume Screening', desc: 'AI scores every CV against your criteria' },
    { icon: '✉️', title: 'Automated Outreach', desc: 'Personalised messages sent at scale' },
    { icon: '📊', title: 'Pipeline Dashboard', desc: 'Full visibility across every open role' },
  ];

  stats = [
    { num: '80%', label: 'Time Saved', icon: '⏱️', desc: 'Eliminate repetitive tasks from your daily workflow' },
    { num: '60%', label: 'Cost Reduction', icon: '💰', desc: 'Scale operations without scaling headcount' },
    { num: '3×', label: 'Faster Growth', icon: '🚀', desc: 'Achieve more in less time with AI working 24/7' },
    { num: '24/7', label: 'Always On', icon: '🔄', desc: 'AI agents and systems that never sleep' },
  ];

  process = [
    { num: '01', icon: '🔍', title: 'Discover', desc: 'We audit your workflows, identify automation opportunities, and design a bespoke AI strategy tailored to your business goals.' },
    { num: '02', icon: '🛠️', title: 'Build', desc: 'Our engineers build custom AI systems, agents, and websites — fully integrated with your existing tools from day one.' },
    { num: '03', icon: '🚀', title: 'Deploy', desc: 'We launch, test, and optimise everything in your live environment. Zero disruption. Maximum performance from day one.' },
    { num: '04', icon: '📈', title: 'Scale', desc: 'Continuous monitoring, iteration, and expansion of your AI stack as your business grows and evolves over time.' },
  ];

  testimonials = [
    {
      quote: 'Ghost Ops AI completely transformed our recruitment pipeline. What took our team 3 days now runs automatically in under 2 hours.',
      name: 'Sarah Mitchell',
      role: 'Head of Talent',
      company: 'TalentBridge Group',
      initials: 'SM',
      color: 'blue',
    },
    {
      quote: 'Our WhatsApp AI agent handles 80% of inbound queries without any human input. The ROI was visible within the first week.',
      name: 'James Chen',
      role: 'Operations Director',
      company: 'ScaleFlow Digital',
      initials: 'JC',
      color: 'purple',
    },
    {
      quote: 'The website Ghost Ops built converts at 3× our old one. The AI lead capture runs 24/7 and we never miss an opportunity.',
      name: 'Priya Kapoor',
      role: 'Founder & CEO',
      company: 'Nexus Ventures',
      initials: 'PK',
      color: 'cyan',
    },
  ];

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => this.initProcessAnimation(), 100);
    });
  }

  private initProcessAnimation(): void {
    const section = this.processSectionRef.nativeElement;
    const cards = Array.from(section.querySelectorAll<HTMLElement>('.ps-card'));
    const lineFill = section.querySelector<HTMLElement>('.pg-line-fill');
    const header = section.querySelector<HTMLElement>('.ps-header');

    if (!lineFill || cards.length === 0) return;

    // On mobile: skip pin animation, show everything
    if (window.innerWidth <= 768) {
      gsap.set([header, ...cards], { opacity: 1, y: 0, clearProps: 'all' });
      return;
    }

    // Line starts at 0
    gsap.set(lineFill, { width: '0%' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
      },
    });

    // Header + card 01 appear immediately when section pins
    if (header) {
      tl.fromTo(header,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );
    }
    tl.fromTo(cards[0],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 },
      header ? '-=0.3' : '0'
    );

    // For steps 2, 3, 4: line fills to that step → card appears
    const segments = cards.length - 1; // 3 segments connecting 4 steps
    for (let i = 1; i < cards.length; i++) {
      const fromPct = `${((i - 1) / segments) * 100}%`;
      const toPct   = `${(i / segments) * 100}%`;

      tl.fromTo(lineFill,
        { width: fromPct },
        { width: toPct, duration: 2, ease: 'power1.inOut' }
      );
      tl.fromTo(cards[i],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'  // card appears just as line reaches the circle
      );
    }
  }
}
