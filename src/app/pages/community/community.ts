import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService, Workshop } from '../../services/firebase.service';

@Component({
  selector: 'app-community',
  standalone: false,
  templateUrl: './community.html',
  styleUrl: './community.scss',
})
export class Community implements OnInit, OnDestroy {
  workshops: Workshop[] = [];
  activeWorkshops: Workshop[] = [];
  selectedWorkshop: Workshop | null = null;
  private unsubscribe?: () => void;

  form = { name: '', email: '', skills: '', experience: '' };
  submitting = false;
  submitted = false;
  error = '';

  constructor(private fb: FirebaseService) {}

  ngOnInit() {
    this.unsubscribe = this.fb.listenWorkshops(workshops => {
      this.workshops = workshops;
      this.activeWorkshops = workshops.filter(w => w.active);
      if (this.activeWorkshops.length === 1 && !this.selectedWorkshop) {
        this.selectedWorkshop = this.activeWorkshops[0];
      }
    });
  }

  ngOnDestroy() { this.unsubscribe?.(); }

  selectWorkshop(w: Workshop) {
    this.selectedWorkshop = w;
    this.submitted = false;
    this.error = '';
    this.form = { name: '', email: '', skills: '', experience: '' };
  }

  async onSubmit() {
    if (!this.selectedWorkshop?.id) return;
    this.submitting = true;
    this.error = '';
    const result = await this.fb.register({
      workshop_id: this.selectedWorkshop.id,
      workshop_label: this.selectedWorkshop.label,
      name: this.form.name,
      email: this.form.email,
      skills: this.form.skills,
      experience: this.form.experience,
    });
    this.submitting = false;
    if (result.success) { this.submitted = true; }
    else { this.error = result.message; }
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  getSlotColor(w: Workshop): string {
    const pct = w.spots_left / w.spots_total;
    if (pct > 0.5) return 'green';
    if (pct > 0.2) return 'amber';
    return 'red';
  }

  days = [
    { day: 'Day 1',  title: 'Problem Discovery',           icon: '🔍', color: 'blue',
      desc: 'Identify and lock in one real-world problem worth solving.',
      tasks: ['Brainstorm problem areas', 'Research existing gaps', 'Define the problem statement', 'Align on vision and success criteria'] },
    { day: 'Day 2',  title: 'Requirements & Solution Design', icon: '🗺️', color: 'purple',
      desc: 'Map out what needs to be built, who does what, and how the solution works.',
      tasks: ['Break down solution into components', 'Define technical requirements', 'Assign roles based on skills', 'Create a build plan'] },
    { day: 'Day 3',  title: 'Build Sprint — Foundation',   icon: '⚙️', color: 'cyan',
      desc: 'Build the core architecture and foundational layers.',
      tasks: ['Set up project structure', 'Build core backend/data layer', 'Start frontend scaffolding', 'Daily standup'] },
    { day: 'Day 4',  title: 'Build Sprint — Core Features', icon: '🔧', color: 'blue',
      desc: 'Develop the primary features that deliver the main value.',
      tasks: ['Implement core feature set', 'Connect frontend to backend', 'Integrate APIs or AI models', 'Code review'] },
    { day: 'Day 5',  title: 'Build Sprint — UI & UX',      icon: '🎨', color: 'purple',
      desc: 'Polish the user interface and ensure a smooth experience.',
      tasks: ['Design UI components', 'Improve user flows', 'Responsive design', 'Team feedback'] },
    { day: 'Day 6',  title: 'Build Sprint — Integration',  icon: '🔗', color: 'cyan',
      desc: 'Connect all parts and ensure the system works end-to-end.',
      tasks: ['Full system integration', 'Data flow and state management', 'Error handling', 'Internal demo'] },
    { day: 'Day 7',  title: 'Build Sprint — Refinement',   icon: '✨', color: 'blue',
      desc: 'Refine features and fix issues found during integration.',
      tasks: ['Bug fixes and performance', 'Feature polish', 'Documentation', 'Prepare for testing'] },
    { day: 'Day 8',  title: 'Build Sprint — Final Push',   icon: '🚀', color: 'purple',
      desc: 'Final development push — lock features and prepare for testing.',
      tasks: ['Feature freeze', 'Final integration', 'Staging deployment', 'Handoff to testing'] },
    { day: 'Day 9',  title: 'Testing & QA',                icon: '🧪', color: 'cyan',
      desc: 'Rigorous testing to ensure the solution works as intended.',
      tasks: ['Functional testing', 'User acceptance testing', 'Performance testing', 'Final bug fixes'] },
    { day: 'Day 10', title: 'Pitch & Present',             icon: '🎤', color: 'blue',
      desc: 'Package your solution into a compelling pitch and present live.',
      tasks: ['Structure your pitch deck', 'Build demo', 'Rehearse with team', 'Live pitch to judges'] },
  ];

  highlights = [
    { icon: '👥', title: '10 Members Only',    desc: 'Each cohort is strictly limited to 10 members for focused collaboration and personal attention.' },
    { icon: '🎯', title: '1 Problem Statement', desc: 'Every workshop focuses on solving one real, meaningful problem from start to finish.' },
    { icon: '🤝', title: 'Skill-Based Roles',   desc: 'Tasks assigned based on your skills — developers, designers, strategists all contribute.' },
    { icon: '🏆', title: 'Pitch to Win',        desc: 'Day 10 is a live pitch — present your build and compete for recognition.' },
  ];
}
