import type { Campaign, CommentItem, ConnectedAccount, Metric, ReplyDraft } from './types';

export const sampleAccount: ConnectedAccount = {
  id: 'ig_demo_01',
  username: 'northstar.studio',
  displayName: 'Northstar Studio',
  avatar: 'NS',
  status: 'Connected',
  followers: '28.4K',
  posts: '186',
  permissions: ['Comments', 'Insights', 'Ads'],
  lastSynced: '2 min ago',
  mode: 'sample',
};

export const metrics: Metric[] = [
  { label: 'Ad spend', value: '$4,286', delta: '+12.8%', direction: 'up', description: 'vs. previous 30 days', accent: 'indigo', source: 'Advertising' },
  { label: 'Reach', value: '184.2K', delta: '+18.4%', direction: 'up', description: 'across active campaigns', accent: 'lime', source: 'Advertising' },
  { label: 'Comments received', value: '1,284', delta: '+23.1%', direction: 'up', description: 'organic + promoted posts', accent: 'coral', source: 'Organic' },
  { label: 'Avg. response time', value: '12m', delta: '-38%', direction: 'up', description: 'with approval mode on', accent: 'ink', source: 'Sample' },
];

export const campaigns: Campaign[] = [
  { id: 'cmp_01', name: 'Holiday studio drop', objective: 'Sales', status: 'Active', spend: '$1,842', spendValue: 1842, budget: '$3,000', reach: '86.4K', clicks: '2,940', ctr: '3.40%', change: '+21%', color: 'lime' },
  { id: 'cmp_02', name: 'Behind the scenes', objective: 'Engagement', status: 'Active', spend: '$1,108', spendValue: 1108, budget: '$1,500', reach: '51.2K', clicks: '1,824', ctr: '3.56%', change: '+11%', color: 'indigo' },
  { id: 'cmp_03', name: 'Evergreen retargeting', objective: 'Traffic', status: 'Paused', spend: '$864', spendValue: 864, budget: '$1,200', reach: '33.1K', clicks: '1,102', ctr: '3.33%', change: '-4%', color: 'coral' },
];

export const comments: CommentItem[] = [
  { id: 'cmt_01', username: 'maya.chen', initials: 'MC', timestamp: '8 min ago', text: 'This color is everything. Is the linen set available in a longer length?', post: 'Holiday studio drop', postType: 'Ad', sentiment: 'Question', priority: 'High', replyStatus: 'AI draft ready', color: '#D7F36B' },
  { id: 'cmt_02', username: 'thegoodtrade', initials: 'GT', timestamp: '22 min ago', text: 'Love seeing the process behind this. The hand-finished detail is beautiful.', post: 'Behind the scenes', postType: 'Reel', sentiment: 'Positive', priority: 'Normal', replyStatus: 'Needs reply', color: '#9B8AFB' },
  { id: 'cmt_03', username: 'samir.ahmed', initials: 'SA', timestamp: '41 min ago', text: 'I placed an order last week and have not seen a shipping update yet.', post: 'Holiday studio drop', postType: 'Photo', sentiment: 'Concern', priority: 'High', replyStatus: 'Needs reply', color: '#FF7B6B' },
  { id: 'cmt_04', username: 'studio.made', initials: 'SM', timestamp: '1 hr ago', text: 'Would this work as a gift for someone who usually wears neutrals?', post: 'Evergreen retargeting', postType: 'Ad', sentiment: 'Question', priority: 'Normal', replyStatus: 'Replied', color: '#AED9FF' },
  { id: 'cmt_05', username: 'dailydeals_247', initials: 'DD', timestamp: '2 hrs ago', text: 'DM us to get 90% off today!!!', post: 'Holiday studio drop', postType: 'Photo', sentiment: 'Spam', priority: 'Low', replyStatus: 'Flagged', color: '#C7C7C7' },
];

export const replyDrafts: ReplyDraft[] = [
  { id: 'draft_01', tone: 'Friendly', text: 'We love that you noticed the color. Yes — the linen set is available in a longer length. I can point you to the exact size guide if helpful.', confidence: 94, rationale: 'Answers the product question directly and offers a useful next step without inventing stock details.' },
  { id: 'draft_02', tone: 'Concise', text: 'Thank you — the hand-finished details are our favorite part too. More of the process is coming soon.', confidence: 91, rationale: 'Matches the positive sentiment and keeps the reply light for a public thread.' },
  { id: 'draft_03', tone: 'Empathetic', text: 'I’m sorry you’re still waiting on an update. Please send us your order number by DM so our team can look into it securely.', confidence: 96, rationale: 'Moves a private order question out of the public thread and avoids promising an outcome.' },
];

export const chartData = [
  { day: 'Sep 14', spend: 210, reach: 8900, comments: 34 },
  { day: 'Sep 18', spend: 280, reach: 12400, comments: 42 },
  { day: 'Sep 22', spend: 250, reach: 11500, comments: 48 },
  { day: 'Sep 26', spend: 340, reach: 16100, comments: 65 },
  { day: 'Sep 30', spend: 310, reach: 14800, comments: 54 },
  { day: 'Oct 04', spend: 390, reach: 19300, comments: 81 },
  { day: 'Oct 08', spend: 440, reach: 21800, comments: 97 },
  { day: 'Oct 12', spend: 480, reach: 24500, comments: 112 },
];
