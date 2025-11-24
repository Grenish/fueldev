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

export function DiscountsTab() {
  const uniqueCategories = [...new Set(product.map((p) => p.category))];
  const [discountType, setDiscountType] = useState("fixed");
  const [couponCode, setCouponCode] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [limitQuantity, setLimitQuantity] = useState(false);
  const [hasExpiry, setHasExpiry] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Create Discount
        </h2>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Dialog>
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
                    placeholder="Coupone name"
                    required
                    minLength={3}
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
                      defaultValue="fixed"
                      onValueChange={setDiscountType}
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
                      />
                    </InputGroup>
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Apply discount on</Label>
                  <div className="mt-2">
                    <Tabs defaultValue="all">
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
                        <Select defaultValue={uniqueCategories[0]}>
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
                    <Label htmlFor="limited">Limit quality</Label>
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
                      <InputGroupInput placeholder="10" />
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
                <Button type="submit">Create Coupon</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <CouponWidget
            name="Black Friday Bundle"
            code="BF2025"
            discountAmount="50% OFF"
            target="Bundles"
            expiryDate="Nov 30, 2025"
            serial="8839-1120"
            status="active"
            stats={{ claims: 1240, revenue: "$12.5k" }}
          />

          <CouponWidget
            name="Influencer Promo"
            code="JAKE10"
            discountAmount="$10"
            target="Accessories"
            expiryDate="Dec 31, 2025"
            serial="1102-3341"
            status="inactive"
            stats={{ claims: 5, revenue: "$50" }}
          />
          <CouponWidget
            name="Influencer Promo"
            code="JAKE10"
            discountAmount="$10"
            target="Accessories"
            expiryDate="Dec 31, 2025"
            serial="1102-3341"
            status="expired"
            stats={{ claims: 5, revenue: "$50" }}
          />
        </div>
      </div>
    </div>
  );
}
