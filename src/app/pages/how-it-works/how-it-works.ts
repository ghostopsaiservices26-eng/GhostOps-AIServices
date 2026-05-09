import { Component, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-how-it-works',
  standalone: false,
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorks implements AfterViewInit {
  @ViewChild('obSection')  obSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('obLineFill') obLineFillRef!: ElementRef<HTMLElement>;

  constructor(private zone: NgZone) {}

  steps = [
    {
      num: '01',
      icon: '🔍',
      title: 'Discover',
      desc: 'We start with a deep-dive strategy session to understand your business, goals, and pain points. Our consultants map your current workflows and identify where AI creates maximum impact.',
      details: [
        'Free 60-minute strategy consultation',
        'Business process audit and workflow mapping',
        'AI opportunity identification and prioritisation',
        'Custom roadmap and investment proposal',
      ],
      time: '1–2 Days',
      visualTitle: 'Discovery Session',
      visual: [
        { label: 'Business Goals', value: 'Mapped ✓',    type: 'tag-green' },
        { label: 'Pain Points',    value: 'Identified ✓', type: 'tag-green' },
        { label: 'AI Opportunities', value: '7 Found',   type: 'tag-blue' },
        { label: 'ROI Estimate',   value: '+340%',        type: 'tag-purple' },
      ],
    },
    {
      num: '02',
      icon: '🛠️',
      title: 'Build',
      desc: 'Our engineers design and build your custom AI systems, agents, and websites. Every solution is tailor-made — no off-the-shelf templates. We integrate with your existing stack from day one.',
      details: [
        'Bespoke AI system architecture and design',
        'Full-stack development and platform integration',
        'Regular progress updates and live demos',
        'Rigorous QA testing across all environments',
      ],
      time: '1–4 Weeks',
      visualTitle: 'Build Progress',
      visual: [
        { label: 'Architecture',  value: 'Complete ✓', type: 'tag-green' },
        { label: 'AI Models',     value: 'Training',   type: 'tag-amber' },
        { label: 'Integrations',  value: '12 / 15',    type: 'tag-blue' },
        { label: 'QA Testing',    value: 'In Progress', type: 'tag-amber' },
      ],
    },
    {
      num: '03',
      icon: '🚀',
      title: 'Deploy',
      desc: 'We launch your AI systems in your live environment with full monitoring in place. Our team handles migration, training, and handover — zero disruption, maximum performance from day one.',
      details: [
        'Live environment deployment and configuration',
        'Real-time monitoring and alerting setup',
        'Team training and comprehensive handover docs',
        '30-day post-launch dedicated support included',
      ],
      time: '1–3 Days',
      visualTitle: 'Deployment Status',
      visual: [
        { label: 'Systems Live', value: '5 / 5 ✓', type: 'tag-green' },
        { label: 'Uptime',       value: '99.9%',   type: 'tag-green' },
        { label: 'Error Rate',   value: '0.01%',   type: 'tag-green' },
        { label: 'Active Alerts', value: '0',      type: 'tag-green' },
      ],
    },
    {
      num: '04',
      icon: '📈',
      title: 'Scale',
      desc: 'Your AI systems continuously improve. We monitor performance, optimise workflows, and expand your AI capabilities as your business grows — ensuring you always stay ahead of the competition.',
      details: [
        'Monthly performance reviews and reporting',
        'Continuous AI model improvement and retraining',
        'New automation opportunities identified and added',
        'Priority support channel and feature requests',
      ],
      time: 'Ongoing',
      visualTitle: 'Growth Metrics',
      visual: [
        { label: 'Month 1 ROI',      value: '+120%',   type: 'tag-blue' },
        { label: 'Month 3 ROI',      value: '+247%',   type: 'tag-purple' },
        { label: 'Tasks Automated',  value: '12,847',  type: 'tag-green' },
        { label: 'Hours Saved / mo', value: '480h',    type: 'tag-green' },
      ],
    },
  ];

  metrics = [
    { icon: '📈', num: '247%', label: 'Average ROI',    desc: 'Across all client implementations in first 90 days' },
    { icon: '⏱️', num: '80%',  label: 'Time Saved',     desc: 'Reduction in manual tasks and repetitive work' },
    { icon: '🤖', num: '50+',  label: 'AI Systems Built', desc: 'Deployed across multiple industries and verticals' },
    { icon: '🚀', num: '48h',  label: 'Time to Launch', desc: 'From strategy call to first live AI system' },
    { icon: '💰', num: '60%',  label: 'Cost Reduction', desc: 'Average reduction in operational overhead' },
    { icon: '✅', num: '99.9%', label: 'System Uptime', desc: 'Reliability and availability of all deployed systems' },
  ];

  onboarding = [
    { icon: '📞', title: 'Strategy Call',    desc: 'Free 30-minute discovery call to understand your business and goals.',      time: 'Day 0' },
    { icon: '📋', title: 'Custom Proposal',  desc: 'Detailed proposal with full scope, timeline, and investment breakdown.',    time: 'Day 1–2' },
    { icon: '🛠️', title: 'Build & Integrate', desc: 'We build and connect everything to your existing tools and stack.',       time: 'Week 1–4' },
    { icon: '🚀', title: 'Go Live',          desc: 'Your AI systems launch with full support, monitoring, and training.',       time: 'Week 2–5' },
  ];

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => this.initOnboardingLine(), 150);
    });
  }

  private initOnboardingLine(): void {
    const fill = this.obLineFillRef?.nativeElement;
    const section = this.obSectionRef?.nativeElement;
    if (!fill || !section) return;

    // Start at 0
    gsap.set(fill, { width: '0%' });

    gsap.to(fill, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end:   'bottom 60%',
        scrub: 0.8,
      },
    });
  }
}
