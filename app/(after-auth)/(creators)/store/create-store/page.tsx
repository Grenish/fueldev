"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { slugifyStoreName } from "@/lib/utils";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { ArrowRight, Camera, Check, Store, Loader2 } from "lucide-react";
import Image from "next/image";
import { generateStorePolicy } from "@/docs/generate-policy";
import {
  buyerInfoText,
  deliveryText,
  paymentText,
  refundText,
  supportText,
} from "@/docs/policy-text-map";
import { Streamdown } from "streamdown";

type Step = "intro" | "details" | "policies" | "preview";

type PolicyKey = {
  refund: keyof typeof refundText;
  delivery: keyof typeof deliveryText;
  support: keyof typeof supportText;
  payment: keyof typeof paymentText;
  buyer_info: keyof typeof buyerInfoText;
};

type PoliciesState = Partial<PolicyKey>;

type CloudinarySignatureResponse = {
  signature: string;
  timestamp: number;
  folder: string;
  public_id: string;
  upload_preset: string;
  apiKey: string;
  cloudName: string;
};

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

const stepMeta: { id: Exclude<Step, "intro">; label: string }[] = [
  { id: "details", label: "Basics" },
  { id: "policies", label: "Policies" },
  { id: "preview", label: "Preview" },
];

const wizardSteps: Exclude<Step, "intro">[] = [
  "details",
  "policies",
  "preview",
];

type PolicyQuestion = {
  [K in keyof PolicyKey]: {
    id: K;
    label: string;
    options: { label: string; value: PolicyKey[K] }[];
  };
}[keyof PolicyKey];

const policyQuestions: PolicyQuestion[] = [
  {
    id: "refund",
    label: "Refund policy",
    options: [
      { label: "No refunds", value: "no_refund" },
      { label: "Refunds within 24 hours", value: "24_hours" },
      { label: "Refunds within 3 days", value: "3_days" },
      { label: "Refunds only if file is corrupted", value: "corrupted_only" },
    ],
  },
  {
    id: "delivery",
    label: "Delivery method",
    options: [
      { label: "Instant digital delivery", value: "instant" },
      { label: "Manual delivery by creator", value: "manual" },
      { label: "Scheduled or drip based delivery", value: "scheduled" },
    ],
  },
  {
    id: "support",
    label: "Support availability",
    options: [
      { label: "Email support", value: "email" },
      { label: "In-platform messaging support", value: "messaging" },
      { label: "Response within 24 hours", value: "24_hours" },
      { label: "Response within 3 days", value: "3_days" },
      { label: "No support provided", value: "none" },
    ],
  },
  {
    id: "payment",
    label: "Payment finality",
    options: [
      { label: "Payments are final", value: "final" },
      { label: "Refunds only if delivery fails", value: "delivery_fail" },
      { label: "Refunds reviewed case by case", value: "case_by_case" },
    ],
  },
  {
    id: "buyer_info",
    label: "Buyer information required",
    options: [
      { label: "Email only", value: "email_only" },
      { label: "Email plus username", value: "email_username" },
      { label: "No extra info required", value: "none" },
    ],
  },
];

