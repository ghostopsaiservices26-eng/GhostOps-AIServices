import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-services',
  standalone: false,
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  constructor(private titleSvc: Title) {
    this.titleSvc.setTitle('Services — GhostOps AI Automation');
  }

  services = [
    {
      tag: '01 · AI Services',
      icon: '🤖',
      title: 'Custom AI Automation',
      desc: 'We design and build bespoke AI automation systems that eliminate manual work, reduce errors, and let your team focus on high-value tasks — from simple workflow triggers to complex multi-step AI pipelines.',
      accent: 'blue',
      benefits: [
        'Custom-built for your exact processes and tools',
        'Integrates with any existing platform or software',
        'Intelligent decision-making — not just rule-based triggers',
        'Real-time monitoring, alerts, and error recovery',
        'Scales automatically as your operations grow',
      ],
      useCases: ['CRM automation', 'Invoice processing', 'Data enrichment', 'Report generation', 'Lead scoring'],
    },
    {
      tag: '02 · AI Agents',
      icon: '⚡',
      title: 'Intelligent AI Agents',
      desc: 'Deploy autonomous AI agents that engage customers, qualify leads, and handle support queries across WhatsApp, Instagram, email, and more — all without human intervention, 24 hours a day.',
      accent: 'purple',
      benefits: [
        'Deploy on WhatsApp, Instagram, email, SMS, and web chat',
        'Natural language understanding for human-like dialogue',
        'Real-time lead qualification and CRM sync',
        'Smart escalation protocols for complex queries',
        'Full conversation logs and performance analytics',
      ],
      useCases: ['Customer support', 'Lead gen bots', 'Appointment booking', 'Product Q&A', 'Re-engagement flows'],
    },
    {
      tag: '03 · Web Development',
      icon: '💻',
      title: 'AI-Powered Websites',
      desc: 'We build stunning, blazing-fast websites with AI integrated from the ground up — designed to convert visitors into clients and connect seamlessly with your entire automation and CRM stack.',
      accent: 'cyan',
      benefits: [
        'Premium UI/UX designed to convert, not just look good',
        'Built-in AI chatbot and intelligent lead capture',
        'SEO-optimised structure for maximum search visibility',
        'Core Web Vitals and performance optimised',
        'Full CRM, email, and automation platform integration',
      ],
      useCases: ['Landing pages', 'SaaS platforms', 'Agency websites', 'Portfolio sites', 'E-commerce'],
    },
  ];

  integrations = [
    'OpenAI', 'Anthropic', 'HubSpot', 'Salesforce', 'Zapier',
    'Make (Integromat)', 'WhatsApp Business', 'Instagram API', 'Slack',
    'Notion', 'Airtable', 'Google Workspace', 'Microsoft 365',
    'LinkedIn', 'Twilio', 'Stripe', 'Shopify', 'Webflow',
  ];
}
