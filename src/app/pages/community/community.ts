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

  form = { name: '', email: '', skills: '', experience: '', claudeResponse: '' };
  formStep: 1 | 2 = 1;
  submitting = false;
  submitted = false;
  error = '';
  promptCopied = false;

  readonly claudePrompt = `I am applying to Ghost Ops — a 10-day live AI build lab. Look through our full conversation history together and generate the following output based only on what you can actually see. No assumptions. No flattery. If you have no history with me, say so and stop.

1. SCORES (out of 10)
Rate each category based strictly on evidence from our past conversations. If there is no evidence for a category, score it 0 and write NO EVIDENCE.

Claude Usage:          X/10  (how actively and deeply have I used you as a tool?)
Quality of Thinking:   X/10  (do my prompts reflect structured, original thinking?)
Ideas & Creativity:    X/10  (are the things I built genuinely novel or just copies?)
Iteration & Debugging: X/10  (do I show a pattern of trying, failing, and fixing?)
Prompting Skill:       X/10  (are my prompts well-structured, specific, goal-oriented?)
Overall:               X/10

2. KEY WORK SUMMARY
List the 3–5 most significant things I have worked on with you. Focus on real building, not just learning or discussing. One line each. If nothing qualifies, write: NO SHIPPED WORK IN HISTORY.

3. CLAUDE SUBSCRIPTION START
State the earliest date or time period visible in our conversation history. If you cannot determine this, write: NOT VISIBLE IN HISTORY.

Do not add encouragement, closing remarks, or commentary outside these three sections. Stop after section 3.`;

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
    this.formStep = 1;
    this.form = { name: '', email: '', skills: '', experience: '', claudeResponse: '' };
  }

  goToStep2() {
    if (!this.form.name.trim() || !this.form.email.trim() || !this.form.skills.trim()) return;
    this.formStep = 2;
    setTimeout(() => document.getElementById('claude-step')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  goToStep1() { this.formStep = 1; }

  async copyPrompt() {
    try {
      await navigator.clipboard.writeText(this.claudePrompt);
      this.promptCopied = true;
      setTimeout(() => { this.promptCopied = false; }, 2500);
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  }

  async onSubmit() {
    if (!this.selectedWorkshop?.id) return;
    if (!this.form.claudeResponse.trim()) {
      this.error = 'Please paste your Claude response before submitting.';
      return;
    }
    this.submitting = true;
    this.error = '';
    const result = await this.fb.register({
      workshop_id: this.selectedWorkshop.id,
      workshop_label: this.selectedWorkshop.label,
      name: this.form.name,
      email: this.form.email,
      skills: this.form.skills,
      experience: this.form.experience,
      claude_response: this.form.claudeResponse.trim(),
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
    { icon: '👥', title: 'Open to All',         desc: 'Anyone passionate about building with AI can apply — no experience cap, no seat limit.' },
    { icon: '🎯', title: '1 Problem Statement', desc: 'Every workshop focuses on solving one real, meaningful problem from start to finish.' },
    { icon: '🤝', title: 'Skill-Based Roles',   desc: 'Tasks assigned based on your skills — developers, designers, strategists all contribute.' },
    { icon: '🏆', title: 'Pitch to Win',        desc: 'Day 10 is a live pitch — present your build and compete for recognition.' },
  ];
}
