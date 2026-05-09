import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID  = 'service_8muw215';
const EMAILJS_TEMPLATE_ID = 'template_nr9569x';
const EMAILJS_PUBLIC_KEY  = 'xAuZ81mMRR07yf3UX';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  form = { name: '', email: '', company: '', phone: '', size: '', challenge: '' };
  submitted = false;
  loading = false;
  error = '';

  onSubmit() {
    this.loading = true;
    this.error = '';
    const templateParams = {
      from_name:   this.form.name,
      reply_to:    this.form.email,
      company:     this.form.company,
      phone:       this.form.phone || 'Not provided',
      agency_size: this.form.size || 'Not specified',
      challenge:   this.form.challenge || 'Not provided',
    };
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
      .then(() => { this.submitted = true; this.loading = false; })
      .catch(() => { this.error = 'Something went wrong. Please try again or email us directly.'; this.loading = false; });
  }

  reset() {
    this.form = { name: '', email: '', company: '', phone: '', size: '', challenge: '' };
    this.submitted = false;
    this.error = '';
  }

  faqs = [
    { q: 'How long does a project take?', a: 'Most AI automation projects launch within 2–4 weeks. Simple AI agents can be live within 48–72 hours. We\'ll give you an exact timeline in your strategy call.' },
    { q: 'What does it cost?', a: 'Every project is scoped custom to your needs. Book a free call and we\'ll give you a transparent proposal with fixed pricing — no surprises.' },
    { q: 'Do you work with my existing tools?', a: 'Yes. GhostOps integrates with CRMs, email platforms, WhatsApp Business, Slack, spreadsheets, and hundreds of other tools via API and automation platforms.' },
    { q: 'How soon will I see ROI?', a: 'Most clients see measurable time savings and efficiency gains within the first week of going live. Full ROI typically within 30–90 days depending on scope.' },
    { q: 'Is my business data secure?', a: 'Absolutely. All data is encrypted at rest and in transit. We follow enterprise security standards and can sign NDAs before we start.' },
  ];

  openFaq: number | null = null;
  toggleFaq(index: number) { this.openFaq = this.openFaq === index ? null : index; }

  demoIncludes = [
    { icon: '🎯', title: 'Business audit', desc: 'We identify your top automation opportunities in real time.' },
    { icon: '🛠️', title: 'Custom roadmap', desc: 'A tailored plan of exactly what we\'d build for your business.' },
    { icon: '📊', title: 'ROI projection', desc: 'Clear numbers on time saved, cost reduction, and growth.' },
    { icon: '❓', title: 'Open Q&A', desc: 'Get every question answered by our engineers — live.' },
  ];

  trustBadges = [
    { icon: '🔒', text: 'Enterprise Security' },
    { icon: '⚡', text: 'Fast Onboarding' },
    { icon: '🤖', text: 'Custom AI Systems' },
    { icon: '🛡️', text: 'NDA Available' },
  ];
}
