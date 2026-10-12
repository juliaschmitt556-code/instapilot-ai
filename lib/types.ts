export type DataMode = 'sample' | 'live';

export type ConnectedAccount = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: 'Connected' | 'Needs attention' | 'Disconnected';
  followers: string;
  posts: string;
  permissions: string[];
  lastSynced: string;
  mode: DataMode;
};

export type Campaign = {
  id: string;
  name: string;
  objective: string;
  status: 'Active' | 'Paused' | 'Draft' | 'In review';
  spend: string;
  spendValue: number;
  budget: string;
  reach: string;
  clicks: string;
  ctr: string;
  change: string;
  color: string;
};

export type CommentItem = {
  id: string;
  username: string;
  initials: string;
  timestamp: string;
  text: string;
  post: string;
  postType: 'Reel' | 'Photo' | 'Ad';
  sentiment: 'Positive' | 'Question' | 'Concern' | 'Spam';
  priority: 'High' | 'Normal' | 'Low';
  replyStatus: 'Needs reply' | 'AI draft ready' | 'Replied' | 'Flagged';
  color: string;
};

export type ReplyDraft = {
  id: string;
  tone: string;
  text: string;
  confidence: number;
  rationale: string;
};

export type Metric = {
  label: string;
  value: string;
  delta: string;
  direction: 'up' | 'down' | 'flat';
  description: string;
  accent: 'lime' | 'indigo' | 'coral' | 'ink';
  source: 'Advertising' | 'Organic' | 'Sample';
};
