import { Navbar } from './_components/Navbar'
import { Footer } from './_components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react'
import FloatingChatbot from '@/components/DNT/Chatbot'

export default function Homepage({ children }: { children: ReactNode }) {
  return (
    <>
      <FloatingChatbot />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                    Welcome to Learnify
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Embark on a transformative learning journey with our cutting-edge online courses.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex space-x-2">
                    <Input
                      className="flex-1"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <Button type="submit">
                      Subscribe
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Start your free trial. No credit card required.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link href="/courses">
                    <Button size="lg" className="w-full sm:w-auto">
                      Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose Learnify?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<BookOpen className="h-10 w-10 text-blue-500" />}
                  title="Diverse Courses"
                  description="Access a wide range of courses covering various subjects and skills."
                />
                <FeatureCard
                  icon={<Users className="h-10 w-10 text-green-500" />}
                  title="Expert Instructors"
                  description="Learn from industry professionals and experienced educators."
                />
                <FeatureCard
                  icon={<Award className="h-10 w-10 text-purple-500" />}
                  title="Recognized Certifications"
                  description="Earn certificates that are valued by employers worldwide."
                />
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Join thousands of learners who have transformed their careers with Learnify. Our platform offers flexible learning options, interactive content, and personalized support to ensure your success.
                  </p>
                  <Link href="/signup">
                    <Button size="lg">
                      Sign Up Now
                    </Button>
                  </Link>
                </div>
                <div className="relative h-[300px] sm:h-[400px]">
                <Image
                  src="/learn.jpg"
                  alt="Learning illustration"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}