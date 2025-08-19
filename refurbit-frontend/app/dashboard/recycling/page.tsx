"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Leaf, Factory, Search, Filter, Download, Plus, TrendingUp } from "lucide-react"

export default function RecyclingPage() {
  const recyclingBatches = [
    {
      id: "RC-2024-001",
      deviceCount: 150,
      deviceTypes: ["Smartphones", "Tablets"],
      facility: "EcoRecycle SF",
      status: "Processing",
      startDate: "2024-01-20",
      estimatedCompletion: "2024-01-25",
      materialRecovery: 85,
      carbonSaved: "2.4 tons",
    },
    {
      id: "RC-2024-002",
      deviceCount: 89,
      deviceTypes: ["Laptops", "Desktops"],
      facility: "GreenTech Austin",
      status: "Completed",
      startDate: "2024-01-15",
      estimatedCompletion: "2024-01-20",
      materialRecovery: 92,
      carbonSaved: "3.1 tons",
    },
    {
      id: "RC-2024-003",
      deviceCount: 203,
      deviceTypes: ["Smartphones", "Laptops", "Tablets"],
      facility: "RecycleCorp NY",
      status: "Scheduled",
      startDate: "2024-01-25",
      estimatedCompletion: "2024-01-30",
      materialRecovery: 0,
      carbonSaved: "Est. 4.2 tons",
    },
  ]

  const materialRecoveryData = [
    { material: "Aluminum", recovered: 450, target: 500, percentage: 90 },
    { material: "Copper", recovered: 280, target: 300, percentage: 93 },
    { material: "Gold", recovered: 12, target: 15, percentage: 80 },
    { material: "Silver", recovered: 35, target: 40, percentage: 88 },
    { material: "Lithium", recovered: 180, target: 200, percentage: 90 },
    { material: "Rare Earth", recovered: 25, target: 30, percentage: 83 },
  ]

  const monthlyRecyclingData = [
    { month: "Jan", devices: 1200, materials: 850, carbon: 15.2 },
    { month: "Feb", devices: 1350, materials: 920, carbon: 16.8 },
    { month: "Mar", devices: 1180, materials: 780, carbon: 14.5 },
    { month: "Apr", devices: 1420, materials: 1050, carbon: 18.3 },
    { month: "May", devices: 1680, materials: 1200, carbon: 21.7 },
    { month: "Jun", devices: 1850, materials: 1350, carbon: 24.1 },
  ]

  const facilityPerformance = [
    { name: "EcoRecycle SF", value: 35, color: "#10b981" },
    { name: "GreenTech Austin", value: 28, color: "#3b82f6" },
    { name: "RecycleCorp NY", value: 22, color: "#f59e0b" },
    { name: "CleanTech Seattle", value: 15, color: "#8b5cf6" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700"
      case "Processing":
        return "bg-blue-100 text-blue-700"
      case "Scheduled":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <DashboardLayout currentPage="/dashboard/recycling" breadcrumbs={[{ label: "Recycling" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Recycling Management</h1>
            <p className="text-slate-600 mt-1">End-of-life processing and material recovery tracking</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Batch
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Devices Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">3,456</div>
              <p className="text-xs text-emerald-600 mt-1">+15.3% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Material Recovery Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">89.2%</div>
              <p className="text-xs text-blue-600 mt-1">Above industry average</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Carbon Footprint Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">124 tons</div>
              <p className="text-xs text-emerald-600 mt-1">CO₂ equivalent this month</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">12</div>
              <p className="text-xs text-amber-600 mt-1">Certified partners</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Recycling Trends */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Monthly Recycling Trends</CardTitle>
              <CardDescription>Devices processed and materials recovered over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  devices: { label: "Devices", color: "hsl(var(--chart-1))" },
                  materials: { label: "Materials (kg)", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRecyclingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="devices" fill="var(--color-devices)" />
                    <Bar dataKey="materials" fill="var(--color-materials)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Facility Performance */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Facility Performance</CardTitle>
              <CardDescription>Processing volume by recycling facility</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  performance: { label: "Performance", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={facilityPerformance}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {facilityPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {facilityPerformance.map((facility) => (
                  <div key={facility.name} className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: facility.color }} />
                    <span className="text-slate-600 truncate">{facility.name}</span>
                    <span className="ml-auto font-medium">{facility.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Material Recovery Tracking */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Material Recovery Tracking</CardTitle>
            <CardDescription>Recovery rates for different materials this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {materialRecoveryData.map((material) => (
                <div key={material.material} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-800">{material.material}</span>
                    <span className="text-sm text-slate-600">{material.percentage}%</span>
                  </div>
                  <Progress value={material.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{material.recovered}kg recovered</span>
                    <span>{material.target}kg target</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Recycling Batches */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Active Recycling Batches</CardTitle>
            <CardDescription>Current and scheduled recycling operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input placeholder="Search batches..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Device Count</TableHead>
                    <TableHead>Device Types</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recovery Rate</TableHead>
                    <TableHead>Carbon Saved</TableHead>
                    <TableHead>Completion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recyclingBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.id}</TableCell>
                      <TableCell>{batch.deviceCount}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {batch.deviceTypes.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{batch.facility}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {batch.materialRecovery > 0 ? (
                          <div className="flex items-center">
                            <span className="mr-2">{batch.materialRecovery}%</span>
                            <Progress value={batch.materialRecovery} className="h-2 w-16" />
                          </div>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>{batch.carbonSaved}</TableCell>
                      <TableCell>{batch.estimatedCompletion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact Summary */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Leaf className="w-5 h-5 mr-2 text-emerald-600" />
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">1,240</div>
                <div className="text-sm text-slate-600">Tons CO₂ Saved This Year</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">89%</div>
                <div className="text-sm text-slate-600">Average Recovery Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">15,678</div>
                <div className="text-sm text-slate-600">Devices Diverted from Landfill</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Factory className="w-5 h-5 mr-2 text-blue-600" />
                Processing Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Throughput Rate</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <Progress value={94.2} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quality Score</span>
                  <span className="font-medium">96.8%</span>
                </div>
                <Progress value={96.8} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Safety Compliance</span>
                  <span className="font-medium">99.1%</span>
                </div>
                <Progress value={99.1} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge className="bg-emerald-100 text-emerald-700">New Record</Badge>
                <span className="text-sm">Highest monthly recovery rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-700">Milestone</Badge>
                <span className="text-sm">10,000th device processed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-amber-100 text-amber-700">Certification</Badge>
                <span className="text-sm">ISO 14001 compliance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-100 text-purple-700">Partnership</Badge>
                <span className="text-sm">New facility in Portland</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
