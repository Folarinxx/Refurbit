"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight, CheckCircle } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    // Redirect to dashboard after successful login
    window.location.href = "/dashboard"
    onClose()
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    // Redirect to dashboard after successful signup
    window.location.href = "/dashboard"
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-50 to-slate-50 p-6">
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold text-slate-800">Welcome to Refurbit</DialogTitle>
            <DialogDescription className="text-slate-600">
              Join the future of sustainable electronics management
            </DialogDescription>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 mx-auto">
              Powered by Hedera Blockchain
            </Badge>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-slate-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-slate-600">
                    <input type="checkbox" className="rounded border-slate-300" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="text-emerald-600 hover:text-emerald-700">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Create one here
                </button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstname" className="text-slate-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-firstname"
                        type="text"
                        placeholder="John"
                        className="pl-10 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname" className="text-slate-700">
                      Last Name
                    </Label>
                    <Input
                      id="signup-lastname"
                      type="text"
                      placeholder="Doe"
                      className="border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john@company.com"
                      className="pl-10 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-company" className="text-slate-700">
                    Company/Organization
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-company"
                      type="text"
                      placeholder="Your company name"
                      className="pl-10 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-slate-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 border-slate-200 focus:border-emerald-300 focus:ring-emerald-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-2 text-sm text-slate-600">
                    <input type="checkbox" className="rounded border-slate-300 mt-0.5" required />
                    <span>
                      I agree to the{" "}
                      <button type="button" className="text-emerald-600 hover:text-emerald-700">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button type="button" className="text-emerald-600 hover:text-emerald-700">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  <label className="flex items-start space-x-2 text-sm text-slate-600">
                    <input type="checkbox" className="rounded border-slate-300 mt-0.5" />
                    <span>Send me updates about Refurbit and sustainability initiatives</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <>
                      Create Account
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign in here
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t">
          <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span>Blockchain Verified</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
