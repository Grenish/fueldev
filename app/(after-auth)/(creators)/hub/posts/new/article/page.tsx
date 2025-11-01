"use client";

import { TiptapEditor } from "@/components/editor";
import { useState } from "react";

export default function CreatorArticle() {
  const [content, setContent] = useState("");
  return (
    <div className="h-full w-full flex flex-col items-center">
      <TiptapEditor content={content} onChange={setContent} />
    </div>
  );
}
