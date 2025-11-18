"use client";

import {
  Heart,
  Shield,
  Users,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function PublicHealthInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                HealthCare Portal
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/auth/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Public Health Information Center
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Your trusted source for reliable health information, wellness tips,
            and healthcare guidance. Empowering communities with knowledge for
            better health outcomes.
          </p>
        </div>
      </section>

      {/* Health Topics Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Health Information Topics
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Preventive Care */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <Shield className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Preventive Care
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Annual health screenings
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Vaccination schedules
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Cancer prevention
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Heart health monitoring
                </li>
              </ul>
            </div>

            {/* Mental Health */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <Heart className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Mental Health & Wellness
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  Stress management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  Anxiety & depression support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  Mindfulness practices
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  Work-life balance
                </li>
              </ul>
            </div>

            {/* Nutrition */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <BookOpen className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Nutrition & Diet
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                  Balanced meal planning
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                  Dietary guidelines
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                  Weight management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                  Special diets & allergies
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Health Guidelines */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Essential Health Guidelines
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Daily Health Tips */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Daily Health Habits
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Stay Hydrated</h4>
                    <p className="text-gray-600">
                      Drink 8-10 glasses of water daily for optimal body
                      function
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Regular Exercise
                    </h4>
                    <p className="text-gray-600">
                      At least 30 minutes of moderate activity, 5 days a week
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Quality Sleep</h4>
                    <p className="text-gray-600">
                      7-9 hours of sleep for adults, maintain consistent
                      schedule
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Balanced Diet</h4>
                    <p className="text-gray-600">
                      Include fruits, vegetables, whole grains, and lean
                      proteins
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Signs */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                When to Seek Medical Care
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Chest Pain</h4>
                    <p className="text-gray-600">
                      Persistent or severe chest pain, especially with shortness
                      of breath
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">High Fever</h4>
                    <p className="text-gray-600">
                      Fever above 103°F (39.4°C) or persistent fever for 3+ days
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Severe Headaches
                    </h4>
                    <p className="text-gray-600">
                      Sudden, severe headaches with vision changes or confusion
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Difficulty Breathing
                    </h4>
                    <p className="text-gray-600">
                      Shortness of breath at rest or with minimal activity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Emergency Health Resources
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center border-l-4 border-red-500">
              <Phone className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Emergency Services
              </h3>
              <p className="text-3xl font-bold text-red-600">911</p>
              <p className="text-gray-600">Life-threatening emergencies</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center border-l-4 border-blue-500">
              <Phone className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Poison Control
              </h3>
              <p className="text-2xl font-bold text-blue-600">1-800-222-1222</p>
              <p className="text-gray-600">Poisoning emergencies</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center border-l-4 border-purple-500">
              <Phone className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mental Health Crisis
              </h3>
              <p className="text-2xl font-bold text-purple-600">988</p>
              <p className="text-gray-600">Suicide & Crisis Lifeline</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="py-16" id="privacy-policy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Privacy Policy
          </h2>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            {/* Introduction */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Our Commitment to Your Privacy
              </h3>
              <p className="text-gray-600 leading-relaxed">
                HealthCare Portal is committed to protecting your privacy and
                ensuring the security of your personal health information (PHI).
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information in compliance with HIPAA and other
                applicable laws.
              </p>
            </div>

            {/* Information Collection */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Information We Collect
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  Personal identification information (name, email, phone
                  number)
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  Health information and medical records
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  Appointment and treatment history
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  Insurance and billing information
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  Usage data and system logs for security purposes
                </li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                How We Use Your Information
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  Providing healthcare services and treatment coordination
                </li>
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  Processing payments and insurance claims
                </li>
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  Scheduling appointments and sending reminders
                </li>
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  Quality improvement and healthcare operations
                </li>
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  Compliance with legal and regulatory requirements
                </li>
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Data Security Measures
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    End-to-end encryption for all data transmission
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    Secure cloud storage with regular backups
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    Multi-factor authentication for user accounts
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    Regular security audits and vulnerability assessments
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    Staff training on HIPAA compliance and data protection
                  </li>
                </ul>
              </div>
            </div>

            {/* Your Rights */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Your Privacy Rights
              </h3>
              <p className="text-gray-600 mb-4">
                Under HIPAA and applicable privacy laws, you have the right to:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  Access and obtain copies of your health information
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  Request corrections to your health information
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  Request restrictions on how your information is used
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  File a complaint if you believe your rights have been violated
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  Request an accounting of disclosures of your information
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Our Privacy Officer
              </h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-2" />
                  <span>privacy@healthcareportal.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-2" />
                  <span>1-800-PRIVACY (1-800-774-8229)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <span>123 Healthcare Blvd, Medical City, HC 12345</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 pt-4 border-t">
              <p>Last updated: November 18, 2025</p>
              <p>
                This Privacy Policy may be updated periodically. We will notify
                you of any significant changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">HealthCare Portal</span>
              </div>
              <p className="text-gray-400">
                Empowering healthier communities through accessible healthcare
                information and services.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signin"
                    className="hover:text-white transition-colors"
                  >
                    Patient Portal
                  </Link>
                </li>
                <li>
                  <Link
                    href="#privacy-policy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Health Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="https://www.cdc.gov"
                    className="hover:text-white transition-colors"
                  >
                    CDC Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.who.int"
                    className="hover:text-white transition-colors"
                  >
                    WHO Information
                  </a>
                </li>
                <li>
                  <a
                    href="https://medlineplus.gov"
                    className="hover:text-white transition-colors"
                  >
                    MedlinePlus
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>24/7 Emergency Line</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>1-800-HEALTH-1</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>info@healthcareportal.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 HealthCare Portal. All rights reserved. | HIPAA
              Compliant | SOC 2 Certified
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
