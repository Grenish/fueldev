/* ---------- Socials ---------- */

export type Social = {
  id: number;
  iconName: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type SavedSocial = {
  iconName: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  customName?: string;
  isNsfw?: boolean;
};

/* ---------- Blocks ---------- */

export type BlockBase = {
  id: string;
  type:
    | "heading"
    | "paragraph"
    | "link"
    | "button"
    | "image"
    | "embed"
    | "spotify"
    | "divider"
    | "list"
    | "spacer"
    | "projects";
};

export type HeadingBlock = BlockBase & {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
  align?: "left" | "center" | "right";
};

export type ParagraphBlock = BlockBase & {
  type: "paragraph";
  text: string;
  align?: "left" | "center" | "right";
};

export type LinkBlock = BlockBase & {
  type: "link";
  title: string;
  url: string;
  description?: string;
  isNsfw?: boolean;
};

export type ButtonBlock = BlockBase & {
  type: "button";
  label: string;
  url: string;
};

export type ImageBlock = BlockBase & {
  type: "image";
  src: string;
  alt?: string;
  caption?: string;
  linkUrl?: string;
};

export type EmbedBlock = BlockBase & {
  type: "embed";
  url: string;
  title?: string;
};

export type SpotifyBlock = BlockBase & {
  type: "spotify";
  title: string;
  artist?: string;
  url: string;
  coverUrl?: string;
  useEmbed?: boolean;
};

export type ListBlock = BlockBase & {
  type: "list";
  ordered?: boolean;
  items: string[];
};

export type SpacerBlock = BlockBase & {
  type: "spacer";
  height: number;
};

export type ProjectItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  demoUrl?: string;
  repoUrl?: string;
};

export type ProjectsBlock = BlockBase & {
  type: "projects";
  title: string;
  items: ProjectItem[];
};

export type AnyBlock =
  | HeadingBlock
  | ParagraphBlock
  | LinkBlock
  | ButtonBlock
  | ImageBlock
  | EmbedBlock
  | SpotifyBlock
  | ListBlock
  | SpacerBlock
  | ProjectsBlock;
