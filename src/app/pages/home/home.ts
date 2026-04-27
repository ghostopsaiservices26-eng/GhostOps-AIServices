import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  steps = [
    { icon: '📥', title: 'Share Your Brief', desc: 'Tell us the role, skills, and ideal candidate profile. Takes less than 5 minutes.' },
    { icon: '🤖', title: 'AI Sources & Screens', desc: 'Our AI searches thousands of profiles and scores each one against your criteria automatically.' },
    { icon: '✉️', title: 'Automated Outreach', desc: 'Personalised messages go out to top candidates on your behalf — with smart follow-up sequences.' },
    { icon: '🏆', title: 'You Get a Shortlist', desc: 'Receive a ranked shortlist of qualified, engaged candidates ready for your review.' },
  ];
}
