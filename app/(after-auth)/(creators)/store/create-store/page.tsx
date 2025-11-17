"use client";

import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import {
  ArrowRight,
  Camera,
  ImagePlus,
  MountainSnow,
  ShieldCheck,
  Store,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const items = [
  {
    title: "Direct Revenue",
    desc: "List products and get paid instantly via UPI. No middle layers, just you and your audience.",
    img: "/store1.png",
  },
  {
    title: "Your Ecosystem",
    desc: "Your store lives on your profile. Supporters browse and buy without ever leaving your page.",
    img: "/store2.png",
  },
  {
    title: "Creator Presence",
    desc: "A clean, professional store adds legitimacy and turns casual visitors into loyal supporters.",
    img: "/store3.png",
  },
];

const policyQuestions = [
  {
    id: "refund",
    label: "Refund policy",
    options: [
      "No refunds",
      "Refunds within 24 hours",
      "Refunds within 3 days",
      "Refunds only if file is corrupted",
    ],
  },
  {
    id: "delivery",
    label: "Delivery method",
    options: [
      "Instant digital delivery",
      "Manual delivery by creator",
      "Scheduled or drip based delivery",
    ],
  },
  {
    id: "support",
    label: "Support availability",
    options: [
      "Email support",
      "In-platform messaging support",
      "Response within 24 hours",
      "Response within 3 days",
      "No support provided",
    ],
  },
  {
    id: "payment",
    label: "Payment finality",
    options: [
      "Payments are final",
      "Refunds only if delivery fails",
      "Refunds reviewed case by case",
    ],
  },
  {
    id: "buyer_info",
    label: "Buyer information required",
    options: ["Email only", "Email plus username", "No extra info required"],
  },
];

export default function CreateStore() {
  const [storeName, setStoreName] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [policies, setPolicies] = useState<Record<string, string>>({});

  const handleValueChange = (id: string, value: string) => {
    setPolicies((prev) => ({ ...prev, [id]: value }));
  };

  // Check if all fields are filled
  const isFormComplete = policyQuestions.every((q) => policies[q.id]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
    }
  };
  return (
    <div className="w-full min-h-full flex items-center justify-center">
      {/*step 1*/}
      {/*<div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Claim your store
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a unique address for your digital storefront.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <div className="relative overflow-hidden w-16 h-16 rounded-full  bg-secondary/50 ring-1 ring-border flex items-center justify-center transition-all group-hover:ring-primary/20">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Preview"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-6 h-6 text-muted-foreground/50" />
                )}

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-medium text-foreground">
                Store Icon
              </span>
              <span className="text-xs text-muted-foreground">
                Recommended 400x400px
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative flex items-center">
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Your brand"
                className="h-14 text-base bg-transparent border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl"
              />
            </div>

            <div className="relative flex items-center">
              <Textarea
                placeholder="Tell about your brand"
                className="h-14 text-base bg-transparent border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground px-0 hover:bg-transparent"
              >
                Back
              </Button>
              <Button
                className="rounded-full px-8 font-medium transition-all"
                disabled={!storeName}
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>*/}

      {/*step 2*/}
      {/*<div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Set your store policies
          </h1>
          <p className="text-sm text-muted-foreground">
            Define how you want to handle transactions and support.
          </p>
        </div>

        <div className="space-y-5">
          {policyQuestions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label
                htmlFor={question.id}
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1"
              >
                {question.label}
              </Label>

              <Select
                onValueChange={(val) => handleValueChange(question.id, val)}
              >
                <SelectTrigger
                  id={question.id}
                  className="w-full h-12 bg-transparent border-border/60 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
                >
                  <SelectValue
                    placeholder="Select an option..."
                    className="w-full"
                  />
                </SelectTrigger>

                <SelectContent position="popper" className="max-w-full w-full">
                  {question.options.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="cursor-pointer"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="pt-6 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground px-0 hover:bg-transparent"
            >
              Back
            </Button>
            <Button
              className="rounded-full px-8 font-medium transition-all"
              disabled={!isFormComplete}
            >
              Preview <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>*/}

      {/* preview */}
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Preview your policies
          </h1>
          <p className="text-sm text-muted-foreground">
            Read your generated store policy, to know your rights.
          </p>
        </div>
        <div className="w-full rounded-xl bg-muted h-[50vh] p-2.5 overflow-auto"></div>
        <div>
          <Label className="flex items-center gap-2">
            <Checkbox />
            Email me this store policy
          </Label>
        </div>
        <div className="pt-6 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground px-0 hover:bg-transparent"
          >
            Back
          </Button>
          <Button
            className="rounded-full px-8 font-medium transition-all"
            disabled={!isFormComplete}
          >
            Next <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const ScreenOne = () => {
  return (
    <div className="relative w-full min-h-full h-full flex flex-col items-center justify-start py-10 px-4 md:px-6">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Create a new store
        </h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base">
          FuelDev gives creators a simple and reliable way to set up a store and
          offer their products or merch. Everything is streamlined so you can
          focus on what you make while your audience gets an easy place to buy
          it.
        </p>
      </div>

      <div className="w-full max-w-6xl">
        {/* Mobile carousel */}
        <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-1">
          {items.map((item, i) => (
            <Card
              key={i}
              className="min-w-[85%] snap-center border-0 shadow-none bg-transparent flex flex-col gap-4"
            >
              <CardContent className="p-0">
                <div className="relative w-full aspect-4/3 overflow-hidden rounded-2xl border border-border/50 bg-secondary/20">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-opacity duration-300 hover:opacity-90"
                  />
                </div>
              </CardContent>

              <CardHeader className="p-0 space-y-2">
                <CardTitle className="text-lg font-medium tracking-tight text-foreground">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, i) => (
            <Card
              key={i}
              className="group border-0 shadow-none bg-transparent flex flex-col gap-4"
            >
              <CardContent className="p-0">
                <div className="relative w-full aspect-4/3 overflow-hidden rounded-2xl border border-border/50 bg-secondary/20">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-opacity duration-300 hover:opacity-90"
                  />
                </div>
              </CardContent>

              <CardHeader className="p-0 space-y-2">
                <CardTitle className="text-lg font-medium tracking-tight text-foreground">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="default" size="sm" className="w-full sm:w-auto">
          Get Started
        </Button>
        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
          Learn More
        </Button>
      </div>

      <div className="mt-6 flex w-full items-center justify-center px-2">
        <p className="text-xs text-muted-foreground text-center">
          Support for selling physical goods will be added in a future update.
        </p>
      </div>
    </div>
  );
};
