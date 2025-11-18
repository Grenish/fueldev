import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadDropzone() {
  return (
    <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center hover:border-muted-foreground/50 transition-colors">
      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-sm font-medium">Click to upload or drag and drop</p>
    </div>
  );
}
