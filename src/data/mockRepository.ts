import { announcement, children, notificationLog, programs, scheduledOrders, serviceDates, supportThreads } from '../mockData';
import { AppRepository, ChildInput, DraftInput, SupportThreadInput } from './repository';

export class MockRepository implements AppRepository {
  async fetchBundle() {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return {
      announcement,
      children,
      scheduledOrders,
      supportThreads,
      notificationLog,
      notificationPreferences: {
        morningReminder: true,
        cutoffReminder: true
      },
      programs,
      serviceDates
    };
  }

  async createDraft(input: DraftInput) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const random = Math.floor(Math.random() * 9000) + 1000;
    return { draftId: `draft_${input.childId}_${random}` };
  }

  async createSupportThread(_input: SupportThreadInput) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const random = Math.floor(Math.random() * 9000) + 1000;
    const updatedAt = new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return { threadId: `thr_${random}`, updatedAt };
  }

  async createChild(_input: ChildInput) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const random = Math.floor(Math.random() * 9000) + 1000;
    return { childId: `child_${random}` };
  }

  async updateNotificationPreferences(input: { morningReminder: boolean; cutoffReminder: boolean }) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return input;
  }

  async markNotificationRead(_notificationId: string) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  async updateChildStatus(childId: string, active: boolean) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return { childId, active };
  }
}
