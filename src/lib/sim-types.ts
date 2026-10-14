// Types shared by deck data (build time) and the Discord simulator (browser).

export type Device = 'mobile' | 'desktop';
export type Mode = 'watch' | 'try';

export interface SimUser {
  id: string;
  name: string;
  color: string;
  role?: string;
  roleColor?: string;
  online?: boolean;
}

export interface SimReaction {
  emoji: string;
  count: number;
  mine?: boolean;
}

export interface SimMessage {
  id: string;
  author: string;
  /** Mini-markup: **bold**, <@userId>, <#channelId>, [ts:label] */
  text: string;
  time?: string;
  attachment?: 'result';
  reactions?: SimReaction[];
}

export interface SimPost {
  id: string;
  title: string;
  tags: string[];
  author: string;
  text: string;
  time: string;
  /** red @ badge in the sidebar / forum list */
  mention?: boolean;
  /** false → "me" has not joined it yet, so it is not listed in the sidebar */
  joined?: boolean;
  replies: SimMessage[];
}

export type ChannelKind = 'text' | 'announce' | 'rules' | 'forum' | 'stage';

export interface SimChannel {
  id: string;
  name: string;
  emoji?: string;
  kind: ChannelKind;
  locked?: boolean;
  unread?: boolean;
  topic?: string;
}

export interface SimCategory {
  name: string;
  emoji?: string;
  channels: SimChannel[];
}

export interface SimServer {
  name: string;
  me: string;
  forum: string;
  categories: SimCategory[];
  users: Record<string, SimUser>;
  tags: Record<string, { emoji: string; tone: 'neutral' | 'blue' | 'yellow' | 'green' | 'red' | 'grey' }>;
  /** default messages per text channel */
  channels: Record<string, SimMessage[]>;
  /** other match posts visible in the forum list (not joined by "me") */
  forumPosts: SimPost[];
  stats: { online: number; members: number };
}

export type SimView = 'home' | 'thread' | 'forum' | 'channel' | 'invite' | 'nickname';

export interface SimSetup {
  view: SimView;
  /** id of the open (or featured) post */
  post: string;
  /** posts "me" has joined — listed in the sidebar */
  posts: SimPost[];
  /** open text channel for the `channel` view */
  channel?: string;
  /** message overrides per channel */
  channels?: Record<string, SimMessage[]>;
  composer?: string;
  attachment?: 'result' | null;
  /** display name of "me" before setting a server nickname */
  meName?: string;
  /** false → not a member yet (invite flow) */
  joined?: boolean;
  following?: boolean;
}

type DeviceOnly = { only?: Device };

export type SimStep =
  | ({ wait: number } & DeviceOnly)
  | ({ say: string } & DeviceOnly)
  | ({ tap: string; try?: boolean; hint?: string } & DeviceOnly)
  | ({ point: string } & DeviceOnly)
  | ({ highlight: string; ms?: number } & DeviceOnly)
  | ({ view: SimView; channel?: string } & DeviceOnly)
  | ({ picker: 'menu' | 'gallery' | 'none' } & DeviceOnly)
  | ({ menu: 'server' | 'none' } & DeviceOnly)
  | ({ attach: 'result' } & DeviceOnly)
  | ({ type: string; into?: 'composer' | 'search' | 'nick' } & DeviceOnly)
  | ({ send: true; try?: boolean; hint?: string; as?: string; id?: string } & DeviceOnly)
  | ({ typing: string; ms?: number } & DeviceOnly)
  | ({ msg: SimMessage } & DeviceOnly)
  | ({ react: { msg: string; emoji: string; by: string } } & DeviceOnly)
  | ({ tags: { post: string; tags: string[] } } & DeviceOnly)
  | ({ filter: string | null } & DeviceOnly)
  | ({ follow: true } & DeviceOnly)
  | ({ online: string } & DeviceOnly)
  | ({ notify: { title: string; body: string } } & DeviceOnly);

export interface SimScene {
  setup: SimSetup;
  steps: SimStep[];
}
