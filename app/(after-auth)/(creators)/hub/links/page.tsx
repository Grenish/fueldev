import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CreatorLinks() {
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <Button className="bg-secondary" variant={"default"} size={"sm"}>
        <Plus className="" size={20} /> <p>Add New Link</p>
      </Button>
    </div>
  );
}
