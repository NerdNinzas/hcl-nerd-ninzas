"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  Shield,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
  Stethoscope,
  Plus,
  ArrowRight,
  Star,
  Menu,
  X,
} from "lucide-react";
import { Navbar } from "./components/Navbar";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation Header */}
     <Navbar/>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <div className="mx-auto max-w-4xl">
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
              Your Health,
              <span className="relative whitespace-nowrap text-blue-600">
                <span className="relative"> Our Priority</span>
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
              Comprehensive wellness and preventive care management designed to
              help you achieve your health goals and stay compliant with
              preventive checkups.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-800 focus-visible:outline-blue-600"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Health Stats */}
        <div className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Trusted by thousands of patients and healthcare providers
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  Join our growing community focused on preventive healthcare
                  and wellness.
                </p>
              </div>
              <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">
                    Active Patients
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                    12,000+
                  </dd>
                </div>
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">
                    Healthcare Providers
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                    500+
                  </dd>
                </div>
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">
                    Preventive Checkups
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                    25,000+
                  </dd>
                </div>
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">
                    Wellness Goals Achieved
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                    95%
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for better healthcare
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Comprehensive tools and features designed to support your wellness
              journey and preventive care needs.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature Cards */}
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Health Goal Tracking
                </h3>
                <p className="mt-2 text-gray-500">
                  Set and monitor wellness goals including steps, water intake,
                  exercise, and more with visual progress tracking.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Preventive Care Reminders
                </h3>
                <p className="mt-2 text-gray-500">
                  Never miss important checkups with automated reminders for
                  screenings, vaccinations, and routine visits.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  HIPAA Compliant Security
                </h3>
                <p className="mt-2 text-gray-500">
                  Your health data is protected with enterprise-grade security
                  and full HIPAA compliance standards.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Provider Coordination
                </h3>
                <p className="mt-2 text-gray-500">
                  Seamless communication between patients and healthcare
                  providers for better care coordination.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Health Analytics
                </h3>
                <p className="mt-2 text-gray-500">
                  Comprehensive insights and analytics to understand your health
                  patterns and progress over time.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Personalized Health Tips
                </h3>
                <p className="mt-2 text-gray-500">
                  Daily health tips and educational content tailored to your
                  specific health profile and goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to take control of your health?</span>
            <span className="block text-blue-200">
              Start your wellness journey today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
              >
                Get Started
                <Plus className="ml-2 -mr-1 w-5 h-5" />
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav
            className="-mx-5 -my-2 flex flex-wrap justify-center"
            aria-label="Footer"
          >
            <div className="px-5 py-2">
              <a
                href="#"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                About
              </a>
            </div>
            <div className="px-5 py-2">
              <a
                href="#"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                Privacy Policy
              </a>
            </div>
            <div className="px-5 py-2">
              <a
                href="#"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                Terms of Service
              </a>
            </div>
            <div className="px-5 py-2">
              <a
                href="#"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                Contact
              </a>
            </div>
            <div className="px-5 py-2">
              <a
                href="#"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                HIPAA Compliance
              </a>
            </div>
          </nav>
          <div className="mt-8 flex justify-center items-center">
            <Heart className="h-6 w-6 text-blue-600 mr-2" />
            <p className="text-center text-base text-gray-400">
              &copy; 2025 Healthcare Portal. All rights reserved. Built with ❤️
              by NerdNinzas Team.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
