import {
  Behance,
  Bluesky,
  CustomLink,
  Deviantart,
  Discord,
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mastodon,
  Medium,
  Onlyfans,
  Patreon,
  Pinterest,
  Reddit,
  Rss,
  Threads,
  Twitch,
  X,
  Youtube,
  Hashnode,
  Blogger,
  Codepen,
  Stackoverflow,
} from "@/public/icons";
import { Social } from "./types";

export const socialsMap: Social[] = [
  { id: 0, iconName: "RSS", icon: Rss },
  { id: 1, iconName: "Patreon", icon: Patreon },
  { id: 2, iconName: "Twitch", icon: Twitch },
  { id: 3, iconName: "Threads", icon: Threads },
  { id: 4, iconName: "Reddit", icon: Reddit },
  { id: 5, iconName: "Pinterest", icon: Pinterest },
  { id: 6, iconName: "OnlyFans", icon: Onlyfans },
  { id: 7, iconName: "Medium", icon: Medium },
  { id: 8, iconName: "Hashnode", icon: Hashnode },
  { id: 9, iconName: "Mastodon", icon: Mastodon },
  { id: 10, iconName: "LinkedIn", icon: Linkedin },
  { id: 11, iconName: "Instagram", icon: Instagram },
  { id: 12, iconName: "GitHub", icon: Github },
  { id: 13, iconName: "Facebook", icon: Facebook },
  { id: 14, iconName: "Dribbble", icon: Dribbble },
  { id: 15, iconName: "Discord", icon: Discord },
  { id: 16, iconName: "DeviantArt", icon: Deviantart },
  { id: 17, iconName: "Bluesky", icon: Bluesky },
  { id: 18, iconName: "Behance", icon: Behance },
  { id: 19, iconName: "YouTube", icon: Youtube },
  { id: 20, iconName: "X (Twitter)", icon: X },
  { id: 21, iconName: "Codepen", icon: Codepen },
  { id: 22, iconName: "Blogger", icon: Blogger },
  { id: 23, iconName: "Stackoverflow", icon: Stackoverflow },
  { id: 24, iconName: "Custom Link", icon: CustomLink },
];

export const nsfwPlatforms = [
  "OnlyFans",
  "Patreon",
  "X (Twitter)",
  "Discord",
  "DeviantArt",
  "Custom Link",
];

export function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}

export function youTubeEmbedUrl(url: string) {
  const idMatch =
    url.match(/v=([^&]+)/)?.[1] || url.match(/youtu\.be\/([^?]+)/)?.[1] || "";
  return idMatch ? `https://www.youtube.com/embed/${idMatch}` : null;
}

export function isSpotify(url: string) {
  return /open\.spotify\.com/.test(url);
}
