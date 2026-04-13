import { AppDataBundle, AppRepository, DraftInput } from './repository';

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
}
