import { boolean, index, int, mysqlTable, timestamp, uniqueIndex, varchar, text } from 'drizzle-orm/mysql-core';

const id = (name: string) => varchar(name, { length: 64 });

export const users = mysqlTable('users', {
  id: id('id').primaryKey(),
  openId: varchar('open_id', { length: 191 }).notNull(),
  name: varchar('name', { length: 191 }).notNull(),
  email: varchar('email', { length: 191 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({ openIdIdx: uniqueIndex('users_open_id_idx').on(table.openId) }));

export const workspaces = mysqlTable('workspaces', {
  id: id('id').primaryKey(),
  name: varchar('name', { length: 191 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaceMembers = mysqlTable('workspace_members', {
  id: id('id').primaryKey(),
  workspaceId: id('workspace_id').notNull(),
  userId: id('user_id').notNull(),
  role: varchar('role', { length: 32 }).notNull().default('member'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({ memberIdx: uniqueIndex('workspace_members_unique_idx').on(table.workspaceId, table.userId) }));

export const connectedAccounts = mysqlTable('connected_accounts', {
  id: id('id').primaryKey(),
  workspaceId: id('workspace_id').notNull(),
  username: varchar('username', { length: 191 }).notNull(),
  displayName: varchar('display_name', { length: 191 }).notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  encryptedCredentialRef: varchar('encrypted_credential_ref', { length: 255 }),
  tokenExpiresAt: timestamp('token_expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({ workspaceIdx: index('connected_accounts_workspace_idx').on(table.workspaceId) }));

export const campaigns = mysqlTable('campaigns', {
  id: id('id').primaryKey(),
  workspaceId: id('workspace_id').notNull(),
  accountId: id('account_id').notNull(),
  externalId: varchar('external_id', { length: 191 }),
  name: varchar('name', { length: 191 }).notNull(),
  objective: varchar('objective', { length: 80 }).notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  budgetCents: int('budget_cents'),
  syncedAt: timestamp('synced_at'),
}, (table) => ({ accountIdx: index('campaigns_account_idx').on(table.accountId) }));

export const comments = mysqlTable('comments', {
  id: id('id').primaryKey(),
  workspaceId: id('workspace_id').notNull(),
  accountId: id('account_id').notNull(),
  externalId: varchar('external_id', { length: 191 }).notNull(),
  username: varchar('username', { length: 191 }).notNull(),
  body: text('body').notNull(),
  postExternalId: varchar('post_external_id', { length: 191 }),
  replyStatus: varchar('reply_status', { length: 32 }).notNull().default('needs_reply'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({ externalIdx: uniqueIndex('comments_external_idx').on(table.accountId, table.externalId), inboxIdx: index('comments_inbox_idx').on(table.workspaceId, table.replyStatus, table.createdAt) }));

export const aiReplyDrafts = mysqlTable('ai_reply_drafts', {
  id: id('id').primaryKey(),
  workspaceId: id('workspace_id').notNull(),
  commentId: id('comment_id').notNull(),
  tone: varchar('tone', { length: 80 }).notNull(),
  body: text('body').notNull(),
  confidence: int('confidence'),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const automationRules = mysqlTable('automation_rules', {
  id: id('id').primaryKey(),
  workspaceId: id('workspace_id').notNull(),
  accountId: id('account_id').notNull(),
  name: varchar('name', { length: 191 }).notNull(),
  mode: varchar('mode', { length: 32 }).notNull().default('approval'),
  active: boolean('active').notNull().default(true),
  configJson: text('config_json'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = mysqlTable('audit_logs', {
  id: id('id').primaryKey(),
  workspaceId: id('workspace_id').notNull(),
  actorUserId: id('actor_user_id'),
  action: varchar('action', { length: 100 }).notNull(),
  targetType: varchar('target_type', { length: 80 }).notNull(),
  targetId: id('target_id'),
  metadataJson: text('metadata_json'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const publicMedia = mysqlTable('public_media', {
  id: id('id').primaryKey(),
  workspaceId: id('workspace_id').notNull(),
  provider: varchar('provider', { length: 40 }).notNull().default('scrapecreators'),
  externalId: varchar('external_id', { length: 191 }).notNull(),
  sourceUrl: varchar('source_url', { length: 500 }).notNull(),
  handle: varchar('handle', { length: 191 }),
  mediaType: varchar('media_type', { length: 32 }),
  caption: text('caption'),
  collectedAt: timestamp('collected_at').defaultNow().notNull(),
  freshness: varchar('freshness', { length: 32 }).notNull().default('live'),
  rawJson: text('raw_json'),
}, (table) => ({ sourceIdx: uniqueIndex('public_media_source_idx').on(table.workspaceId, table.provider, table.externalId), handleIdx: index('public_media_handle_idx').on(table.workspaceId, table.handle) }));

export const publicComments = mysqlTable('public_comments', {
  id: id('id').primaryKey(),
  workspaceId: id('workspace_id').notNull(),
  mediaId: id('media_id').notNull(),
  provider: varchar('provider', { length: 40 }).notNull().default('scrapecreators'),
  externalId: varchar('external_id', { length: 191 }).notNull(),
  username: varchar('username', { length: 191 }),
  body: text('body').notNull(),
  category: varchar('category', { length: 32 }),
  collectedAt: timestamp('collected_at').defaultNow().notNull(),
  rawJson: text('raw_json'),
}, (table) => ({ commentIdx: uniqueIndex('public_comments_external_idx').on(table.workspaceId, table.provider, table.externalId), mediaIdx: index('public_comments_media_idx').on(table.mediaId, table.collectedAt) }));

export const agentRuns = mysqlTable('agent_runs', {
  id: id('id').primaryKey(),
  workspaceId: id('workspace_id').notNull(),
  provider: varchar('provider', { length: 80 }).notNull(),
  task: varchar('task', { length: 255 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('completed'),
  approvalRequired: boolean('approval_required').notNull().default(true),
  inputJson: text('input_json'),
  outputJson: text('output_json'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({ runIdx: index('agent_runs_workspace_idx').on(table.workspaceId, table.createdAt) }));
