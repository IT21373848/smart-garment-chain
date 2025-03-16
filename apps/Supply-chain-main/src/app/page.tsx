import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Truck, Factory, Package, Users, ArrowRight, CheckCircle2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col px-5">
      {/* Navigation */}
      <header className="border-b">
        <div className=" flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧵</span>
            <span className="font-bold text-xl">Smart-Garment-Chain</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary">
                Features
              </Link>
              <Link href="#benefits" className="text-sm font-medium hover:text-primary">
                Benefits
              </Link>
              <Link href="#contact" className="text-sm font-medium hover:text-primary">
                Contact
              </Link>
            </nav>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className=" grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Revolutionize Your <span className="text-primary">Garment Supply Chain</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Optimize production, logistics, and supplier management with our AI-powered platform designed specifically
              for the garment industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg">
                Schedule a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/banaer.jpg"
              alt="Smart garment supply chain visualization"
              fill
              className="object-cover height=800&width=800"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">AI-Powered Supply Chain Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform leverages artificial intelligence to optimize every aspect of your garment supply chain.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Factory className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Production Scheduling</h3>
              <p className="text-muted-foreground">
                AI-based optimization of production schedules to maximize efficiency and minimize downtime.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Logistics Optimization</h3>
              <p className="text-muted-foreground">
                Intelligent routing and transportation planning to reduce costs and delivery times.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Packaging Solutions</h3>
              <p className="text-muted-foreground">
                Optimize packaging for transportation efficiency, cost reduction, and sustainability.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Supplier Management</h3>
              <p className="text-muted-foreground">
                Data-driven supplier selection and evaluation to ensure quality and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-muted">
        <div className="">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Transform Your Garment Business</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Reduce Production Costs</h3>
                    <p className="text-muted-foreground">Optimize resource allocation and minimize waste.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Improve Delivery Times</h3>
                    <p className="text-muted-foreground">Streamline logistics for faster, more reliable deliveries.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Enhance Quality Control</h3>
                    <p className="text-muted-foreground">
                      Better supplier management leads to higher quality products.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Data-Driven Decisions</h3>
                    <p className="text-muted-foreground">Make informed choices based on real-time analytics.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/banaer2.jpg"
                alt="Garment supply chain benefits"
                fill
                className="object-cover height=800&width=800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">30%</div>
              <p className="text-muted-foreground">Production Cost Reduction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <p className="text-muted-foreground">Faster Delivery Times</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">25%</div>
              <p className="text-muted-foreground">Improved Supplier Quality</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Global Brands Trust Us</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-primary text-primary-foreground">
        <div className=" text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to Optimize Your Garment Supply Chain?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-primary-foreground/90">
            Join leading garment manufacturers who have transformed their operations with Smart-Garment-Chain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Schedule a Demo
            </Button>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧵</span>
                <span className="font-bold">Smart-Garment-Chain</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered supply chain solutions for the garment industry.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-6 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Smart-Garment-Chain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

