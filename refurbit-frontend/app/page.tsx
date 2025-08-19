"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth-modal"
import {
  ArrowRight,
  Shield,
  Recycle,
  Cpu,
  Monitor,
  Zap,
  CheckCircle,
  Users,
  Building,
  Leaf,
  BarChart3,
  Globe,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function RefurbitLanding() {
  const [showGetStarted, setShowGetStarted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleGetStarted = () => {
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Refurbit</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-emerald-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-slate-600 hover:text-emerald-600 transition-colors">
                How It Works
              </Link>
              <Link href="#benefits" className="text-slate-600 hover:text-emerald-600 transition-colors">
                Benefits
              </Link>
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                asChild
              >
                <Link href="https://github.com/Folarinxx/Refurbit" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </Link>
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleGetStarted}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-slate-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                  <Zap className="w-3 h-3 mr-1" />
                  Powered by Hedera Blockchain
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 leading-tight">
                  Electronics Lifecycle
                  <span className="text-emerald-600 block">Transparency</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  A comprehensive blockchain-based solution for tracking electronic devices throughout their entire
                  lifecycle - from manufacturing to recycling and refurbishment.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                  onClick={handleGetStarted}
                >
                  Explore Platform
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                >
                  View Documentation
                </Button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">100%</div>
                  <div className="text-sm text-slate-600">Transparent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">4</div>
                  <div className="text-sm text-slate-600">Smart Contracts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">∞</div>
                  <div className="text-sm text-slate-600">Scalability</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">Device Lifecycle</h3>
                    <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Manufacturing</div>
                        <div className="text-sm text-slate-600">Device registered</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Distribution</div>
                        <div className="text-sm text-slate-600">Supply chain tracked</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                      <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">In Use</div>
                        <div className="text-sm text-slate-600">Consumer ownership</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Recycle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">Refurbishment</div>
                        <div className="text-sm text-slate-600">Ready for reuse</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full opacity-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
              Core Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">Four Interconnected Smart Contracts</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our ecosystem consists of four specialized smart contracts working together to create a complete
              electronics lifecycle management solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-emerald-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">Nexus</CardTitle>
                <CardDescription>Core device registry and lifecycle management</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Device registration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Lifecycle tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Status management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">Supply Chain</CardTitle>
                <CardDescription>Transparent distribution and ownership tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                    Chain of custody
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                    Ownership transfers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                    Authenticity verification
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-amber-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">Recycling</CardTitle>
                <CardDescription>End-of-life processing and material recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-amber-500 mr-2" />
                    Material tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-amber-500 mr-2" />
                    Recovery metrics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-amber-500 mr-2" />
                    Compliance reporting
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-purple-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">Refurbishment</CardTitle>
                <CardDescription>Device restoration and quality certification</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                    Quality assessment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                    Restoration tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                    Certification process
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
              Process Flow
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">How Refurbit Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From manufacturing to end-of-life, every step is recorded on the blockchain for complete transparency and
              accountability.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Device Registration</h3>
              <p className="text-slate-600">
                Manufacturers register devices with unique identifiers, specifications, and initial lifecycle data on
                the Nexus contract.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Supply Chain Tracking</h3>
              <p className="text-slate-600">
                Every transfer, sale, and ownership change is recorded, creating an immutable chain of custody
                throughout distribution.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800">End-of-Life Processing</h3>
              <p className="text-slate-600">
                When devices reach end-of-life, recycling and refurbishment processes are tracked for environmental
                compliance and circular economy benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                  Key Benefits
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">Transforming Electronics Industry</h2>
                <p className="text-xl text-slate-600">
                  Refurbit provides unprecedented transparency, accountability, and compliance monitoring for the
                  electronics recycling industry.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Immutable Records</h3>
                  <p className="text-sm text-slate-600">
                    Blockchain-based tracking ensures data integrity and prevents tampering.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Global Compliance</h3>
                  <p className="text-sm text-slate-600">
                    Meet international regulations and environmental standards automatically.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Real-time Analytics</h3>
                  <p className="text-sm text-slate-600">
                    Comprehensive insights into device lifecycles and recycling metrics.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Sustainability</h3>
                  <p className="text-sm text-slate-600">Promote circular economy and reduce electronic waste impact.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-slate-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-800">For Manufacturers</h3>
                    <p className="text-slate-600">
                      Demonstrate product responsibility and track devices throughout their lifecycle for warranty and
                      support purposes.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-slate-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-800">For Consumers</h3>
                    <p className="text-slate-600">
                      Verify device authenticity, track ownership history, and ensure proper recycling when devices
                      reach end-of-life.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-slate-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-800">For Recyclers</h3>
                    <p className="text-slate-600">
                      Access complete device history, optimize processing workflows, and provide transparent reporting
                      to stakeholders.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to Transform Electronics Recycling?</h2>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                Join the future of sustainable electronics management with blockchain-powered transparency and
                accountability.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-8"
                onClick={handleGetStarted}
              >
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-400 text-white hover:bg-emerald-600 px-8 bg-transparent"
                asChild
              >
                <Link href="https://github.com/Folarinxx/Refurbit" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Refurbit</span>
              </div>
              <p className="text-slate-400">
                Blockchain-powered electronics lifecycle tracking for a sustainable future.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Smart Contracts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Refurbit. Built on Hedera Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
