import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { from, Subscription } from 'rxjs';
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
export class Admin implements OnInit, OnDestroy {
  authenticated = false;
  passwordInput = '';
  authError = '';

  workshops: Workshop[] = [];
  loadingWorkshops = false;

  newWorkshop = { label: '', date: '', active: true };
  addingWorkshop = false;
  addError = '';
  addSuccess = '';

  workshopGroups: WorkshopGroup[] = [];
  loadingRegs = false;

  activeTab: 'workshops' | 'users' = 'workshops';

  private subs = new Subscription();

  constructor(private fb: FirebaseService, private zone: NgZone, private titleSvc: Title) {
    this.titleSvc.setTitle('Admin — GhostOps');
  }

  ngOnInit() {}
  ngOnDestroy() { this.subs.unsubscribe(); }

  login() {
    if (this.passwordInput === ADMIN_PASSWORD) {
      this.authenticated = true;
      this.authError = '';
      this.loadWorkshops();
    } else {
      this.authError = 'Incorrect password.';
    }
  }

  loadWorkshops() {
    this.loadingWorkshops = true;
    const sub = from(this.fb.getWorkshops()).subscribe({
      next: (workshops) => {
        this.zone.run(() => {
          this.workshops = workshops;
          this.loadingWorkshops = false;
        });
      },
      error: (e) => {
        this.zone.run(() => {
          console.error('Failed to load workshops', e);
          this.loadingWorkshops = false;
        });
      },
    });
    this.subs.add(sub);
  }

  addWorkshop() {
    if (!this.newWorkshop.label || !this.newWorkshop.date) {
      this.addError = 'Please fill in all required fields.';
      return;
    }
    this.addingWorkshop = true;
    this.addError = '';
    this.addSuccess = '';

    const sub = from(this.fb.addWorkshop({
      label: this.newWorkshop.label,
      date: this.newWorkshop.date,
      spots_total: 0,
      spots_left: 0,
      active: this.newWorkshop.active,
    })).subscribe({
      next: () => {
        this.zone.run(() => {
          this.addSuccess = 'Workshop added successfully!';
          this.newWorkshop = { label: '', date: '', active: true };
          this.addingWorkshop = false;
          this.loadWorkshops();
        });
      },
      error: (e: any) => {
        this.zone.run(() => {
          this.addError = e?.message || 'Failed to add workshop.';
          this.addingWorkshop = false;
        });
      },
    });
    this.subs.add(sub);
  }

  toggleActive(w: Workshop) {
    const sub = from(this.fb.updateWorkshop(w.id!, { active: !w.active })).subscribe({
      next: () => this.zone.run(() => this.loadWorkshops()),
      error: (e) => console.error('Toggle failed', e),
    });
    this.subs.add(sub);
  }

  deleteWorkshop(w: Workshop) {
    if (!confirm(`Delete "${w.label}"? This cannot be undone.`)) return;
    const sub = from(this.fb.deleteWorkshop(w.id!)).subscribe({
      next: () => this.zone.run(() => this.loadWorkshops()),
      error: (e) => console.error('Delete failed', e),
    });
    this.subs.add(sub);
  }

  loadUserGroups() {
    this.loadingRegs = true;
    const sub = from(this.fb.getRegistrations()).subscribe({
      next: (allRegs) => {
        this.zone.run(() => {
          this.workshopGroups = this.workshops.map(w => ({
            workshop: w,
            registrations: allRegs.filter(r => r.workshop_id === w.id),
            expanded: false,
          }));
          this.loadingRegs = false;
        });
      },
      error: (e) => {
        this.zone.run(() => {
          console.error('Failed to load registrations', e);
          this.loadingRegs = false;
        });
      },
    });
    this.subs.add(sub);
  }

  toggleGroup(group: WorkshopGroup) { group.expanded = !group.expanded; }

  // Response modal — uses native <dialog> top-layer
  @ViewChild('responseDialog') responseDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('rmBody') rmBody!: ElementRef<HTMLDivElement>;
  @ViewChild('editDialog') editDialog!: ElementRef<HTMLDialogElement>;
  modalResponse: string | null = null;
  private scrollY = 0;

  // Edit workshop modal state
  editForm: { id: string; label: string; date: string; active: boolean } | null = null;
  editError = '';
  savingEdit = false;

  openResponse(text: string) {
    this.modalResponse = text;
    this.lockBodyScroll();
    setTimeout(() => {
      const dlg = this.responseDialog?.nativeElement;
      if (dlg && !dlg.open) dlg.showModal();
    });
  }

  closeResponse() {
    const dlg = this.responseDialog?.nativeElement;
    if (dlg?.open) dlg.close();
    this.modalResponse = null;
    this.unlockBodyScroll();
  }

  // ── Edit workshop ───────────────────────────────────────────────
  openEdit(w: Workshop) {
    this.editForm = {
      id: w.id!,
      label: w.label,
      date: w.date,
      active: w.active,
    };
    this.editError = '';
    this.lockBodyScroll();
    setTimeout(() => {
      const dlg = this.editDialog?.nativeElement;
      if (dlg && !dlg.open) dlg.showModal();
    });
  }

  closeEdit() {
    const dlg = this.editDialog?.nativeElement;
    if (dlg?.open) dlg.close();
    this.editForm = null;
    this.editError = '';
    this.unlockBodyScroll();
  }

  saveEdit() {
    if (!this.editForm) return;
    if (!this.editForm.label || !this.editForm.date) {
      this.editError = 'Label and date are required.';
      return;
    }
    this.savingEdit = true;
    this.editError = '';
    const { id, label, date, active } = this.editForm;
    const sub = from(this.fb.updateWorkshop(id, { label, date, active })).subscribe({
      next: () => this.zone.run(() => {
        this.savingEdit = false;
        this.closeEdit();
        this.loadWorkshops();
      }),
      error: (e: any) => this.zone.run(() => {
        this.savingEdit = false;
        this.editError = e?.message || 'Failed to save changes.';
      }),
    });
    this.subs.add(sub);
  }

  onEditDialogClick(e: MouseEvent) {
    if (e.target === this.editDialog?.nativeElement) this.closeEdit();
  }

  onEditDialogClose() {
    if (this.editForm !== null) this.closeEdit();
  }

  // ── Body scroll lock helpers (shared by both modals) ────────────
  private lockBodyScroll() {
    this.scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  private unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, this.scrollY);
  }

  onBodyWheel(e: WheelEvent) {
    // Manually scroll the modal body — overrides any browser quirk
    // that prevents wheel events from reaching it
    const el = this.rmBody?.nativeElement;
    if (!el) return;
    el.scrollTop += e.deltaY;
    e.preventDefault();
    e.stopPropagation();
  }

  onDialogClick(e: MouseEvent) {
    // Click on backdrop (the <dialog> itself) closes it
    if (e.target === this.responseDialog?.nativeElement) this.closeResponse();
  }

  onDialogClose() {
    // Triggered by Escape key — clean up if dialog closed itself
    if (this.modalResponse !== null) this.closeResponse();
  }

  totalRegistrations(): number {
    return this.workshopGroups.reduce((sum, g) => sum + g.registrations.length, 0);
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  setTab(tab: 'workshops' | 'users') {
    this.activeTab = tab;
    if (tab === 'users') {
      if (this.workshops.length === 0) {
        const sub = from(this.fb.getWorkshops()).subscribe({
          next: (workshops) => {
            this.zone.run(() => {
              this.workshops = workshops;
              this.loadUserGroups();
            });
          },
          error: (e) => console.error(e),
        });
        this.subs.add(sub);
      } else {
        this.loadUserGroups();
      }
    }
  }
}
