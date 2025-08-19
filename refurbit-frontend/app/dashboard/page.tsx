"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Cpu,
  Shield,
  Recycle,
  Monitor,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Devices",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: Cpu,
      color: "emerald",
    },
    {
      title: "Active Supply Chains",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: Shield,
      color: "blue",
    },
    {
      title: "Recycled Devices",
      value: "3,456",
      change: "+15.3%",
      trend: "up",
      icon: Recycle,
      color: "amber",
    },
    {
      title: "Refurbished Units",
      value: "2,891",
      change: "-2.1%",
      trend: "down",
      icon: Monitor,
      color: "purple",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "Device Registration",
      device: "iPhone 14 Pro",
      manufacturer: "Apple Inc.",
      timestamp: "2 minutes ago",
      status: "completed",
    },
    {
      id: 2,
      type: "Supply Chain Update",
      device: "Samsung Galaxy S23",
      manufacturer: "Samsung",
      timestamp: "5 minutes ago",
      status: "in-progress",
    },
    {
      id: 3,
      type: "Recycling Process",
      device: "MacBook Pro 2019",
      manufacturer: "Apple Inc.",
      timestamp: "12 minutes ago",
      status: "completed",
    },
    {
      id: 4,
      type: "Refurbishment Complete",
      device: "Dell XPS 13",
      manufacturer: "Dell Technologies",
      timestamp: "1 hour ago",
      status: "completed",
    },
  ]

  const contractMetrics = [
    {
      name: "Nexus Registry",
      devices: 12847,
      growth: 12.5,
      color: "emerald",
    },
    {
      name: "Supply Chain",
      transactions: 8934,
      growth: 8.2,
      color: "blue",
    },
    {
      name: "Recycling",
      processed: 3456,
      growth: 15.3,
      color: "amber",
    },
    {
      name: "Refurbishment",
      completed: 2891,
      growth: -2.1,
      color: "purple",
    },
  ]

  return (
    <DashboardLayout currentPage="/dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome back, John!</h1>
            <p className="text-slate-600 mt-1">
              Here's what's happening with your electronics lifecycle management today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
              <Activity className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Register Device
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    stat.color === "emerald"
                      ? "bg-emerald-100"
                      : stat.color === "blue"
                        ? "bg-blue-100"
                        : stat.color === "amber"
                          ? "bg-amber-100"
                          : "bg-purple-100"
                  }`}
                >
                  <stat.icon
                    className={`w-4 h-4 ${
                      stat.color === "emerald"
                        ? "text-emerald-600"
                        : stat.color === "blue"
                          ? "text-blue-600"
                          : stat.color === "amber"
                            ? "text-amber-600"
                            : "text-purple-600"
                    }`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <div className="flex items-center text-xs text-slate-600 mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-emerald-600" : "text-red-600"}>{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Smart Contract Performance */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Smart Contract Performance</CardTitle>
              <CardDescription>Overview of your four interconnected smart contracts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contractMetrics.map((contract) => (
                <div key={contract.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{contract.name}</span>
                    <div className="flex items-center text-xs">
                      {contract.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={contract.growth > 0 ? "text-emerald-600" : "text-red-600"}>
                        {contract.growth > 0 ? "+" : ""}
                        {contract.growth}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={Math.abs(contract.growth) * 5}
                    className={`h-2 ${
                      contract.color === "emerald"
                        ? "[&>div]:bg-emerald-500"
                        : contract.color === "blue"
                          ? "[&>div]:bg-blue-500"
                          : contract.color === "amber"
                            ? "[&>div]:bg-amber-500"
                            : "[&>div]:bg-purple-500"
                    }`}
                  />
                  <div className="text-xs text-slate-500">
                    {contract.name === "Nexus Registry"
                      ? `${contract.devices.toLocaleString()} devices registered`
                      : contract.name === "Supply Chain"
                        ? `${contract.transactions.toLocaleString()} transactions processed`
                        : contract.name === "Recycling"
                          ? `${contract.processed.toLocaleString()} devices processed`
                          : `${contract.completed.toLocaleString()} units completed`}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Recent Activity</CardTitle>
              <CardDescription>Latest updates from your device lifecycle tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === "completed" ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-800">{activity.type}</p>
                        <Badge
                          variant={activity.status === "completed" ? "default" : "secondary"}
                          className={
                            activity.status === "completed"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : ""
                          }
                        >
                          {activity.status === "completed" ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {activity.device} • {activity.manufacturer}
                      </p>
                      <p className="text-xs text-slate-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your electronics lifecycle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                <Cpu className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-medium">Register Device</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">Track Supply Chain</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                <Recycle className="w-6 h-6 text-amber-600" />
                <span className="text-sm font-medium">Process Recycling</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                <Monitor className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium">Start Refurbishment</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
