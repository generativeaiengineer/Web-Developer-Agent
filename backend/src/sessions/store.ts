// ─── Session Types ─────────────────────────────────────────────────────────────

export type Phase =
  | 'idle'
  | 'parsing'
  | 'researching'
  | 'awaiting_blueprint_approval'
  | 'awaiting_blueprint_notes'
  | 'architecturing'
  | 'awaiting_architecture_approval'
  | 'awaiting_architecture_notes'
  | 'building'
  | 'complete'
  | 'error';

export interface Session {
  chatId: number;
  clientName: string;
  phase: Phase;
  brandingUrls: string[];
  seoUrls: string[];
  originalRequest: string;       // The raw user message that started the job
  blueprintPath?: string;        // e.g. blueprints/zonneweb-blueprint.md
  blueprintContent?: string;     // Full blueprint text (for passing to ARCHITECT)
  architecturePath?: string;     // e.g. blueprints/architectures/zonneweb-architecture.md
  architectureContent?: string;  // Full architecture text (for passing to BUILDER)
  buildDir?: string;             // e.g. builds/zonneweb/
  buildReportPath?: string;
  approvalMessageId?: number;    // Telegram message ID of the pending approval message
  errorMessage?: string;
  startedAt: Date;
  updatedAt: Date;
}

// ─── Store ─────────────────────────────────────────────────────────────────────

const store = new Map<number, Session>();

export function getSession(chatId: number): Session | undefined {
  return store.get(chatId);
}

export function setSession(chatId: number, session: Session): void {
  store.set(chatId, { ...session, updatedAt: new Date() });
}

export function updateSession(chatId: number, updates: Partial<Session>): void {
  const existing = store.get(chatId);
  if (!existing) return;
  store.set(chatId, { ...existing, ...updates, updatedAt: new Date() });
}

export function deleteSession(chatId: number): void {
  store.delete(chatId);
}

export function createSession(chatId: number, data: Omit<Session, 'startedAt' | 'updatedAt'>): Session {
  const session: Session = {
    ...data,
    startedAt: new Date(),
    updatedAt: new Date(),
  };
  store.set(chatId, session);
  return session;
}

export function hasActiveSession(chatId: number): boolean {
  const session = store.get(chatId);
  if (!session) return false;
  return !['idle', 'complete', 'error'].includes(session.phase);
}
