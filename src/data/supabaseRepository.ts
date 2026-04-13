import { AppDataBundle, AppRepository, DraftInput, SupportThreadInput } from './repository';
import { NotificationPreferences } from '../models';

/**
 * Placeholder repository for future Supabase integration.
 *
 * Wire this to Supabase client + tables when backend is ready.
 */
export class SupabaseRepository implements AppRepository {
  async fetchBundle(): Promise<AppDataBundle> {
    throw new Error('SupabaseRepository.fetchBundle not implemented yet.');
  }

  async createDraft(_input: DraftInput): Promise<{ draftId: string }> {
    throw new Error('SupabaseRepository.createDraft not implemented yet.');
  }

  async createSupportThread(_input: SupportThreadInput): Promise<{ threadId: string; updatedAt: string }> {
    throw new Error('SupabaseRepository.createSupportThread not implemented yet.');
  }

  async updateNotificationPreferences(_input: NotificationPreferences): Promise<NotificationPreferences> {
    throw new Error('SupabaseRepository.updateNotificationPreferences not implemented yet.');
  }

  async markNotificationRead(_notificationId: string): Promise<void> {
    throw new Error('SupabaseRepository.markNotificationRead not implemented yet.');
  }

  async updateChildStatus(_childId: string, _active: boolean): Promise<{ childId: string; active: boolean }> {
    throw new Error('SupabaseRepository.updateChildStatus not implemented yet.');
  }
}
