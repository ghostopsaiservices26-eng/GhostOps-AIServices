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
      .then(() => {
        this.submitted = true;
        this.loading = false;
      })
      .catch(() => {
        this.error = 'Something went wrong. Please try again or email us directly.';
        this.loading = false;
      });
  }

  reset() {
    this.form = { name: '', email: '', company: '', phone: '', size: '', challenge: '' };
    this.submitted = false;
    this.error = '';
  }

  faqs = [
    { q: 'How long does setup take?', a: 'Most agencies are fully set up and running within 48 hours. Our onboarding team handles everything — no technical skills required.' },
    { q: 'What does it cost?', a: 'We offer flexible plans based on your team size and volume. Book a demo and we\'ll put together a custom quote.' },
    { q: 'How soon will I see results?', a: 'Most clients reduce time-to-shortlist by 60% in the first week. Placements typically increase within the first month.' },
    { q: 'Do I need to change my existing tools?', a: 'No. Ghost Ops AI Services integrates with your existing ATS, CRM, and email tools. We work alongside what you already use.' },
    { q: 'Is my candidate data secure?', a: 'Absolutely. We\'re GDPR-compliant and all data is encrypted at rest and in transit. We never share or sell candidate data.' },
  ];

  openFaq: number | null = null;

  toggleFaq(index: number) {
    this.openFaq = this.openFaq === index ? null : index;
  }

  demoIncludes = [
    { icon: '🎯', title: 'Live product walkthrough', desc: 'See exactly how Ghost Ops AI Services works for your type of roles.' },
    { icon: '📊', title: 'ROI calculation', desc: 'We\'ll show you how many hours and placements you could gain.' },
    { icon: '🔗', title: 'Integration check', desc: 'We confirm it works with your current ATS and tools.' },
    { icon: '❓', title: 'Open Q&A', desc: 'Ask anything — our team answers every question live.' },
  ];

  trustBadges = [
    { icon: '🔒', text: 'GDPR Compliant' },
    { icon: '⚡', text: '48h Setup' },
    { icon: '🏆', text: '500+ Agencies' },
    { icon: '⭐', text: '4.9/5 Rating' },
  ];
}
