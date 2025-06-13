"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/home/header"
import HeroSection from "../components/home/hero-section"
import { AccountSection } from "../components/home/account-section"
import { WhyChooseSection } from "../components/home/why-choose-section"
import { HealthPackagesSection } from "../components/home/health-packages-section"
import HowItWorksSection from "../components/home/how-it-works-section"
import ContactForm from "../components/home/ContactForm"
import { TestimonialsSection } from "../components/home/testimonials-section"
import { CallToActionSection } from "../components/home/call-to-action-section"
import { NewsSection } from "../components/home/news-section"
import { FAQSection } from "../components/home/faq-section"
import Footer from "../components/shared/footer"

function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AccountSection />
        <WhyChooseSection />
        <HowItWorksSection />
        <NewsSection />
        <HealthPackagesSection />
        <TestimonialsSection />
        <CallToActionSection />
        <FAQSection />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}

export default Home
