import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { month: "January", sales: 186 },
  { month: "February", sales: 305 },
  { month: "March", sales: 237 },
  { month: "April", sales: 273 },
  { month: "May", sales: 209 },
  { month: "June", sales: 214 },
];

const topSellingProducts = [
  { name: "Notebook Pro", sales: 1420 },
  { name: "Dev Hoodie", sales: 980 },
  { name: "Sticker Pack", sales: 760 },
  { name: "Coffee Mug", sales: 540 },
  { name: "Python T Shirt", sales: 410 },
  { name: "Others", sales: 300 },
];

const topSellingLocations = [
  { location: "Mumbai", sales: 1320 },
  { location: "Bengaluru", sales: 1180 },
  { location: "Delhi", sales: 960 },
  { location: "Hyderabad", sales: 740 },
  { location: "Kolkata", sales: 620 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const productChartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const locationChartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function OverviewTab() {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Overview</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Check how your store performed
        </p>
      </div>

      {/* Main Chart Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Check your recent sales</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              // Responsive height: shorter on mobile, taller on desktop
              className="aspect-auto h-[250px] w-full sm:h-[300px]"
            >
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                {/* Added fixed width to YAxis to prevent layout shift/cutoff on mobile */}
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={35}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-sales)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Secondary Charts Grid: Stacks on mobile, 2 columns on tablet+ */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>A quick view of top items.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={productChartConfig}
                className="aspect-auto h-[250px] w-full sm:h-[300px]"
              >
                <BarChart
                  accessibilityLayer
                  data={topSellingProducts}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    // Angle and height ensure long names don't clip
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={35}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
              <CardDescription>Sales distribution by city.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={locationChartConfig}
                className="aspect-auto h-[250px] w-full sm:h-[300px]"
              >
                <BarChart
                  accessibilityLayer
                  data={topSellingLocations}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="location"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={35}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
