"use client";

import { TiptapEditor } from "@/components/editor";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export default function CreatorArticle() {
  const [content, setContent] = useState("");
  return (
    <div className="h-full w-full flex flex-col items-center relative">
      <TiptapEditor content={content} onChange={setContent} />
      <Badge className="fixed bottom-2 right-2">
        {/*<Spinner />*/}
        <p>Saved</p>
      </Badge>
    </div>
  );
}
