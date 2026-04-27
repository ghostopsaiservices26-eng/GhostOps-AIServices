import { Component } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  standalone: false,
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorks {
  steps = [
    {
      icon: '📥',
      title: 'Share Your Job Brief',
      desc: 'Tell Ghost Ops AI Services about the role you\'re filling. Add skills, experience requirements, location, salary range, and any specific criteria. The more detail you give, the more accurate your results.',
      details: [
        'Takes less than 5 minutes to set up a new role',
        'Use pre-built templates for common role types',
        'Set custom scoring weights for what matters most',
        'Import directly from your ATS or job board',
      ],
      time: 'Takes 5 minutes',
      visualTitle: 'Role Brief — Senior Developer',
      visual: [
        { label: 'Role', value: 'Senior Dev', type: 'tag-blue' },
        { label: 'Experience', value: '5+ years', type: 'tag-purple' },
        { label: 'Location', value: 'London / Remote', type: 'tag-green' },
        { label: 'Salary', value: '£70–90k', type: 'tag-blue' },
        { label: 'Priority Skills', value: 'React, Node, AWS', type: 'tag-purple' },
      ],
    },
    {
      icon: '🤖',
      title: 'AI Sources & Filters Candidates',
      desc: 'Our AI immediately begins searching across LinkedIn, job boards, CV databases, and your internal records. Every profile is scored against your brief in real time — you see results in minutes.',
      details: [
        'Searches 50+ sources simultaneously',
        'AI scores each candidate 0–100 against your criteria',
        'Filters out unqualified candidates automatically',
        'Identifies passive candidates open to new opportunities',
      ],
      time: 'Results in under 30 minutes',
      visualTitle: 'AI Sourcing Live',
      visual: [
        { label: 'Profiles Scanned', value: '2,847', type: 'tag-blue' },
        { label: 'Matched (>70%)', value: '94', type: 'tag-green' },
        { label: 'Strong Matches', value: '23', type: 'tag-purple' },
        { label: 'Top Score', value: '96 / 100', type: 'tag-green' },
        { label: 'Time Taken', value: '18 minutes', type: 'tag-blue' },
      ],
    },
    {
      icon: '✉️',
      title: 'Automated Outreach Begins',
      desc: 'Ghost Ops AI Services sends personalised messages to your top-matched candidates — crafted based on their profile, experience, and the role. Smart follow-up sequences run automatically until you get a response.',
      details: [
        'Personalised for each candidate — not a mass blast',
        'Multi-channel: email, LinkedIn, and SMS',
        'Optimal send times based on engagement data',
        'Automatic follow-ups with escalating personalisation',
      ],
      time: 'Sent within 1 hour of matching',
      visualTitle: 'Outreach Sequence',
      visual: [
        { label: 'Day 1 — Email', value: 'Sent ✓', type: 'tag-green' },
        { label: 'Day 3 — LinkedIn', value: 'Sent ✓', type: 'tag-green' },
        { label: 'Day 6 — Follow-up', value: 'Sent ✓', type: 'tag-green' },
        { label: 'Day 9 — Final', value: 'Pending', type: 'tag-amber' },
        { label: 'Replies So Far', value: '14 responses', type: 'tag-blue' },
      ],
    },
    {
      icon: '🏆',
      title: 'You Receive Qualified Candidates',
      desc: 'Your shortlist lands in your dashboard — ranked, scored, and ready for your review. Every candidate has already been pre-qualified and has expressed interest. You just pick who to interview.',
      details: [
        'Ranked shortlist with AI scores and highlights',
        'Candidate summaries — no need to read full CVs',
        'One-click to book interviews or move to ATS',
        'Full audit trail of all outreach and responses',
      ],
      time: 'Shortlist ready within 24–48 hours',
      visualTitle: 'Your Shortlist',
      visual: [
        { label: 'Sarah M. — 96%', value: 'Interested ✓', type: 'tag-green' },
        { label: 'James K. — 91%', value: 'Call Booked', type: 'tag-blue' },
        { label: 'Priya L. — 88%', value: 'Replied ✓', type: 'tag-green' },
        { label: 'Tom R. — 84%', value: 'Interested ✓', type: 'tag-green' },
        { label: 'Anna C. — 82%', value: 'Reviewing', type: 'tag-amber' },
      ],
    },
  ];

  metrics = [
    { icon: '⏱️', num: '82%', label: 'Time Saved', desc: 'Average reduction in hours spent per role' },
    { icon: '🎯', num: '5×', label: 'Faster Shortlisting', desc: 'From job brief to shortlist vs. manual process' },
    { icon: '📈', num: '3.2×', label: 'More Placements', desc: 'Average increase in monthly placements' },
    { icon: '💬', num: '60%', label: 'Higher Reply Rate', desc: 'On AI-personalised outreach vs. generic messages' },
    { icon: '✅', num: '89%', label: 'Match Accuracy', desc: 'Shortlisted candidates that make it to interview' },
    { icon: '🚀', num: '48h', label: 'Time to Launch', desc: 'From signing up to your first AI-sourced shortlist' },
  ];

  onboarding = [
    { icon: '📞', title: 'Discovery Call', desc: 'We learn about your agency, tools, and goals. 30 minutes, zero jargon.', time: 'Day 1' },
    { icon: '🔧', title: 'We Set Everything Up', desc: 'Our team configures your account, connects your ATS, and sets up your first workflow.', time: 'Day 1–2' },
    { icon: '🎓', title: 'Quick Walkthrough', desc: 'A 45-minute session with your team so everyone knows how to use the dashboard.', time: 'Day 2' },
    { icon: '🚀', title: 'Go Live', desc: 'Post your first role, watch Ghost Ops AI Services work, and receive your first AI shortlist.', time: 'Day 2–3' },
  ];
}
