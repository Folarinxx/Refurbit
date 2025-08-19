"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Building, MapPin, Calendar, Shield, Bell, Eye, Camera, Save, Key } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@company.com",
    phone: "+1 (555) 123-4567",
    company: "EcoTech Solutions",
    role: "Administrator",
    location: "San Francisco, CA",
    bio: "Sustainability advocate and blockchain enthusiast working to revolutionize electronics recycling through transparent lifecycle tracking.",
    joinDate: "January 2024",
    avatar: "/placeholder.svg?height=100&width=100&text=JD",
    timezone: "America/Los_Angeles",
    language: "English",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityVisible: false,
    contactVisible: true,
  })

  const handleSave = () => {
    console.log("Saving profile changes...")
    // Handle save logic here
  }

  return (
    <DashboardLayout currentPage="/dashboard/profile" breadcrumbs={[{ label: "Profile" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Profile Settings</h1>
            <p className="text-slate-600 mt-1">Manage your account settings and preferences</p>
          </div>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Overview */}
          <Card className="border-slate-200 lg:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="text-slate-800">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="flex justify-center gap-2 mt-2">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{user.role}</Badge>
                <Badge variant="outline" className="border-slate-300">
                  <Building className="w-3 h-3 mr-1" />
                  {user.company}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {user.location}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {user.joinDate}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Shield className="w-4 h-4 mr-2" />
                  Account Verified
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-800">About</h4>
                <p className="text-sm text-slate-600">{user.bio}</p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={user.name.split(" ")[0]}
                      onChange={(e) => setUser({ ...user, name: `${e.target.value} ${user.name.split(" ")[1]}` })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={user.name.split(" ")[1]}
                      onChange={(e) => setUser({ ...user, name: `${user.name.split(" ")[0]} ${e.target.value}` })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={user.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={user.location}
                      onChange={(e) => setUser({ ...user, location: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={user.company}
                    onChange={(e) => setUser({ ...user, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Shield className="w-5 h-5 mr-2" />
                  Preferences
                </CardTitle>
                <CardDescription>Customize your experience and regional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={user.timezone} onValueChange={(value) => setUser({ ...user, timezone: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={user.language} onValueChange={(value) => setUser({ ...user, language: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Español</SelectItem>
                        <SelectItem value="French">Français</SelectItem>
                        <SelectItem value="German">Deutsch</SelectItem>
                        <SelectItem value="Chinese">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Choose how you want to be notified about updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-slate-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-slate-600">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-slate-600">Receive important updates via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-slate-600">Receive updates about new features and tips</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Eye className="w-5 h-5 mr-2" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control who can see your information and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-slate-600">Make your profile visible to other users</p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activity Visibility</Label>
                    <p className="text-sm text-slate-600">Show your recent activity to others</p>
                  </div>
                  <Switch
                    checked={privacy.activityVisible}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, activityVisible: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Contact Information</Label>
                    <p className="text-sm text-slate-600">Allow others to see your contact details</p>
                  </div>
                  <Switch
                    checked={privacy.contactVisible}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, contactVisible: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Key className="w-5 h-5 mr-2" />
                  Security
                </CardTitle>
                <CardDescription>Manage your account security and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Change Password</Label>
                    <p className="text-sm text-slate-600">Update your account password</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Active Sessions</Label>
                    <p className="text-sm text-slate-600">Manage your active login sessions</p>
                  </div>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
