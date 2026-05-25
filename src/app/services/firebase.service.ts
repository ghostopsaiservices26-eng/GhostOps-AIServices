import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

// ─── PASTE YOUR SUPABASE CONFIG HERE ────────────────────────────────────────
const SUPABASE_URL  = 'https://rcrcizecvqvhxtglkqfd.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjcmNpemVjdnF2aHh0Z2xrcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Mjc1NTUsImV4cCI6MjA5NTMwMzU1NX0.xONjEHWPoPhK3B8R5ds2JWIBeq_Fpl7MhrDXJ5DIQoc';
// ────────────────────────────────────────────────────────────────────────────

export interface Workshop {
  id?: string;
  label: string;
  date: string;
  spots_total: number;
  spots_left: number;
  active: boolean;
  created_at?: string;
}

export interface Registration {
  id?: string;
  workshop_id: string;
  workshop_label: string;
  name: string;
  email: string;
  skills: string;
  experience: string;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private sb: SupabaseClient;

  constructor() {
    this.sb = createClient(SUPABASE_URL, SUPABASE_ANON);
  }

  // ── WORKSHOPS ──────────────────────────────────────────────────────────────

  async addWorkshop(w: Omit<Workshop, 'id' | 'created_at'>): Promise<string> {
    const { data, error } = await this.sb
      .from('workshops')
      .insert(w)
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }

  async getWorkshops(): Promise<Workshop[]> {
    const { data, error } = await this.sb
      .from('workshops')
      .select('*')
      .order('date', { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  listenWorkshops(callback: (workshops: Workshop[]) => void): () => void {
    // Initial fetch
    this.getWorkshops().then(callback);

    // Realtime subscription
    const channel: RealtimeChannel = this.sb
      .channel('workshops-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workshops' }, () => {
        this.getWorkshops().then(callback);
      })
      .subscribe();

    return () => { this.sb.removeChannel(channel); };
  }

  async updateWorkshop(id: string, data: Partial<Workshop>): Promise<void> {
    const { error } = await this.sb.from('workshops').update(data).eq('id', id);
    if (error) throw error;
  }

  async deleteWorkshop(id: string): Promise<void> {
    const { error } = await this.sb.from('workshops').delete().eq('id', id);
    if (error) throw error;
  }

  // ── REGISTRATIONS ──────────────────────────────────────────────────────────

  async register(reg: Omit<Registration, 'id' | 'created_at'>): Promise<{ success: boolean; message: string }> {
    // Check for duplicate email in this workshop
    const { data: existing } = await this.sb
      .from('registrations')
      .select('id')
      .eq('workshop_id', reg.workshop_id)
      .eq('email', reg.email)
      .maybeSingle();

    if (existing) {
      return { success: false, message: 'You have already registered for this workshop.' };
    }

    // Check spots left
    const { data: workshop } = await this.sb
      .from('workshops')
      .select('spots_left')
      .eq('id', reg.workshop_id)
      .single();

    if (!workshop || workshop.spots_left <= 0) {
      return { success: false, message: 'Sorry, this workshop is now full.' };
    }

    // Insert registration
    const { error: regError } = await this.sb.from('registrations').insert(reg);
    if (regError) return { success: false, message: 'Registration failed. Please try again.' };

    // Decrement spots_left
    const { error: updateError } = await this.sb
      .from('workshops')
      .update({ spots_left: workshop.spots_left - 1 })
      .eq('id', reg.workshop_id);

    if (updateError) return { success: false, message: 'Registered but slot count failed to update.' };

    return { success: true, message: 'Registered successfully!' };
  }

  async getRegistrations(workshopId?: string): Promise<Registration[]> {
    let query = this.sb
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (workshopId) query = query.eq('workshop_id', workshopId);
    const { data, error } = await query;
    if (error) { console.error('getRegistrations error:', error); throw error; }
    console.log('registrations fetched:', data);
    return data ?? [];
  }
}
