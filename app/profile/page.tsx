"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Pill,
  Activity,
  CheckCircle,
  Heart,
  MapPin,
  Edit2,
  Save,
  X
} from "lucide-react";
import { Navbar } from "../components/Navbar";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    allergies: "",
    medications: "",
    conditions: "",
    bloodType: "",
    height: "",
    weight: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      if (response.ok) {
        setUserData(data.user);
        setFormData({
          phoneNumber: data.user.phoneNumber || "",
          allergies: data.user.medicalInfo?.allergies?.join(", ") || "",
          medications: data.user.medicalInfo?.medications?.join(", ") || "",
          conditions: data.user.medicalInfo?.conditions?.join(", ") || "",
          bloodType: data.user.medicalInfo?.bloodType || "",
          height: data.user.medicalInfo?.height || "",
          weight: data.user.medicalInfo?.weight || ""
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          medicalInfo: {
            allergies: formData.allergies
              .split(",")
              .map((a: string) => a.trim())
              .filter((a: string) => a),
            medications: formData.medications
              .split(",")
              .map((m: string) => m.trim())
              .filter((m: string) => m),
            conditions: formData.conditions
              .split(",")
              .map((c: string) => c.trim())
              .filter((c: string) => c),
            bloodType: formData.bloodType || undefined,
            height: formData.height ? parseFloat(formData.height) : undefined,
            weight: formData.weight ? parseFloat(formData.weight) : undefined
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess(true);
      setIsEditing(false);
      fetchUserData();
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || !userData) return null;

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your personal and health information</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="ml-3 text-sm text-green-800">Profile updated successfully!</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-blue-100">{userData.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserData();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 inline mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </label>
                    <p className="text-gray-900">{userData.email}</p>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    <p className="text-gray-900">{userData.phoneNumber || "Not provided"}</p>
                  </div>

                  {userData.dateOfBirth && (
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date of Birth
                      </label>
                      <p className="text-gray-900">
                        {new Date(userData.dateOfBirth).toLocaleDateString()} (Age: {calculateAge(userData.dateOfBirth)})
                      </p>
                    </div>
                  )}

                  {userData.medicalInfo?.bloodType && (
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Heart className="w-4 h-4 mr-2" />
                        Blood Type
                      </label>
                      <p className="text-gray-900">{userData.medicalInfo.bloodType}</p>
                    </div>
                  )}

                  {userData.medicalInfo?.height && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2">Height</label>
                      <p className="text-gray-900">{userData.medicalInfo.height} cm</p>
                    </div>
                  )}

                  {userData.medicalInfo?.weight && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2">Weight</label>
                      <p className="text-gray-900">{userData.medicalInfo.weight} kg</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                        Allergies
                      </label>
                      {userData.medicalInfo?.allergies && userData.medicalInfo.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userData.medicalInfo.allergies.map((allergy: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">None reported</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Pill className="w-4 h-4 mr-2 text-blue-500" />
                        Current Medications
                      </label>
                      {userData.medicalInfo?.medications && userData.medicalInfo.medications.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userData.medicalInfo.medications.map((med: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {med}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">None reported</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Activity className="w-4 h-4 mr-2 text-yellow-500" />
                        Medical Conditions
                      </label>
                      {userData.medicalInfo?.conditions && userData.medicalInfo.conditions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userData.medicalInfo.conditions.map((condition: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">None reported</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 234 567 8900"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="170"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AlertCircle className="inline w-4 h-4 mr-1 text-red-500" />
                    Allergies
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Penicillin, Peanuts, Shellfish"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Pill className="inline w-4 h-4 mr-1 text-blue-500" />
                    Current Medications
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Aspirin, Metformin, Lisinopril"
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Activity className="inline w-4 h-4 mr-1 text-yellow-500" />
                    Medical Conditions
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Diabetes, Hypertension, Asthma"
                    value={formData.conditions}
                    onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Privacy Protected:</strong> Your health information is encrypted and HIPAA compliant. Only authorized healthcare providers you've approved can access your medical information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
