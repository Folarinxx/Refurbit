"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Filter, Download, Eye, Edit, Cpu, Smartphone, Laptop, Monitor } from "lucide-react"
import { useState } from "react"

export default function NexusRegistryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const devices = [
    {
      id: "NX-001234",
      name: "iPhone 14 Pro",
      manufacturer: "Apple Inc.",
      model: "A2894",
      serialNumber: "F2LLD3K8P0H1",
      category: "Smartphone",
      status: "Active",
      registrationDate: "2024-01-15",
      lastUpdate: "2024-01-20",
      owner: "TechCorp Ltd",
      location: "San Francisco, CA",
    },
    {
      id: "NX-001235",
      name: 'MacBook Pro 16"',
      manufacturer: "Apple Inc.",
      model: "A2485",
      serialNumber: "C02ZK0ABMD6T",
      category: "Laptop",
      status: "In Transit",
      registrationDate: "2024-01-14",
      lastUpdate: "2024-01-19",
      owner: "Global Electronics",
      location: "New York, NY",
    },
    {
      id: "NX-001236",
      name: "Samsung Galaxy S23",
      manufacturer: "Samsung",
      model: "SM-S911U",
      serialNumber: "R58RB0ABCDE",
      category: "Smartphone",
      status: "End of Life",
      registrationDate: "2024-01-13",
      lastUpdate: "2024-01-18",
      owner: "RecycleTech Inc",
      location: "Austin, TX",
    },
    {
      id: "NX-001237",
      name: "Dell XPS 13",
      manufacturer: "Dell Technologies",
      model: "9320",
      serialNumber: "ABCD123456",
      category: "Laptop",
      status: "Refurbishment",
      registrationDate: "2024-01-12",
      lastUpdate: "2024-01-17",
      owner: "RefurbCorp",
      location: "Seattle, WA",
    },
    {
      id: "NX-001238",
      name: 'iPad Pro 12.9"',
      manufacturer: "Apple Inc.",
      model: "A2436",
      serialNumber: "DMQLD3K8P0H1",
      category: "Tablet",
      status: "Active",
      registrationDate: "2024-01-11",
      lastUpdate: "2024-01-16",
      owner: "EduTech Solutions",
      location: "Boston, MA",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700"
      case "In Transit":
        return "bg-blue-100 text-blue-700"
      case "End of Life":
        return "bg-red-100 text-red-700"
      case "Refurbishment":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Smartphone":
        return <Smartphone className="w-4 h-4" />
      case "Laptop":
        return <Laptop className="w-4 h-4" />
      case "Tablet":
        return <Monitor className="w-4 h-4" />
      default:
        return <Cpu className="w-4 h-4" />
    }
  }

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || device.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout currentPage="/dashboard/nexus" breadcrumbs={[{ label: "Nexus Registry" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Nexus Registry</h1>
            <p className="text-slate-600 mt-1">Core device registry and lifecycle management</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Register Device
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Device</DialogTitle>
                <DialogDescription>Add a new device to the Nexus registry</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input id="device-name" placeholder="e.g., iPhone 14 Pro" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input id="manufacturer" placeholder="e.g., Apple Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" placeholder="e.g., A2894" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serial">Serial Number</Label>
                  <Input id="serial" placeholder="Device serial number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smartphone">Smartphone</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specifications">Specifications</Label>
                  <Textarea id="specifications" placeholder="Device specifications and details" rows={3} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Register Device</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">12,847</div>
              <p className="text-xs text-emerald-600 mt-1">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">8,234</div>
              <p className="text-xs text-blue-600 mt-1">64% of total devices</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Manufacturers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">156</div>
              <p className="text-xs text-amber-600 mt-1">+8 new this month</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">12</div>
              <p className="text-xs text-purple-600 mt-1">Device categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Device Registry</CardTitle>
            <CardDescription>Manage and track all registered devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search devices, manufacturers, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="End of Life">End of Life</SelectItem>
                  <SelectItem value="Refurbishment">Refurbishment</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
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
                    <TableHead>Device ID</TableHead>
                    <TableHead>Device Info</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-slate-500">{device.manufacturer}</div>
                          <div className="text-xs text-slate-400">{device.serialNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getCategoryIcon(device.category)}
                          <span className="ml-2">{device.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(device.status)}>{device.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{device.owner}</div>
                          <div className="text-sm text-slate-500">{device.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>{device.lastUpdate}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
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
