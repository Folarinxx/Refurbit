"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Download, Filter, Calendar } from "lucide-react"

export default function AnalyticsPage() {
  const deviceTrendData = [
    { month: "Jan", registered: 1200, recycled: 340, refurbished: 280 },
    { month: "Feb", registered: 1350, recycled: 380, refurbished: 320 },
    { month: "Mar", registered: 1180, recycled: 420, refurbished: 350 },
    { month: "Apr", registered: 1420, recycled: 390, refurbished: 380 },
    { month: "May", registered: 1680, recycled: 450, refurbished: 420 },
    { month: "Jun", registered: 1850, recycled: 520, refurbished: 480 },
  ]

  const supplyChainData = [
    { stage: "Manufacturing", devices: 2400, efficiency: 98 },
    { stage: "Distribution", devices: 2100, efficiency: 95 },
    { stage: "Retail", devices: 1800, efficiency: 92 },
    { stage: "Consumer", devices: 1600, efficiency: 88 },
    { stage: "Collection", devices: 800, efficiency: 85 },
  ]

  const deviceTypeData = [
    { name: "Smartphones", value: 45, color: "#10b981" },
    { name: "Laptops", value: 25, color: "#3b82f6" },
    { name: "Tablets", value: 15, color: "#f59e0b" },
    { name: "Desktops", value: 10, color: "#8b5cf6" },
    { name: "Others", value: 5, color: "#6b7280" },
  ]

  const kpiData = [
    {
      title: "Total Lifecycle Value",
      value: "$2.4M",
      change: "+18.2%",
      trend: "up",
      description: "Revenue generated from tracked devices",
    },
    {
      title: "Carbon Footprint Reduced",
      value: "1,240 tons",
      change: "+22.5%",
      trend: "up",
      description: "CO2 equivalent saved through recycling",
    },
    {
      title: "Compliance Score",
      value: "98.5%",
      change: "+2.1%",
      trend: "up",
      description: "Regulatory compliance across all processes",
    },
    {
      title: "Processing Efficiency",
      value: "94.2%",
      change: "-1.3%",
      trend: "down",
      description: "Average efficiency across all contracts",
    },
  ]

  return (
    <DashboardLayout currentPage="/dashboard/analytics" breadcrumbs={[{ label: "Analytics" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">Comprehensive insights into your electronics lifecycle management</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="30d">
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
            <Card key={kpi.title} className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{kpi.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
                <div className="flex items-center text-xs mt-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={kpi.trend === "up" ? "text-emerald-600" : "text-red-600"}>{kpi.change}</span>
                  <span className="text-slate-500 ml-1">vs last period</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">{kpi.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Device Lifecycle Trends */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Device Lifecycle Trends</CardTitle>
              <CardDescription>Monthly trends across registration, recycling, and refurbishment</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  registered: { label: "Registered", color: "hsl(var(--chart-1))" },
                  recycled: { label: "Recycled", color: "hsl(var(--chart-2))" },
                  refurbished: { label: "Refurbished", color: "hsl(var(--chart-3))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={deviceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="registered" stroke="var(--color-registered)" strokeWidth={2} />
                    <Line type="monotone" dataKey="recycled" stroke="var(--color-recycled)" strokeWidth={2} />
                    <Line type="monotone" dataKey="refurbished" stroke="var(--color-refurbished)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Device Type Distribution */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Device Type Distribution</CardTitle>
              <CardDescription>Breakdown of registered devices by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  smartphones: { label: "Smartphones", color: "#10b981" },
                  laptops: { label: "Laptops", color: "#3b82f6" },
                  tablets: { label: "Tablets", color: "#f59e0b" },
                  desktops: { label: "Desktops", color: "#8b5cf6" },
                  others: { label: "Others", color: "#6b7280" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {deviceTypeData.map((item) => (
                  <div key={item.name} className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                    <span className="ml-auto font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supply Chain Efficiency */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Supply Chain Efficiency</CardTitle>
            <CardDescription>Device flow and efficiency across supply chain stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                devices: { label: "Devices", color: "hsl(var(--chart-1))" },
                efficiency: { label: "Efficiency %", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplyChainData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="devices" fill="var(--color-devices)" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="var(--color-efficiency)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Contract Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Nexus Registry</span>
                  <span className="font-medium">98.5%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "98.5%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Supply Chain</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "94.2%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Recycling</span>
                  <span className="font-medium">96.8%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "96.8%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Refurbishment</span>
                  <span className="font-medium">91.3%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "91.3%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">1,240</div>
                <div className="text-sm text-slate-600">Tons CO2 Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">89%</div>
                <div className="text-sm text-slate-600">Material Recovery Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">3,456</div>
                <div className="text-sm text-slate-600">Devices Diverted from Landfill</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge className="bg-emerald-100 text-emerald-700">New</Badge>
                <span className="text-sm">10,000th device registered</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-700">Milestone</Badge>
                <span className="text-sm">99% supply chain visibility</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-amber-100 text-amber-700">Goal</Badge>
                <span className="text-sm">Carbon neutral operations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-100 text-purple-700">Award</Badge>
                <span className="text-sm">Best sustainability platform</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
