"use client";

import { useState } from "react";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export default function CreatorPolls() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [allowMultiple, setAllowMultiple] = useState(false);

  const handleAddOption = () => {
    if (options.length < 5) setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <Label htmlFor="poll-title">Poll Title</Label>
          <Input
            id="poll-title"
            type="text"
            placeholder="Who’s the best..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label>Poll Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1"
              />
              {index === options.length - 1 ? (
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={handleAddOption}
                  disabled={options.length >= 5}
                  className="transition-all hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleRemoveOption(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            {options.length}/5 options
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="multiple-vote"
            checked={allowMultiple}
            onCheckedChange={(checked) => setAllowMultiple(!!checked)}
          />
          <Label htmlFor="multiple-vote" className="text-sm">
            Allow multiple votes
          </Label>
        </div>

        <Button
          className="w-full mt-4"
          disabled={!title.trim() || options.filter(Boolean).length < 2}
        >
          Create Poll
        </Button>
      </div>
    </div>
  );
}
