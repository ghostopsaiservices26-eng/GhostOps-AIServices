import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FirebaseService, Workshop, Registration } from '../../services/firebase.service';

const ADMIN_PASSWORD = 'ghostops2025';

export interface WorkshopGroup {
  workshop: Workshop;
  registrations: Registration[];
  expanded: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  // Auth
  authenticated = false;
  passwordInput = '';
  authError = '';

  // Workshops
  workshops: Workshop[] = [];
  loadingWorkshops = false;

  // New workshop form
  newWorkshop = { label: '', date: '', spots_total: 10, active: true };
  addingWorkshop = false;
  addError = '';
  addSuccess = '';

  // Registrations grouped by workshop
  workshopGroups: WorkshopGroup[] = [];
  loadingRegs = false;

  // UI
  activeTab: 'workshops' | 'users' = 'workshops';

  constructor(private fb: FirebaseService, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  login() {
    if (this.passwordInput === ADMIN_PASSWORD) {
      this.authenticated = true;
      this.authError = '';
      this.loadWorkshops();
    } else {
      this.authError = 'Incorrect password.';
    }
  }

  async loadWorkshops() {
    this.loadingWorkshops = true;
    try {
      const workshops = await this.fb.getWorkshops();
      this.workshops = workshops;
    } catch (e) {
      console.error('Failed to load workshops', e);
    }
    this.loadingWorkshops = false;
    this.cdr.detectChanges();
  }

  async addWorkshop() {
    if (!this.newWorkshop.label || !this.newWorkshop.date) {
      this.addError = 'Please fill in all required fields.';
      return;
    }
    this.addingWorkshop = true;
    this.addError = '';
    this.addSuccess = '';
    try {
      await this.fb.addWorkshop({
        label: this.newWorkshop.label,
        date: this.newWorkshop.date,
        spots_total: this.newWorkshop.spots_total,
        spots_left: this.newWorkshop.spots_total,
        active: this.newWorkshop.active,
      });
      this.addSuccess = 'Workshop added successfully!';
      this.newWorkshop = { label: '', date: '', spots_total: 10, active: true };
      await this.loadWorkshops();
    } catch (e: any) {
      this.addError = e?.message || 'Failed to add workshop. Check Supabase config.';
    }
    this.addingWorkshop = false;
    this.cdr.detectChanges();
  }

  async toggleActive(w: Workshop) {
    await this.fb.updateWorkshop(w.id!, { active: !w.active });
    await this.loadWorkshops();
  }

  async deleteWorkshop(w: Workshop) {
    if (!confirm(`Delete "${w.label}"? This cannot be undone.`)) return;
    await this.fb.deleteWorkshop(w.id!);
    await this.loadWorkshops();
  }

  async loadUserGroups() {
    this.loadingRegs = true;
    try {
      const allRegs = await this.fb.getRegistrations();
      this.workshopGroups = this.workshops.map(w => ({
        workshop: w,
        registrations: allRegs.filter(r => r.workshop_id === w.id),
        expanded: false,
      }));
    } catch(e) {
      console.error('Failed to load registrations', e);
    }
    this.loadingRegs = false;
    this.cdr.detectChanges();
  }

  toggleGroup(group: WorkshopGroup) {
    group.expanded = !group.expanded;
  }

  totalRegistrations(): number {
    return this.workshopGroups.reduce((sum, g) => sum + g.registrations.length, 0);
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  async setTab(tab: 'workshops' | 'users') {
    this.activeTab = tab;
    if (tab === 'users') {
      if (this.workshops.length === 0) await this.loadWorkshops();
      await this.loadUserGroups();
    }
  }
}
