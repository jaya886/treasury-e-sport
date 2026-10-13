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
  /** red @ badge in the sidebar */
  mention?: boolean;
  replies: SimMessage[];
}

export type ChannelKind = 'text' | 'announce' | 'rules' | 'forum';

export interface SimChannel {
  id: string;
  name: string;
  emoji?: string;
  kind: ChannelKind;
  locked?: boolean;
  unread?: boolean;
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
  announcement: SimMessage;
}

export interface SimSetup {
  view: 'home' | 'thread';
  /** id of the open (or featured) post */
  post: string;
  posts: SimPost[];
  composer?: string;
  attachment?: 'result' | null;
}

type DeviceOnly = { only?: Device };

export type SimStep =
  | ({ wait: number } & DeviceOnly)
  | ({ say: string } & DeviceOnly)
  | ({ tap: string; try?: boolean; hint?: string } & DeviceOnly)
  | ({ point: string } & DeviceOnly)
  | ({ highlight: string; ms?: number } & DeviceOnly)
  | ({ view: 'home' | 'thread' } & DeviceOnly)
  | ({ picker: 'menu' | 'gallery' | 'none' } & DeviceOnly)
  | ({ attach: 'result' } & DeviceOnly)
  | ({ type: string } & DeviceOnly)
  | ({ send: true; try?: boolean; hint?: string } & DeviceOnly)
  | ({ typing: string; ms?: number } & DeviceOnly)
  | ({ msg: SimMessage } & DeviceOnly)
  | ({ react: { msg: string; emoji: string; by: string } } & DeviceOnly)
  | ({ tags: { post: string; tags: string[] } } & DeviceOnly)
  | ({ online: string } & DeviceOnly)
  | ({ notify: { title: string; body: string } } & DeviceOnly);

export interface SimScene {
  setup: SimSetup;
  steps: SimStep[];
}
