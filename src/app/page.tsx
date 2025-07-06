import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { Clock, TrendingUp, Users, Zap, BarChart3, Target, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Clock className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BreakLog</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <ThemeToggle />
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold tracking-tight">
              A <span className="text-primary">better way</span>
              <br />
              to manage your work hours
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Track your work activities with precision. Boost productivity and gain insights into your work patterns.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-from-bottom">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/signup">
                Start Tracking
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to track, analyze, and optimize your work time
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Time Tracking</CardTitle>
              </div>
              <CardDescription>
                Log work activities with precision timing and categorization
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Analytics</CardTitle>
              </div>
              <CardDescription>
                Get detailed insights into your productivity patterns and trends
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Goal Setting</CardTitle>
              </div>
              <CardDescription>
                Set and track daily work goals to stay motivated and productive
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
              </div>
              <CardDescription>
                Monitor your improvement over time with detailed progress reports
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
              </div>
              <CardDescription>
                Share insights and coordinate with team members effectively
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Easy to Use</CardTitle>
              </div>
              <CardDescription>
                Intuitive interface designed for quick logging and minimal disruption
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-16 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to boost your productivity?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join thousands of professionals who have transformed their work habits with BreakLog.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link href="/signup">
                    Get Started Free
                    <Zap className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Clock className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">BreakLog</span>
            </div>
            <div className="flex justify-end">
              <p className="text-sm text-muted-foreground">
                Built with ❤️ by{' '}
                <Link href="https://github.com/alok-debnath" className="text-primary hover:underline">
                  Alok
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
