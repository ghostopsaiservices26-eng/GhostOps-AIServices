import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: false,
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  services = [
    {
      tag: '🔍 Service 01',
      icon: '🔍',
      title: 'AI Candidate Sourcing',
      desc: 'Stop searching job boards manually. Our AI scans LinkedIn, job boards, and your existing database simultaneously — surfacing qualified candidates you\'d never have found on your own.',
      benefits: [
        'Searches 50+ sources simultaneously in real time',
        'Learns your preferences and improves over time',
        'Finds passive candidates who aren\'t actively applying',
        'Delivers results in minutes, not days',
      ],
      visualLabel: 'Sources Searched Automatically',
      visualItems: [
        { label: 'LinkedIn', pct: 92 },
        { label: 'Indeed', pct: 87 },
        { label: 'Internal DB', pct: 78 },
        { label: 'GitHub / Portfolio', pct: 65 },
      ],
    },
    {
      tag: '🎯 Service 02',
      icon: '🎯',
      title: 'Resume Screening & Matching',
      desc: 'Replace hours of manual CV review with instant AI scoring. Every candidate is evaluated against your exact job criteria — skills, experience, location, and culture fit — and ranked so you always start with the best.',
      benefits: [
        'Reads and scores CVs in seconds, not hours',
        'Customisable matching criteria per role',
        'Eliminates bias with objective, criteria-based scoring',
        'Flags red flags and highlights top strengths automatically',
      ],
      visualLabel: 'Candidate Match Scores',
      visualItems: [
        { label: 'Skills Match', pct: 94 },
        { label: 'Experience Fit', pct: 88 },
        { label: 'Culture Indicators', pct: 76 },
        { label: 'Location / Availability', pct: 95 },
      ],
    },
    {
      tag: '✉️ Service 03',
      icon: '✉️',
      title: 'Automated Outreach & Follow-ups',
      desc: 'Send personalised messages to every candidate — at the right time, through the right channel. AI crafts messages tailored to each candidate\'s profile and automatically follows up until you get a response.',
      benefits: [
        'Personalised messages — not generic templates',
        'Multi-channel: email, LinkedIn, SMS',
        'Smart follow-up sequences with timing optimisation',
        'Tracks opens, replies, and engagement automatically',
      ],
      visualLabel: 'Outreach Performance',
      visualItems: [
        { label: 'Open Rate', pct: 78 },
        { label: 'Reply Rate', pct: 62 },
        { label: 'Meeting Booked', pct: 41 },
        { label: 'Placed', pct: 28 },
      ],
    },
    {
      tag: '⚙️ Service 04',
      icon: '⚙️',
      title: 'Recruitment Workflow Automation',
      desc: 'Connect every step of your recruitment process into one automated pipeline. From initial sourcing through to offer stage — no more switching between tools or updating spreadsheets manually.',
      benefits: [
        'Full pipeline visibility in a single dashboard',
        'Automatic ATS updates and status changes',
        'Team notifications and task assignments',
        'Reporting and analytics on every role and recruiter',
      ],
      visualLabel: 'Time Saved Per Week',
      visualItems: [
        { label: 'Admin Tasks', pct: 85 },
        { label: 'Status Updates', pct: 90 },
        { label: 'Report Generation', pct: 95 },
        { label: 'Pipeline Management', pct: 75 },
      ],
    },
  ];

  integrations = [
    'Bullhorn', 'Greenhouse', 'Lever', 'Workday', 'HubSpot',
    'LinkedIn Recruiter', 'Gmail', 'Outlook', 'Slack', 'Zapier',
    'Indeed', 'Reed', 'CV-Library', 'Totaljobs', 'Monday.com',
  ];
}
