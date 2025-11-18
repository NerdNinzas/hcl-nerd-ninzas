"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  Clock,
  Users,
  Activity,
  Heart,
  Pill,
  AlertCircle,
  CheckCircle,
  Calendar
} from "lucide-react";

export default function Onboarding() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Patient form data
  const [patientData, setPatientData] = useState({
    dateOfBirth: "",
    phoneNumber: "",
    allergies: "",
    medications: "",
    conditions: ""
  });

  // Provider form data
  const [providerData, setProviderData] = useState({
    specialty: "",
    licenseNumber: "",
    clinic: "",
    bio: "",
    maxPatients: 10,
    availableHours: [
      { day: "Monday", startTime: "09:00", endTime: "17:00", enabled: false },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00", enabled: false },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00", enabled: false },
      { day: "Thursday", startTime: "09:00", endTime: "17:00", enabled: false },
      { day: "Friday", startTime: "09:00", endTime: "17:00", enabled: false }
    ]
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) return null;

  const isProvider = session.user?.role === "provider";

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const allergiesArray = patientData.allergies
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);
      const medicationsArray = patientData.medications
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m);
      const conditionsArray = patientData.conditions
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);

      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dateOfBirth: patientData.dateOfBirth,
          phoneNumber: patientData.phoneNumber,
          medicalInfo: {
            allergies: allergiesArray,
            medications: medicationsArray,
            conditions: conditionsArray
          },
          profileCompleted: true
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to complete profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const enabledHours = providerData.availableHours
        .filter((h) => h.enabled)
        .map(({ enabled, ...rest }) => rest);

      if (enabledHours.length === 0) {
        throw new Error("Please select at least one available day");
      }

      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          specialty: providerData.specialty,
          licenseNumber: providerData.licenseNumber,
          clinic: providerData.clinic,
          bio: providerData.bio,
          maxPatients: providerData.maxPatients,
          availableHours: enabledHours,
          profileCompleted: true
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/provider");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to complete profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvailableHour = (index: number, field: string, value: any) => {
    const newHours = [...providerData.availableHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setProviderData({ ...providerData, availableHours: newHours });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-gray-600">
            {isProvider
              ? "Tell us about your practice and availability"
              : "Help us provide you with better healthcare"}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  Profile completed successfully! Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {isProvider ? (
            // Provider Form
            <form onSubmit={handleProviderSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-2" />
                    Specialty *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Cardiology, Pediatrics"
                    value={providerData.specialty}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        specialty: e.target.value
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Medical License Number"
                    value={providerData.licenseNumber}
                    onChange={(e) =>
                      setProviderData({
                        ...providerData,
                        licenseNumber: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic/Hospital Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Where do you practice?"
                  value={providerData.clinic}
                  onChange={(e) =>
                    setProviderData({ ...providerData, clinic: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell patients about yourself and your experience..."
                  value={providerData.bio}
                  onChange={(e) =>
                    setProviderData({ ...providerData, bio: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-2" />
                  Maximum Patients (7-10) *
                </label>
                <input
                  type="number"
                  required
                  min="7"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={providerData.maxPatients}
                  onChange={(e) =>
                    setProviderData({
                      ...providerData,
                      maxPatients: parseInt(e.target.value)
                    })
                  }
                />
              </div>

              {/* Available Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  <Clock className="inline w-4 h-4 mr-2" />
                  Available Hours *
                </label>
                <div className="space-y-3">
                  {providerData.availableHours.map((schedule, index) => (
                    <div
                      key={schedule.day}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) =>
                          updateAvailableHour(index, "enabled", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="w-24 font-medium text-gray-700">
                        {schedule.day}
                      </span>
                      <input
                        type="time"
                        disabled={!schedule.enabled}
                        value={schedule.startTime}
                        onChange={(e) =>
                          updateAvailableHour(index, "startTime", e.target.value)
                        }
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        disabled={!schedule.enabled}
                        value={schedule.endTime}
                        onChange={(e) =>
                          updateAvailableHour(index, "endTime", e.target.value)
                        }
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Completing Profile...
                  </div>
                ) : (
                  "Complete Profile"
                )}
              </button>
            </form>
          ) : (
            // Patient Form
            <form onSubmit={handlePatientSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={patientData.dateOfBirth}
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        dateOfBirth: e.target.value
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 234 567 8900"
                    value={patientData.phoneNumber}
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        phoneNumber: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="inline w-4 h-4 mr-2" />
                  Allergies
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Penicillin, Peanuts (comma separated)"
                  value={patientData.allergies}
                  onChange={(e) =>
                    setPatientData({ ...patientData, allergies: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Pill className="inline w-4 h-4 mr-2" />
                  Current Medications
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Aspirin, Metformin (comma separated)"
                  value={patientData.medications}
                  onChange={(e) =>
                    setPatientData({
                      ...patientData,
                      medications: e.target.value
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="inline w-4 h-4 mr-2" />
                  Medical Conditions
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Diabetes, Hypertension (comma separated)"
                  value={patientData.conditions}
                  onChange={(e) =>
                    setPatientData({ ...patientData, conditions: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Completing Profile...
                  </div>
                ) : (
                  "Complete Profile"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-blue-400" />
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Privacy Guaranteed:</strong> Your information is
                encrypted and HIPAA compliant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

