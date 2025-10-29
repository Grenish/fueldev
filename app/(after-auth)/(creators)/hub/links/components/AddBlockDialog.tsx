"use client";

import { useState, useEffect, startTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Sparkles, Briefcase, ListChecks, Mail } from "lucide-react";
import {
  AnyBlock,
  ProjectItem,
  HeadingBlock,
  ParagraphBlock,
  LinkBlock,
  ButtonBlock,
  ImageBlock,
  EmbedBlock,
  SpotifyBlock,
  ListBlock,
  SpacerBlock,
  ProjectsBlock,
} from "../types";

interface AddBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (block: AnyBlock) => void;
  onSaveMultiple?: (blocks: AnyBlock[]) => void;
  editingBlock?: AnyBlock | null;
}

export function AddBlockDialog({
  open,
  onOpenChange,
  onSave,
  onSaveMultiple,
  editingBlock,
}: AddBlockDialogProps) {
  const [activeTab, setActiveTab] = useState<"blocks" | "templates">("blocks");
  const [selectedBlockType, setSelectedBlockType] = useState<
    AnyBlock["type"] | null
  >("link");

  // Heading state
  const [hLevel, setHLevel] = useState<1 | 2 | 3>(1);
  const [hAlign, setHAlign] = useState<"left" | "center" | "right">("left");
  const [hText, setHText] = useState("");

  // Paragraph state
  const [pAlign, setPAlign] = useState<"left" | "center" | "right">("left");
  const [pText, setPText] = useState("");

  // Link state
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDesc, setLinkDesc] = useState("");
  const [linkIsNsfw, setLinkIsNsfw] = useState(false);

  // Button state
  const [btnLabel, setBtnLabel] = useState("");
  const [btnUrl, setBtnUrl] = useState("");

  // Image state
  const [imgSrc, setImgSrc] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [imgCaption, setImgCaption] = useState("");
  const [imgLinkUrl, setImgLinkUrl] = useState("");

  // Embed state
  const [embedUrl, setEmbedUrl] = useState("");
  const [embedTitle, setEmbedTitle] = useState("");

  // Spotify state
  const [spTitle, setSpTitle] = useState("");
  const [spArtist, setSpArtist] = useState("");
  const [spUrl, setSpUrl] = useState("");
  const [spCoverUrl, setSpCoverUrl] = useState("");
  const [spUseEmbed, setSpUseEmbed] = useState(true);

  // List state
  const [listOrdered, setListOrdered] = useState(false);
  const [listItems, setListItems] = useState<string[]>([]);
  const [listEntry, setListEntry] = useState("");

  // Spacer state
  const [spacerHeight, setSpacerHeight] = useState(24);

  // Projects state
  const [projTitle, setProjTitle] = useState("Projects");
  const [projItems, setProjItems] = useState<ProjectItem[]>([]);
  const [projDraft, setProjDraft] = useState<ProjectItem>({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    tags: [],
    demoUrl: "",
    repoUrl: "",
  });

  // Load editing block data
  useEffect(() => {
    if (editingBlock && open) {
      startTransition(() => {
        setSelectedBlockType(editingBlock.type);
        setActiveTab("blocks");

        switch (editingBlock.type) {
          case "heading": {
            const block = editingBlock as HeadingBlock;
            setHLevel(block.level);
            setHAlign(block.align || "left");
            setHText(block.text);
            break;
          }
          case "paragraph": {
            const block = editingBlock as ParagraphBlock;
            setPAlign(block.align || "left");
            setPText(block.text);
            break;
          }
          case "link": {
            const block = editingBlock as LinkBlock;
            setLinkTitle(block.title);
            setLinkUrl(block.url);
            setLinkDesc(block.description || "");
            setLinkIsNsfw(block.isNsfw || false);
            break;
          }
          case "button": {
            const block = editingBlock as ButtonBlock;
            setBtnLabel(block.label);
            setBtnUrl(block.url);
            break;
          }
          case "image": {
            const block = editingBlock as ImageBlock;
            setImgSrc(block.src);
            setImgAlt(block.alt || "");
            setImgCaption(block.caption || "");
            setImgLinkUrl(block.linkUrl || "");
            break;
          }
          case "embed": {
            const block = editingBlock as EmbedBlock;
            setEmbedUrl(block.url);
            setEmbedTitle(block.title || "");
            break;
          }
          case "spotify": {
            const block = editingBlock as SpotifyBlock;
            setSpTitle(block.title);
            setSpArtist(block.artist || "");
            setSpUrl(block.url);
            setSpCoverUrl(block.coverUrl || "");
            setSpUseEmbed(block.useEmbed || false);
            break;
          }
          case "list": {
            const block = editingBlock as ListBlock;
            setListOrdered(block.ordered || false);
            setListItems(block.items);
            break;
          }
          case "spacer": {
            const block = editingBlock as SpacerBlock;
            setSpacerHeight(block.height);
            break;
          }
          case "projects": {
            const block = editingBlock as ProjectsBlock;
            setProjTitle(block.title);
            setProjItems(block.items);
            break;
          }
        }
      });
    }
  }, [editingBlock, open]);

  const resetForm = () => {
    setSelectedBlockType("link");
    setHLevel(1);
    setHAlign("left");
    setHText("");
    setPAlign("left");
    setPText("");
    setLinkTitle("");
    setLinkUrl("");
    setLinkDesc("");
    setLinkIsNsfw(false);
    setBtnLabel("");
    setBtnUrl("");
    setImgSrc("");
    setImgAlt("");
    setImgCaption("");
    setImgLinkUrl("");
    setEmbedUrl("");
    setEmbedTitle("");
    setSpTitle("");
    setSpArtist("");
    setSpUrl("");
    setSpCoverUrl("");
    setSpUseEmbed(true);
    setListOrdered(false);
    setListItems([]);
    setListEntry("");
    setSpacerHeight(24);
    setProjTitle("Projects");
    setProjItems([]);
    setProjDraft({
      id: "",
      title: "",
      description: "",
      imageUrl: "",
      tags: [],
      demoUrl: "",
      repoUrl: "",
    });
  };

  const handleSave = () => {
    if (!selectedBlockType) return;

    let newBlock: AnyBlock | null = null;

    switch (selectedBlockType) {
      case "heading":
        if (!hText.trim()) return;
        newBlock = {
          id: editingBlock?.id ?? crypto.randomUUID(),
          type: "heading",
          level: hLevel,
          text: hText.trim(),
          align: hAlign,
        };
        break;
      case "paragraph":
        if (!pText.trim()) return;
        newBlock = {
          id: editingBlock?.id ?? crypto.randomUUID(),
          type: "paragraph",
          text: pText.trim(),
          align: pAlign,
        };
        break;
      case "link":
        if (!linkTitle.trim() || !linkUrl.trim()) return;
        newBlock = {
          id: editingBlock?.id ?? crypto.randomUUID(),
          type: "link",
          title: linkTitle.trim(),
          url: linkUrl.trim(),
          description: linkDesc.trim() || undefined,
          isNsfw: linkIsNsfw,
        };
        break;
      case "button":
        if (!btnLabel.trim() || !btnUrl.trim()) return;
        newBlock = {
          id: editingBlock?.id ?? crypto.randomUUID(),
          type: "button",
          label: btnLabel.trim(),
          url: btnUrl.trim(),
        };
        break;
      case "image":
        if (!imgSrc.trim()) return;
        newBlock = {
          id: editingBlock?.id ?? crypto.randomUUID(),
          type: "image",
          src: imgSrc.trim(),
          alt: imgAlt.trim() || undefined,
          caption: imgCaption.trim() || undefined,
          linkUrl: imgLinkUrl.trim() || undefined,
        };
        break;
      case "embed":
        if (!embedUrl.trim()) return;
        newBlock = {
          id: editingBlock?.id ?? crypto.randomUUID(),
          type: "embed",
          url: embedUrl.trim(),
          title: embedTitle.trim() || undefined,
        };
        break;
      case "spotify":
        if (!spUrl.trim()) return;
        newBlock = {
          id: editingBlock?.id ?? crypto.randomUUID(),
          type: "spotify",
          title: spTitle.trim() || "Spotify",
          artist: spArtist.trim() || undefined,
          url: spUrl.trim(),
          coverUrl: spCoverUrl.trim() || undefined,
          useEmbed: spUseEmbed,
        };
        break;
      case "list":
        newBlock = {
          id: editingBlock?.id ?? crypto.randomUUID(),
          type: "list",
          ordered: listOrdered,
          items: listItems.filter((i) => i.trim().length > 0),
        };
        break;
      case "spacer":
        newBlock = {
          id: editingBlock?.id ?? crypto.randomUUID(),
          type: "spacer",
          height: Math.max(4, Math.min(256, spacerHeight)),
        };
        break;
      case "projects":
        newBlock = {
          id: editingBlock?.id ?? crypto.randomUUID(),
          type: "projects",
          title: projTitle.trim() || "Projects",
          items: projItems,
        };
        break;
    }

    if (!newBlock) return;

    onSave(newBlock);
    resetForm();
    onOpenChange(false);
  };

  const addProjectItem = () => {
    if (!projDraft.title.trim()) return;
    setProjItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: projDraft.title.trim(),
        description: projDraft.description?.trim() || undefined,
        imageUrl: projDraft.imageUrl?.trim() || undefined,
        tags: projDraft.tags || [],
        demoUrl: projDraft.demoUrl?.trim() || undefined,
        repoUrl: projDraft.repoUrl?.trim() || undefined,
      },
    ]);
    setProjDraft({
      id: "",
      title: "",
      description: "",
      imageUrl: "",
      tags: [],
      demoUrl: "",
      repoUrl: "",
    });
  };

  // Templates
  const applyPortfolioTemplate = () => {
    if (!onSaveMultiple) return;
    const blocks: AnyBlock[] = [
      {
        id: crypto.randomUUID(),
        type: "heading",
        level: 1,
        text: "Welcome to My Portfolio",
        align: "center",
      } as HeadingBlock,
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        text: "I'm a creative professional passionate about building amazing digital experiences. Check out my work below!",
        align: "center",
      } as ParagraphBlock,
      {
        id: crypto.randomUUID(),
        type: "spacer",
        height: 32,
      } as SpacerBlock,
      {
        id: crypto.randomUUID(),
        type: "projects",
        title: "Featured Projects",
        items: [
          {
            id: crypto.randomUUID(),
            title: "E-Commerce Platform",
            description:
              "A modern online shopping experience with seamless checkout.",
            tags: ["React", "Node.js", "Stripe"],
            demoUrl: "https://example.com",
            repoUrl: "https://github.com/example/ecommerce",
          },
          {
            id: crypto.randomUUID(),
            title: "Portfolio Website",
            description:
              "Clean and minimal portfolio showcasing creative work.",
            tags: ["Next.js", "Tailwind", "Framer"],
            demoUrl: "https://example.com",
          },
        ],
      } as ProjectsBlock,
      {
        id: crypto.randomUUID(),
        type: "spacer",
        height: 32,
      } as SpacerBlock,
      {
        id: crypto.randomUUID(),
        type: "heading",
        level: 2,
        text: "Get In Touch",
        align: "center",
      } as HeadingBlock,
      {
        id: crypto.randomUUID(),
        type: "button",
        label: "Contact Me",
        url: "mailto:hello@example.com",
      } as ButtonBlock,
    ];
    onSaveMultiple(blocks);
    onOpenChange(false);
  };

  const applyLinkHubTemplate = () => {
    if (!onSaveMultiple) return;
    const blocks: AnyBlock[] = [
      {
        id: crypto.randomUUID(),
        type: "heading",
        level: 2,
        text: "All My Links",
        align: "center",
      } as HeadingBlock,
      {
        id: crypto.randomUUID(),
        type: "link",
        title: "My Website",
        url: "https://example.com",
        description: "Check out my personal website",
      } as LinkBlock,
      {
        id: crypto.randomUUID(),
        type: "link",
        title: "Shop My Store",
        url: "https://shop.example.com",
        description: "Browse my products and merchandise",
      } as LinkBlock,
      {
        id: crypto.randomUUID(),
        type: "link",
        title: "Latest Blog Post",
        url: "https://blog.example.com",
        description: "Read my thoughts and tutorials",
      } as LinkBlock,
      {
        id: crypto.randomUUID(),
        type: "link",
        title: "Newsletter",
        url: "https://newsletter.example.com",
        description: "Subscribe for updates",
      } as LinkBlock,
    ];
    onSaveMultiple(blocks);
    onOpenChange(false);
  };

  const applyResumeTemplate = () => {
    if (!onSaveMultiple) return;
    const blocks: AnyBlock[] = [
      {
        id: crypto.randomUUID(),
        type: "heading",
        level: 1,
        text: "John Doe",
        align: "center",
      } as HeadingBlock,
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        text: "Full-Stack Developer | Designer | Problem Solver",
        align: "center",
      } as ParagraphBlock,
      {
        id: crypto.randomUUID(),
        type: "spacer",
        height: 24,
      } as SpacerBlock,
      {
        id: crypto.randomUUID(),
        type: "heading",
        level: 2,
        text: "Experience",
        align: "left",
      } as HeadingBlock,
      {
        id: crypto.randomUUID(),
        type: "list",
        ordered: false,
        items: [
          "Senior Developer at Tech Corp (2020-Present)",
          "Frontend Developer at StartupXYZ (2018-2020)",
          "Junior Developer at AgencyABC (2016-2018)",
        ],
      } as ListBlock,
      {
        id: crypto.randomUUID(),
        type: "spacer",
        height: 24,
      } as SpacerBlock,
      {
        id: crypto.randomUUID(),
        type: "heading",
        level: 2,
        text: "Skills",
        align: "left",
      } as HeadingBlock,
      {
        id: crypto.randomUUID(),
        type: "list",
        ordered: false,
        items: [
          "JavaScript, TypeScript, React, Node.js",
          "Python, Django, FastAPI",
          "PostgreSQL, MongoDB, Redis",
          "AWS, Docker, Kubernetes",
        ],
      } as ListBlock,
      {
        id: crypto.randomUUID(),
        type: "spacer",
        height: 32,
      } as SpacerBlock,
      {
        id: crypto.randomUUID(),
        type: "button",
        label: "Download Resume PDF",
        url: "https://example.com/resume.pdf",
      } as ButtonBlock,
    ];
    onSaveMultiple(blocks);
    onOpenChange(false);
  };

  const applyContactTemplate = () => {
    if (!onSaveMultiple) return;
    const blocks: AnyBlock[] = [
      {
        id: crypto.randomUUID(),
        type: "heading",
        level: 1,
        text: "Let's Work Together",
        align: "center",
      } as HeadingBlock,
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        text: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
        align: "center",
      } as ParagraphBlock,
      {
        id: crypto.randomUUID(),
        type: "spacer",
        height: 32,
      } as SpacerBlock,
      {
        id: crypto.randomUUID(),
        type: "heading",
        level: 2,
        text: "Contact Methods",
        align: "center",
      } as HeadingBlock,
      {
        id: crypto.randomUUID(),
        type: "button",
        label: "📧 Email Me",
        url: "mailto:hello@example.com",
      } as ButtonBlock,
      {
        id: crypto.randomUUID(),
        type: "button",
        label: "📅 Schedule a Call",
        url: "https://calendly.com/example",
      } as ButtonBlock,
      {
        id: crypto.randomUUID(),
        type: "button",
        label: "💼 View LinkedIn",
        url: "https://linkedin.com/in/example",
      } as ButtonBlock,
    ];
    onSaveMultiple(blocks);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          resetForm();
          setActiveTab("blocks");
        }
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingBlock ? "Edit Block" : "Add Content"}
          </DialogTitle>
          <DialogDescription>
            Create individual blocks or start from a template
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "blocks" | "templates")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="blocks" className="space-y-6 mt-6">
            {/* Block type selector */}
            <div className="space-y-3">
              <Label>Block Type</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "heading",
                    "paragraph",
                    "link",
                    "button",
                    "image",
                    "embed",
                    "spotify",
                    "list",
                    "spacer",
                    "projects",
                  ] as AnyBlock["type"][]
                ).map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={selectedBlockType === type ? "default" : "outline"}
                    onClick={() => setSelectedBlockType(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Block configurations */}
            {selectedBlockType === "heading" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={hLevel === 1 ? "default" : "outline"}
                    onClick={() => setHLevel(1)}
                  >
                    H1
                  </Button>
                  <Button
                    size="sm"
                    variant={hLevel === 2 ? "default" : "outline"}
                    onClick={() => setHLevel(2)}
                  >
                    H2
                  </Button>
                  <Button
                    size="sm"
                    variant={hLevel === 3 ? "default" : "outline"}
                    onClick={() => setHLevel(3)}
                  >
                    H3
                  </Button>
                  <div className="ml-auto flex gap-2">
                    <Button
                      size="sm"
                      variant={hAlign === "left" ? "default" : "outline"}
                      onClick={() => setHAlign("left")}
                    >
                      Left
                    </Button>
                    <Button
                      size="sm"
                      variant={hAlign === "center" ? "default" : "outline"}
                      onClick={() => setHAlign("center")}
                    >
                      Center
                    </Button>
                    <Button
                      size="sm"
                      variant={hAlign === "right" ? "default" : "outline"}
                      onClick={() => setHAlign("right")}
                    >
                      Right
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="htext">Text</Label>
                  <Input
                    id="htext"
                    value={hText}
                    onChange={(e) => setHText(e.target.value)}
                    placeholder="Enter heading text"
                  />
                </div>
              </div>
            )}

            {selectedBlockType === "paragraph" && (
              <div className="space-y-4">
                <div className="flex gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant={pAlign === "left" ? "default" : "outline"}
                    onClick={() => setPAlign("left")}
                  >
                    Left
                  </Button>
                  <Button
                    size="sm"
                    variant={pAlign === "center" ? "default" : "outline"}
                    onClick={() => setPAlign("center")}
                  >
                    Center
                  </Button>
                  <Button
                    size="sm"
                    variant={pAlign === "right" ? "default" : "outline"}
                    onClick={() => setPAlign("right")}
                  >
                    Right
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ptext">Text</Label>
                  <textarea
                    id="ptext"
                    className="min-h-[100px] w-full resize-none rounded-md border bg-background p-3 text-sm"
                    value={pText}
                    onChange={(e) => setPText(e.target.value)}
                    placeholder="Enter paragraph text"
                  />
                </div>
              </div>
            )}

            {selectedBlockType === "link" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ltitle">Title</Label>
                  <Input
                    id="ltitle"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Link title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lurl">URL</Label>
                  <Input
                    id="lurl"
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ldesc">Description (optional)</Label>
                  <textarea
                    id="ldesc"
                    className="min-h-[80px] w-full resize-none rounded-md border bg-background p-3 text-sm"
                    value={linkDesc}
                    onChange={(e) => setLinkDesc(e.target.value)}
                    placeholder="Brief description"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={linkIsNsfw}
                    onCheckedChange={(c) => setLinkIsNsfw(!!c)}
                  />
                  Mark as NSFW (18+)
                </label>
              </div>
            )}

            {selectedBlockType === "button" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blabel">Label</Label>
                  <Input
                    id="blabel"
                    value={btnLabel}
                    onChange={(e) => setBtnLabel(e.target.value)}
                    placeholder="Button text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="burl">URL</Label>
                  <Input
                    id="burl"
                    type="url"
                    value={btnUrl}
                    onChange={(e) => setBtnUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}

            {selectedBlockType === "image" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="isrc">Image URL</Label>
                  <Input
                    id="isrc"
                    type="url"
                    value={imgSrc}
                    onChange={(e) => setImgSrc(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ialt">Alt Text</Label>
                  <Input
                    id="ialt"
                    value={imgAlt}
                    onChange={(e) => setImgAlt(e.target.value)}
                    placeholder="Describe the image"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icap">Caption (optional)</Label>
                  <Input
                    id="icap"
                    value={imgCaption}
                    onChange={(e) => setImgCaption(e.target.value)}
                    placeholder="Image caption"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ilink">Link URL (optional)</Label>
                  <Input
                    id="ilink"
                    type="url"
                    value={imgLinkUrl}
                    onChange={(e) => setImgLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}

            {selectedBlockType === "embed" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eurl">Embed URL</Label>
                  <Input
                    id="eurl"
                    type="url"
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    placeholder="YouTube, Spotify, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="etitle">Title (optional)</Label>
                  <Input
                    id="etitle"
                    value={embedTitle}
                    onChange={(e) => setEmbedTitle(e.target.value)}
                    placeholder="Embed title"
                  />
                </div>
              </div>
            )}

            {selectedBlockType === "spotify" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="surl">Spotify URL</Label>
                  <Input
                    id="surl"
                    type="url"
                    value={spUrl}
                    onChange={(e) => setSpUrl(e.target.value)}
                    placeholder="https://open.spotify.com/track/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stitle">Title</Label>
                  <Input
                    id="stitle"
                    value={spTitle}
                    onChange={(e) => setSpTitle(e.target.value)}
                    placeholder="Song title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sartist">Artist (optional)</Label>
                  <Input
                    id="sartist"
                    value={spArtist}
                    onChange={(e) => setSpArtist(e.target.value)}
                    placeholder="Artist name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scov">Cover URL (optional)</Label>
                  <Input
                    id="scov"
                    type="url"
                    value={spCoverUrl}
                    onChange={(e) => setSpCoverUrl(e.target.value)}
                    placeholder="https://i.scdn.co/image/..."
                  />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={spUseEmbed}
                    onCheckedChange={(c) => setSpUseEmbed(!!c)}
                  />
                  Use Spotify embed player
                </label>
              </div>
            )}

            {selectedBlockType === "list" && (
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={listOrdered}
                    onCheckedChange={(c) => setListOrdered(!!c)}
                  />
                  Ordered list (numbered)
                </label>
                <div className="space-y-2">
                  <Label>Add Items</Label>
                  <div className="flex gap-2">
                    <Input
                      value={listEntry}
                      onChange={(e) => setListEntry(e.target.value)}
                      placeholder="List item"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (listEntry.trim()) {
                            setListItems((prev) => [...prev, listEntry.trim()]);
                            setListEntry("");
                          }
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (listEntry.trim()) {
                          setListItems((prev) => [...prev, listEntry.trim()]);
                          setListEntry("");
                        }
                      }}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                {listItems.length > 0 && (
                  <div className="rounded-lg border p-3 space-y-2">
                    {listItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="text-sm flex-1">{item}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() =>
                            setListItems((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedBlockType === "spacer" && (
              <div className="space-y-2">
                <Label htmlFor="spheight">Height (px)</Label>
                <Input
                  id="spheight"
                  type="number"
                  min={4}
                  max={256}
                  value={spacerHeight}
                  onChange={(e) =>
                    setSpacerHeight(parseInt(e.target.value || "24", 10))
                  }
                />
              </div>
            )}

            {selectedBlockType === "projects" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ptitle">Section Title</Label>
                  <Input
                    id="ptitle"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="Projects"
                  />
                </div>
                <div className="rounded-lg border p-4 space-y-4">
                  <h4 className="font-medium text-sm">Add Project</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="pname">Project Title</Label>
                      <Input
                        id="pname"
                        value={projDraft.title}
                        onChange={(e) =>
                          setProjDraft((d) => ({ ...d, title: e.target.value }))
                        }
                        placeholder="Project name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pimg">Image URL</Label>
                      <Input
                        id="pimg"
                        type="url"
                        value={projDraft.imageUrl || ""}
                        onChange={(e) =>
                          setProjDraft((d) => ({
                            ...d,
                            imageUrl: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="pdesc">Description</Label>
                      <textarea
                        id="pdesc"
                        className="min-h-[80px] w-full resize-none rounded-md border bg-background p-3 text-sm"
                        value={projDraft.description || ""}
                        onChange={(e) =>
                          setProjDraft((d) => ({
                            ...d,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Project description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ptags">Tags (comma-separated)</Label>
                      <Input
                        id="ptags"
                        value={(projDraft.tags || []).join(", ")}
                        onChange={(e) =>
                          setProjDraft((d) => ({
                            ...d,
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          }))
                        }
                        placeholder="React, Node.js, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pdemo">Demo URL</Label>
                      <Input
                        id="pdemo"
                        type="url"
                        value={projDraft.demoUrl || ""}
                        onChange={(e) =>
                          setProjDraft((d) => ({
                            ...d,
                            demoUrl: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="prepo">Repository URL</Label>
                      <Input
                        id="prepo"
                        type="url"
                        value={projDraft.repoUrl || ""}
                        onChange={(e) =>
                          setProjDraft((d) => ({
                            ...d,
                            repoUrl: e.target.value,
                          }))
                        }
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={addProjectItem}
                    className="w-full"
                  >
                    Add Project
                  </Button>
                </div>
                {projItems.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Projects</Label>
                    <div className="space-y-2">
                      {projItems.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {p.title}
                            </p>
                            {p.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {p.description}
                              </p>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8"
                            onClick={() =>
                              setProjItems((prev) =>
                                prev.filter((x) => x.id !== p.id),
                              )
                            }
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4 mt-6">
            <p className="text-sm text-muted-foreground">
              Start with a pre-built template and customize it to your needs
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={applyPortfolioTemplate}
                className="group text-left rounded-lg border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Briefcase className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Portfolio</h4>
                    <p className="text-sm text-muted-foreground">
                      Showcase your work with projects, about section, and
                      contact
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={applyLinkHubTemplate}
                className="group text-left rounded-lg border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Link Hub</h4>
                    <p className="text-sm text-muted-foreground">
                      Classic link-in-bio style with multiple link cards
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={applyResumeTemplate}
                className="group text-left rounded-lg border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                    <ListChecks className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Resume/CV</h4>
                    <p className="text-sm text-muted-foreground">
                      Professional resume with experience, skills, and download
                      button
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={applyContactTemplate}
                className="group text-left rounded-lg border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                    <Mail className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Contact Page</h4>
                    <p className="text-sm text-muted-foreground">
                      Simple contact page with multiple ways to reach you
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {activeTab === "blocks" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingBlock ? "Save Changes" : "Add Block"}
              </Button>
            </>
          )}
          {activeTab === "templates" && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
