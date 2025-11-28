import { useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CouponWidget } from "@/components/coupon-widget";
import { Card, CardContent } from "@/components/ui/card";
import {
  IndianRupee,
  Package,
  Percent,
  Plus,
  Sparkles,
  Users,
  CalendarDays,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateCouponCode } from "@/util/default";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInDays } from "date-fns";
import { Switch } from "@/components/animate-ui/components/radix/switch";
import { trpc } from "@/lib/trpc/react";
import { toast } from "sonner";

interface DiscountsTabProps {
  storeId?: string;
}

const product = [
  {
    name: "Handcrafted Ceramic Mug",
    type: "physical",
    priceInINR: 499,
    category: "Home Decor",
  },
  {
    name: "Minimalist Portfolio Template",
    type: "digital",
    priceInINR: 799,
    category: "Templates",
  },
  {
    name: "LoFi Beats Pack",
    type: "digital",
    priceInINR: 299,
    category: "Music",
  },
  {
    name: "Organic Cotton T Shirt",
    type: "physical",
    priceInINR: 899,
    category: "Clothing",
  },
  {
    name: "Productivity Notion Dashboard",
    type: "digital",
    priceInINR: 349,
    category: "Productivity",
  },
];

export function DiscountsTab({ storeId }: DiscountsTabProps) {
  const uniqueCategories = [...new Set(product.map((p) => p.category))];
  const [discountType, setDiscountType] = useState<"fixed" | "percent">(
    "fixed",
  );
  const [couponCode, setCouponCode] = useState("");
  const [name, setName] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountOn, setDiscountOn] = useState<"all" | "category">("all");
  const [selectedCategory, setSelectedCategory] = useState(uniqueCategories[0]);
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [limitQuantity, setLimitQuantity] = useState(false);
  const [limitValue, setLimitValue] = useState("");
  const [hasExpiry, setHasExpiry] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const utils = trpc.useUtils();

  const { data: coupons, isLoading } = trpc.store.getCoupons.useQuery(
    { storeId: storeId! },
    { enabled: !!storeId },
  );

  const createCoupon = trpc.store.createCoupon.useMutation({
    onSuccess: () => {
      utils.store.getCoupons.invalidate({ storeId });
      setIsOpen(false);
      toast.success("Coupon created successfully");
      // Reset form
      setName("");
      setCouponCode("");
      setDiscountValue("");
      setExpiryDate(undefined);
      setLimitValue("");
      setHasExpiry(false);
      setLimitQuantity(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!storeId) return;
    if (!name || !couponCode || !discountValue) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (hasExpiry && !expiryDate) {
      toast.error("Please select an expiry date");
      return;
    }

    createCoupon.mutate({
      storeId,
      name,
      couponCode,
      discountType,
      discountValue: Number(discountValue),
      discountOn,
      discountOnCategory:
        discountOn === "category" ? selectedCategory : undefined,
      limit: limitQuantity ? Number(limitValue) : undefined,
      expiry: hasExpiry ? expiryDate : undefined,
    });
  };

  if (!storeId) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Create Discount
        </h2>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Card className="bg-transparent border border-primary hover:bg-primary/20 border-dashed shadow-none transition-colors duration-300 ease-in-out cursor-pointer">
                <CardContent className="flex h-full flex-col items-center justify-center text-muted-foreground">
                  <Plus />
                  <h2 className="text-xl font-semibold leading-tight mt-2">
                    Create New
                  </h2>
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent className="outline-none">
              <DialogHeader>
                <DialogTitle>Create Discount</DialogTitle>
                <DialogDescription>
                  Create a new coupon code for your customers.
                </DialogDescription>
              </DialogHeader>
              <div>
                <div>
                  <Label htmlFor="coupon-name">Name</Label>
                  <Input
                    id="coupon-name"
                    type="text"
                    className="mt-2"
                    placeholder="Coupon name"
                    required
                    minLength={3}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mt-2">
                  <Label>Code</Label>
                  <InputGroup className="mt-2">
                    <InputGroupAddon align={"inline-end"}>
                      <InputGroupButton
                        onClick={() => setCouponCode(generateCouponCode())}
                      >
                        <Sparkles />
                      </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      placeholder="SUMMER25"
                      minLength={2}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      required
                    />
                  </InputGroup>
                </div>

                <div className="mt-2">
                  <Label htmlFor="discount">Discount type</Label>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Select
                      value={discountType}
                      onValueChange={(v: "fixed" | "percent") =>
                        setDiscountType(v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">
                          <IndianRupee />
                        </SelectItem>
                        <SelectItem value="percent">
                          <Percent />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <InputGroup>
                      <InputGroupAddon>
                        {discountType === "fixed" ? (
                          <IndianRupee />
                        ) : (
                          <Percent />
                        )}
                      </InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        placeholder={` ${discountType === "fixed" ? "100" : "10"}`}
                        required
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Apply discount on</Label>
                  <div className="mt-2">
                    <Tabs
                      value={discountOn}
                      onValueChange={(v) =>
                        setDiscountOn(v as "all" | "category")
                      }
                    >
                      <TabsList className="w-full">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="category">Category</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all">
                        <InputGroup>
                          <InputGroupAddon>
                            <Package />
                          </InputGroupAddon>
                          <InputGroupText className="ml-2">
                            Selected {product.length} items
                          </InputGroupText>
                        </InputGroup>
                      </TabsContent>
                      <TabsContent value="category">
                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueCategories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="limited">Limit quantity</Label>
                    <Switch
                      id="limited"
                      checked={limitQuantity}
                      onCheckedChange={setLimitQuantity}
                    />
                  </div>
                  {limitQuantity && (
                    <InputGroup className="mt-2">
                      <InputGroupAddon>
                        <Users />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="10"
                        value={limitValue}
                        onChange={(e) => setLimitValue(e.target.value)}
                      />
                    </InputGroup>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="expiry">Expiry date</Label>
                    <Switch
                      id="expiry"
                      checked={hasExpiry}
                      onCheckedChange={setHasExpiry}
                    />
                  </div>
                  {hasExpiry && (
                    <div className="mt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {expiryDate ? (
                              format(expiryDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={expiryDate}
                            onSelect={setExpiryDate}
                          />
                        </PopoverContent>
                      </Popover>
                      {expiryDate && (
                        <p className="text-xs text-muted-foreground mt-1 font-light">
                          The code will expire in{" "}
                          {differenceInDays(expiryDate, new Date())} days
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={createCoupon.isPending}
                >
                  {createCoupon.isPending ? "Creating..." : "Create Coupon"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {coupons?.map((coupon) => (
            <CouponWidget
              key={coupon.id}
              name={coupon.name}
              code={coupon.couponCode}
              discountAmount={
                coupon.discountType === "fixed"
                  ? `₹${coupon.discountValue}`
                  : `${coupon.discountValue}% OFF`
              }
              target={
                coupon.discountOn === "all"
                  ? "All Products"
                  : coupon.discountOnCategory || "Category"
              }
              expiryDate={
                coupon.expiry
                  ? format(new Date(coupon.expiry), "MMM d, yyyy")
                  : "Immortal"
              }
              serial={coupon.serial}
              status={coupon.status as "active" | "inactive" | "expired"}
              stats={{ claims: coupon.claims, total: coupon.limit || 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