export default function CreateStore() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [policies, setPolicies] = useState<PoliciesState>({});
  const [emailPolicy, setEmailPolicy] = useState(false);
  const [hasConfirmedPolicy, setHasConfirmedPolicy] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { data: session } = trpc.user.getSession.useQuery();
  const utils = trpc.useUtils();
  const creatorName = session?.user?.name || "";

  const createStoreMutation = trpc.store.createStoreWithPolicy.useMutation();

  const updateLogoMutation = trpc.store.updateStoreLogo.useMutation();

  const { data: myStores, isLoading: isCheckingStores } =
    trpc.store.getMyStores.useQuery(undefined, {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  const hasExistingStore = Boolean(myStores?.length);

  const activeStep = step === "intro" ? "details" : step;
  const currentStepIndex = wizardSteps.indexOf(activeStep);

  const canContinueDetails = Boolean(storeName.trim() && session?.user?.name);
  const isPolicyComplete = policyQuestions.every((q) =>
    Boolean(policies[q.id]),
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
      setLogoFile(file);
    }
  };

  const getCloudinarySignature = async (
    storeId: string,
  ): Promise<CloudinarySignatureResponse> => {
    const response = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder: `fueldev/store/${storeId}/storeMetadata`,
        public_id: "store-logo",
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to get Cloudinary signature");
    }

    return response.json();
  };

  const uploadLogoToCloudinary = async (storeId: string, file: File) => {
    const signaturePayload = await getCloudinarySignature(storeId);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", signaturePayload.folder);
    formData.append("public_id", signaturePayload.public_id);
    formData.append("timestamp", signaturePayload.timestamp.toString());
    formData.append("signature", signaturePayload.signature);
    formData.append("upload_preset", signaturePayload.upload_preset);
    formData.append("api_key", signaturePayload.apiKey);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/auto/upload`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload logo to Cloudinary");
    }

    const uploadData = await uploadResponse.json();
    return uploadData.secure_url as string;
  };

  const handleCreateStore = async () => {
    if (isCreating) {
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be logged in to create a store");
      return;
    }

    if (
      !policies.refund ||
      !policies.delivery ||
      !policies.support ||
      !policies.payment ||
      !policies.buyer_info
    ) {
      toast.error("Please complete all policy selections");
      return;
    }

    if (
      !policyPreview ||
      policyPreview.startsWith("Complete your store details")
    ) {
      toast.error("Please review your generated policy before continuing");
      return;
    }

    setIsCreating(true);

    try {
      const store = await createStoreMutation.mutateAsync({
        storeName,
        storeDescription: storeDescription || undefined,
        policies: {
          refund: policies.refund,
          delivery: policies.delivery,
          support: policies.support,
          payment: policies.payment,
          buyer_info: policies.buyer_info,
        },
        finalPolicyText: policyPreview,
        emailPolicy,
      });

      // Optimistically seed the new store into cache so the redirect sees it immediately
      const newStoreEntry = {
        ...store,
        storePolicy: null,
        _count: { products: 0 },
      };
      utils.store.getMyStores.setData(undefined, (old) => [
        newStoreEntry,
        ...(old ?? []),
      ]);

      if (logoFile) {
        try {
          const logoUrl = await uploadLogoToCloudinary(store.id, logoFile);
          await updateLogoMutation.mutateAsync({
            storeId: store.id,
            logoUrl,
          });
          // Update cached store with uploaded logo
          utils.store.getMyStores.setData(undefined, (old) =>
            (old ?? []).map((s) =>
              s.id === store.id ? { ...s, storeLogo: logoUrl } : s
            )
          );
        } catch (logoError) {
          console.error(logoError);
          toast.error(
            logoError instanceof Error
              ? logoError.message
              : "Unexpected logo upload error",
          );
        }
      }

      // Background invalidate to sync with server (non-blocking)
      utils.store.getMyStores.invalidate();
      toast.success("Store created successfully!");
      router.push(`/store/${slugifyStoreName(store.storeName)}`);
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error("Unable to create store. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handlePolicyChange = <K extends keyof PolicyKey>(
    key: K,
    value: PolicyKey[K],
  ) => {
    setPolicies((prev) => ({ ...prev, [key]: value }));
  };

  const policyPreview = useMemo(() => {
    if (
      !canContinueDetails ||
      !isPolicyComplete ||
      !policies.refund ||
      !policies.delivery ||
      !policies.support ||
      !policies.payment ||
      !policies.buyer_info
    ) {
      return "Complete your store details and policy selections to generate a preview.";
    }

    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return generateStorePolicy({
      storeName,
      creatorName,
      date,
      refundPolicy: policies.refund,
      deliveryMethod: policies.delivery,
      supportOption: policies.support,
      paymentFinality: policies.payment,
      buyerInfo: policies.buyer_info,
    });
  }, [canContinueDetails, isPolicyComplete, policies, storeName, creatorName]);

  if (isCheckingStores) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Checking your store status…
        </p>
      </div>
    );
  }

  // Redirect to existing store if user already has one
  useEffect(() => {
    if (hasExistingStore && myStores?.[0]) {
      router.push(`/store/${slugifyStoreName(myStores[0].storeName)}`);
    }
  }, [hasExistingStore, myStores, router]);

  // Show nothing while redirecting to existing store
  if (hasExistingStore && myStores?.[0]) {
    return null;
  }

  if (step === "intro") {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <ScreenOne onPrimaryAction={() => setStep("details")} />
      </div>
    );
  }

  return (
    <div className="min-h-full h-full w-full flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {stepMeta.map((meta, index) => {
              const isActive = meta.id === activeStep;
              const isCompleted =
                wizardSteps.indexOf(meta.id) < currentStepIndex;

              return (
                <div key={meta.id} className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs ${
                      isActive
                        ? "border-primary text-primary"
                        : isCompleted
                          ? "border-primary/40 text-primary"
                          : "border-border"
                    }`}
                  >
                    {isCompleted && <Check className="h-3 w-3" />}
                    {meta.label}
                  </span>
                  {index < stepMeta.length - 1 && (
                    <span className="h-px w-8 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {step === "details" && (
          <section className="space-y-6 p-6">
            <header className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Claim your store
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose a unique identity for your storefront. You can refine
                these details later.
              </p>
            </header>

            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <div className="relative overflow-hidden w-20 h-20 rounded-full bg-secondary/50 ring-1 ring-border flex items-center justify-center transition-all group-hover:ring-primary/30">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store className="w-7 h-7 text-muted-foreground/60" />
                  )}
                  <div className="absolute inset-0 bg-background/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Store icon</p>
                <p>Recommended 400x400px PNG, WEBP or JPEG.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Store name"
                  className="h-12 rounded-xl"
                  maxLength={48}
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="creator-name"
                  value={creatorName}
                  placeholder="Your name"
                  className="h-12 rounded-xl"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Textarea
                  id="store-description"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder="Tell buyers what you offer and why it matters."
                  className="min-h-[120px] resize-none rounded-xl"
                  maxLength={240}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Optional</span>
                  <span>{storeDescription.length}/240</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                className="px-0 text-muted-foreground"
                onClick={() => setStep("intro")}
              >
                Back
              </Button>
              <Button
                className="rounded-full px-6"
                disabled={!canContinueDetails}
                onClick={() => setStep("policies")}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {step === "policies" && (
          <section className="space-y-6 p-6">
            <header className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Set your store policies
              </h1>
              <p className="text-sm text-muted-foreground">
                Define how you handle refunds, delivery, support, and payments.
                These choices power your generated policy.
              </p>
            </header>

            <div className="space-y-4">
              {policyQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <Label
                    htmlFor={question.id}
                    className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {question.label}
                  </Label>
                  <Select
                    value={policies[question.id] ?? undefined}
                    onValueChange={(val) =>
                      handlePolicyChange(
                        question.id,
                        val as PolicyKey[typeof question.id],
                      )
                    }
                  >
                    <SelectTrigger
                      id={question.id}
                      className="h-12 w-full rounded-xl border-border/70"
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                className="px-0 text-muted-foreground"
                onClick={() => setStep("details")}
              >
                Back
              </Button>
              <Button
                className="rounded-full px-6"
                disabled={!isPolicyComplete}
                onClick={() => setStep("preview")}
              >
                Preview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {step === "preview" && (
          <section className="space-y-6 p-6">
            <header className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Preview your store policy
              </h1>
              <p className="text-sm text-muted-foreground">
                Generated from your selections. Share or export it once
                everything looks accurate.
              </p>
            </header>

            <div className="rounded-xl border border-dashed border-border/80 bg-muted/40 p-4">
              <div className="max-h-[320px] overflow-auto whitespace-pre-line text-sm leading-relaxed text-foreground">
                <Streamdown>{policyPreview}</Streamdown>
              </div>
            </div>

            <Label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={hasConfirmedPolicy}
                onCheckedChange={(checked) =>
                  setHasConfirmedPolicy(Boolean(checked))
                }
              />{" "}
              I confirm that I have reviewed the generated store policy, agree
              to the creator obligations described, and understand that FuelDev
              may enforce these terms if necessary.
            </Label>
            <Label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={emailPolicy}
                onCheckedChange={(checked) => setEmailPolicy(Boolean(checked))}
              />
              Email me this policy
            </Label>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                className="px-0 text-muted-foreground"
                onClick={() => setStep("policies")}
                disabled={isCreating}
              >
                Back
              </Button>
              <Button
                className="rounded-full px-6"
                disabled={
                  !isPolicyComplete ||
                  !canContinueDetails ||
                  !hasConfirmedPolicy ||
                  isCreating
                }
                onClick={handleCreateStore}
              >
                {isCreating ? "Creating..." : "Create store"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

interface ScreenOneProps {
  onPrimaryAction: () => void;
}

const ScreenOne = ({ onPrimaryAction }: ScreenOneProps) => {
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
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
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

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
        <Button
          variant="default"
          size="sm"
          className="w-full sm:w-auto"
          onClick={onPrimaryAction}
        >
          Get started
        </Button>
        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
          Learn more
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
