"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle, Search, Filter, Download, Eye } from "lucide-react"

export default function SupplyChainPage() {
  const shipments = [
    {
      id: "SC-2024-001",
      deviceId: "NX-001234",
      deviceName: "iPhone 14 Pro",
      origin: "Cupertino, CA",
      destination: "New York, NY",
      status: "In Transit",
      progress: 65,
      estimatedArrival: "2024-01-25",
      carrier: "FedEx",
      trackingNumber: "1234567890",
      stages: [
        { name: "Pickup", completed: true, timestamp: "2024-01-20 09:00" },
        { name: "Processing", completed: true, timestamp: "2024-01-20 14:30" },
        { name: "In Transit", completed: false, timestamp: null },
        { name: "Delivery", completed: false, timestamp: null },
      ],
    },
    {
      id: "SC-2024-002",
      deviceId: "NX-001235",
      deviceName: 'MacBook Pro 16"',
      origin: "Austin, TX",
      destination: "Seattle, WA",
      status: "Delivered",
      progress: 100,
      estimatedArrival: "2024-01-22",
      carrier: "UPS",
      trackingNumber: "0987654321",
      stages: [
        { name: "Pickup", completed: true, timestamp: "2024-01-19 10:15" },
        { name: "Processing", completed: true, timestamp: "2024-01-19 16:45" },
        { name: "In Transit", completed: true, timestamp: "2024-01-20 08:30" },
        { name: "Delivery", completed: true, timestamp: "2024-01-22 11:20" },
      ],
    },
    {
      id: "SC-2024-003",
      deviceId: "NX-001236",
      deviceName: "Samsung Galaxy S23",
      origin: "San Francisco, CA",
      destination: "Chicago, IL",
      status: "Processing",
      progress: 25,
      estimatedArrival: "2024-01-28",
      carrier: "DHL",
      trackingNumber: "5678901234",
      stages: [
        { name: "Pickup", completed: true, timestamp: "2024-01-21 08:00" },
        { name: "Processing", completed: false, timestamp: null },
        { name: "In Transit", completed: false, timestamp: null },
        { name: "Delivery", completed: false, timestamp: null },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-700"
      case "In Transit":
        return "bg-blue-100 text-blue-700"
      case "Processing":
        return "bg-amber-100 text-amber-700"
      case "Delayed":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case "In Transit":
        return <Truck className="w-4 h-4 text-blue-600" />
      case "Processing":
        return <Package className="w-4 h-4 text-amber-600" />
      case "Delayed":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-slate-600" />
    }
  }

  return (
    <DashboardLayout currentPage="/dashboard/supply-chain" breadcrumbs={[{ label: "Supply Chain" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Supply Chain Tracking</h1>
            <p className="text-slate-600 mt-1">Transparent distribution and ownership tracking</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Package className="w-4 h-4 mr-2" />
            Create Shipment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">1,234</div>
              <p className="text-xs text-blue-600 mt-1">+8.2% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">On-Time Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">94.5%</div>
              <p className="text-xs text-emerald-600 mt-1">+2.1% improvement</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Average Transit Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">3.2 days</div>
              <p className="text-xs text-amber-600 mt-1">-0.3 days faster</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Carbon Footprint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">2.1 kg CO₂</div>
              <p className="text-xs text-emerald-600 mt-1">Per device shipped</p>
            </CardContent>
          </Card>
        </div>

        {/* Supply Chain Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-slate-800">Active Shipments</CardTitle>
              <CardDescription>Real-time tracking of device shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search shipments..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <Card key={shipment.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(shipment.status)}
                          <div>
                            <div className="font-medium">{shipment.id}</div>
                            <div className="text-sm text-slate-600">{shipment.deviceName}</div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {shipment.origin} → {shipment.destination}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="w-4 h-4 mr-2" />
                          ETA: {shipment.estimatedArrival}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <Progress value={shipment.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                          Carrier: {shipment.carrier} • {shipment.trackingNumber}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Supply Chain Health */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Supply Chain Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Delivery Performance</span>
                    <span className="font-medium">94.5%</span>
                  </div>
                  <Progress value={94.5} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tracking Accuracy</span>
                    <span className="font-medium">98.2%</span>
                  </div>
                  <Progress value={98.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Customer Satisfaction</span>
                    <span className="font-medium">96.8%</span>
                  </div>
                  <Progress value={96.8} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sustainability Score</span>
                    <span className="font-medium">91.3%</span>
                  </div>
                  <Progress value={91.3} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Shipment SC-2024-002 delivered</p>
                    <p className="text-xs text-slate-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New shipment SC-2024-004 created</p>
                    <p className="text-xs text-slate-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Shipment SC-2024-001 in transit</p>
                    <p className="text-xs text-slate-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Route optimization completed</p>
                    <p className="text-xs text-slate-500">3 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Tracking Table */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Shipment History</CardTitle>
            <CardDescription>Complete tracking history for all shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Carrier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{shipment.deviceName}</div>
                          <div className="text-sm text-slate-500">{shipment.deviceId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {shipment.origin} → {shipment.destination}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={shipment.progress} className="h-2 w-16" />
                          <span className="text-sm">{shipment.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{shipment.estimatedArrival}</TableCell>
                      <TableCell>{shipment.carrier}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
