"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Monitor, AlertTriangle, Search, Filter, Download, Plus, Star } from "lucide-react"

export default function RefurbishmentPage() {
  const refurbishmentJobs = [
    {
      id: "RF-2024-001",
      deviceId: "NX-001237",
      deviceName: "Dell XPS 13",
      model: "9320",
      condition: "Good",
      status: "In Progress",
      technician: "Sarah Johnson",
      facility: "RefurbTech SF",
      startDate: "2024-01-20",
      estimatedCompletion: "2024-01-25",
      progress: 65,
      qualityScore: 0,
      issues: ["Battery replacement needed", "Screen calibration"],
    },
    {
      id: "RF-2024-002",
      deviceId: "NX-001238",
      deviceName: 'iPad Pro 12.9"',
      model: "A2436",
      condition: "Fair",
      status: "Completed",
      technician: "Mike Chen",
      facility: "TechRestore Austin",
      startDate: "2024-01-15",
      estimatedCompletion: "2024-01-20",
      progress: 100,
      qualityScore: 94,
      issues: [],
    },
    {
      id: "RF-2024-003",
      deviceId: "NX-001239",
      deviceName: "MacBook Air M2",
      model: "A2681",
      condition: "Poor",
      status: "Quality Check",
      technician: "Alex Rodriguez",
      facility: "RefurbTech SF",
      startDate: "2024-01-18",
      estimatedCompletion: "2024-01-28",
      progress: 85,
      qualityScore: 0,
      issues: ["Keyboard replacement", "Logic board repair"],
    },
    {
      id: "RF-2024-004",
      deviceId: "NX-001240",
      deviceName: "iPhone 13 Pro",
      model: "A2483",
      condition: "Excellent",
      status: "Scheduled",
      technician: "Emma Wilson",
      facility: "MobileRefurb NY",
      startDate: "2024-01-25",
      estimatedCompletion: "2024-01-27",
      progress: 0,
      qualityScore: 0,
      issues: [],
    },
  ]

  const qualityMetrics = [
    { category: "Functionality", score: 96, target: 95 },
    { category: "Appearance", score: 92, target: 90 },
    { category: "Performance", score: 94, target: 93 },
    { category: "Battery Life", score: 89, target: 85 },
    { category: "Connectivity", score: 98, target: 95 },
    { category: "Software", score: 97, target: 95 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700"
      case "In Progress":
        return "bg-blue-100 text-blue-700"
      case "Quality Check":
        return "bg-amber-100 text-amber-700"
      case "Scheduled":
        return "bg-slate-100 text-slate-700"
      case "On Hold":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "bg-emerald-100 text-emerald-700"
      case "Good":
        return "bg-blue-100 text-blue-700"
      case "Fair":
        return "bg-amber-100 text-amber-700"
      case "Poor":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <DashboardLayout currentPage="/dashboard/refurbishment" breadcrumbs={[{ label: "Refurbishment" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Refurbishment Center</h1>
            <p className="text-slate-600 mt-1">Device restoration and quality certification management</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            New Refurbishment Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Units Refurbished</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">2,891</div>
              <p className="text-xs text-emerald-600 mt-1">+18.7% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Average Quality Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">94.2%</div>
              <p className="text-xs text-blue-600 mt-1">Above target of 90%</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Turnaround Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">4.2 days</div>
              <p className="text-xs text-amber-600 mt-1">-0.8 days improvement</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">96.8%</div>
              <p className="text-xs text-emerald-600 mt-1">Devices passing QC</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Jobs */}
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-slate-800">Active Refurbishment Jobs</CardTitle>
              <CardDescription>Current restoration projects and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search jobs..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="progress">In Progress</SelectItem>
                    <SelectItem value="quality">Quality Check</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="space-y-4">
                {refurbishmentJobs.map((job) => (
                  <Card key={job.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Monitor className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-medium">{job.id}</div>
                            <div className="text-sm text-slate-600">{job.deviceName}</div>
                            <div className="text-xs text-slate-500">{job.deviceId}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getConditionColor(job.condition)}>{job.condition}</Badge>
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Technician:</span> {job.technician}
                        </div>
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Facility:</span> {job.facility}
                        </div>
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Started:</span> {job.startDate}
                        </div>
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">ETA:</span> {job.estimatedCompletion}
                        </div>
                      </div>

                      {job.progress > 0 && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                        </div>
                      )}

                      {job.qualityScore > 0 && (
                        <div className="flex items-center space-x-2 mb-4">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium">Quality Score: {job.qualityScore}%</span>
                        </div>
                      )}

                      {job.issues.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center text-sm font-medium text-slate-700">
                            <AlertTriangle className="w-4 h-4 mr-1 text-amber-500" />
                            Issues Identified:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.issues.map((issue, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Quality Metrics */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Quality Metrics</CardTitle>
                <CardDescription>Average scores across quality categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {qualityMetrics.map((metric) => (
                  <div key={metric.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.category}</span>
                      <span className={metric.score >= metric.target ? "text-emerald-600" : "text-amber-600"}>
                        {metric.score}%
                      </span>
                    </div>
                    <Progress
                      value={metric.score}
                      className={`h-2 ${metric.score >= metric.target ? "[&>div]:bg-emerald-500" : "[&>div]:bg-amber-500"}`}
                    />
                    <div className="text-xs text-slate-500">Target: {metric.target}%</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Facility Performance */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Facility Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>RefurbTech SF</span>
                    <span className="font-medium">96.2%</span>
                  </div>
                  <Progress value={96.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>TechRestore Austin</span>
                    <span className="font-medium">94.8%</span>
                  </div>
                  <Progress value={94.8} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>MobileRefurb NY</span>
                    <span className="font-medium">92.1%</span>
                  </div>
                  <Progress value={92.1} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>DeviceRenew LA</span>
                    <span className="font-medium">95.7%</span>
                  </div>
                  <Progress value={95.7} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Jobs Table */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Refurbishment History</CardTitle>
            <CardDescription>Complete history of refurbishment jobs</CardDescription>
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
                    <TableHead>Job ID</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Completion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refurbishmentJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{job.deviceName}</div>
                          <div className="text-sm text-slate-500">{job.deviceId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getConditionColor(job.condition)}>{job.condition}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                      </TableCell>
                      <TableCell>{job.technician}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={job.progress} className="h-2 w-16" />
                          <span className="text-sm">{job.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.qualityScore > 0 ? (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-500 mr-1" />
                            <span>{job.qualityScore}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>{job.estimatedCompletion}</TableCell>
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
