'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Shield, Camera, Save, Loader2, Clock, CheckCircle, XCircle, Lock, Key } from 'lucide-react'
import Image from 'next/image'

interface UserData {
  id: string
  email: string
  fullName: string
  role: string
  emailVerified: boolean
  profileImage?: string
}

interface RoleRequest {
  id: string
  requestedRole: string
  reason: string | null
  status: string
  adminNotes: string | null
  createdAt: string
  reviewedAt: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [fullName, setFullName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Role request states
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([])
  const [showRoleRequestForm, setShowRoleRequestForm] = useState(false)
  const [requestedRole, setRequestedRole] = useState('editor')
  const [requestReason, setRequestReason] = useState('')
  const [submittingRequest, setSubmittingRequest] = useState(false)

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login?redirect=/profile')
        return
      }
      const data = await response.json()
      setUser(data.user)
      setFullName(data.user.fullName)
      setImagePreview(data.user.profileImage || null)

      // Load role requests
      loadRoleRequests()
    } catch (error) {
      router.push('/login?redirect=/profile')
    } finally {
      setLoading(false)
    }
  }

  async function loadRoleRequests() {
    try {
      const response = await fetch('/api/user/request-role')
      if (response.ok) {
        const data = await response.json()
        setRoleRequests(data.roleRequests)
      }
    } catch (error) {
      console.error('Error loading role requests:', error)
    }
  }

  async function handleRoleRequest(e: React.FormEvent) {
    e.preventDefault()
    setSubmittingRequest(true)
    setMessage(null)

    try {
      const response = await fetch('/api/user/request-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedRole,
          reason: requestReason,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setShowRoleRequestForm(false)
        setRequestReason('')
        loadRoleRequests()
      } else {
        setMessage({ type: 'error', text: data.error })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to submit role request' })
    } finally {
      setSubmittingRequest(false)
    }
  }

  function getAvailableRoles() {
    if (!user) return []
    const roleHierarchy = ['user', 'editor', 'moderator', 'admin']
    const currentRoleIndex = roleHierarchy.indexOf(user.role)
    return roleHierarchy.slice(currentRoleIndex + 1)
  }

  function canRequestRole() {
    if (!user) return false
    if (user.role === 'admin') return false
    const pendingRequest = roleRequests.find(r => r.status === 'pending')
    return !pendingRequest
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' })
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('fullName', fullName)
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setUser(data.user)
      setImageFile(null)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })

      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setChangingPassword(true)
    setPasswordMessage(null)

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
      setChangingPassword(false)
      return
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: data.message })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' })
      }
    } catch (error: any) {
      setPasswordMessage({ type: 'error', text: 'Failed to change password' })
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a75e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-premium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const initials = user.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#f5f3ee] mb-2">My Profile</h1>
        <p className="text-premium-light">Manage your account information</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="glass-effect rounded-2xl p-6 border border-[#c8a75e]/20">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                {imagePreview ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#c8a75e]">
                    <Image
                      src={imagePreview}
                      alt={user.fullName}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#c8a75e] to-[#d4b56d] flex items-center justify-center text-[#0b0f2a] font-bold text-4xl border-4 border-[#c8a75e]">
                    {initials}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-[#f5f3ee] mb-1">{user.fullName}</h2>
              <p className="text-sm text-premium-light mb-3">{user.email}</p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#c8a75e]/20 text-[#c8a75e] rounded-full text-sm font-semibold">
                <Shield className="w-4 h-4" />
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>

              {user.emailVerified && (
                <div className="mt-3 text-xs text-green-400 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Email Verified
                </div>
              )}
            </div>
          </div>

          {/* Role Request Card */}
          {user.role !== 'admin' && (
            <div className="glass-effect rounded-2xl p-6 border border-[#c8a75e]/20 mt-6">
              <h3 className="text-lg font-bold text-[#f5f3ee] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#c8a75e]" />
                Role Upgrade
              </h3>

              {roleRequests.length > 0 && (
                <div className="space-y-3 mb-4">
                  {roleRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`p-3 rounded-xl border ${
                        request.status === 'pending'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : request.status === 'approved'
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#f5f3ee] capitalize">
                          {request.requestedRole}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                            request.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : request.status === 'approved'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {request.status === 'pending' && <Clock className="w-3 h-3" />}
                          {request.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {request.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {request.status}
                        </span>
                      </div>
                      {request.adminNotes && (
                        <p className="text-xs text-premium-light italic">
                          Admin: {request.adminNotes}
                        </p>
                      )}
                      <p className="text-xs text-premium-light mt-1">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {canRequestRole() && !showRoleRequestForm && (
                <button
                  onClick={() => setShowRoleRequestForm(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] font-semibold rounded-xl hover:shadow-premium transition-all"
                >
                  Request Role Upgrade
                </button>
              )}

              {showRoleRequestForm && (
                <form onSubmit={handleRoleRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-premium mb-2">
                      Select Role
                    </label>
                    <select
                      value={requestedRole}
                      onChange={(e) => setRequestedRole(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e] transition-colors"
                      required
                    >
                      {getAvailableRoles().map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-premium mb-2">
                      Reason for Request
                    </label>
                    <textarea
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e] transition-colors resize-none"
                      placeholder="Why do you need this role?"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submittingRequest}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] font-semibold rounded-xl hover:shadow-premium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingRequest ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRoleRequestForm(false)
                        setRequestReason('')
                      }}
                      className="px-4 py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 text-premium-light rounded-xl hover:bg-[#0b0f2a]/70 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {!canRequestRole() && roleRequests.find(r => r.status === 'pending') && (
                <p className="text-sm text-premium-light text-center">
                  You have a pending role request. Please wait for admin review.
                </p>
              )}

              {user.role === 'admin' && (
                <p className="text-sm text-premium-light text-center">
                  You already have the highest role.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <div className="glass-effect rounded-2xl p-6 border border-[#c8a75e]/20">
            <h3 className="text-xl font-bold text-[#f5f3ee] mb-6">Edit Profile</h3>

            {message && (
              <div
                className={`mb-6 p-4 rounded-xl ${
                  message.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-premium mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e] transition-colors"
                  required
                  minLength={2}
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-premium mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-[#0b0f2a]/30 border border-[#c8a75e]/10 rounded-xl text-premium-light cursor-not-allowed"
                />
                <p className="text-xs text-premium-light mt-1">Email cannot be changed</p>
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-premium mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Account Role
                </label>
                <input
                  type="text"
                  value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  disabled
                  className="w-full px-4 py-3 bg-[#0b0f2a]/30 border border-[#c8a75e]/10 rounded-xl text-premium-light cursor-not-allowed"
                />
              </div>

              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-premium mb-2">
                  <Camera className="w-4 h-4 inline mr-2" />
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-6 py-3 bg-[#c8a75e]/20 hover:bg-[#c8a75e]/30 border border-[#c8a75e]/30 rounded-xl text-[#c8a75e] font-medium cursor-pointer transition-colors"
                  >
                    Choose Image
                  </label>
                  {imageFile && (
                    <span className="text-sm text-premium-light">{imageFile.name}</span>
                  )}
                </div>
                <p className="text-xs text-premium-light mt-1">Max size: 5MB. Formats: JPG, PNG, GIF</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] font-semibold rounded-xl hover:shadow-premium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="glass-effect rounded-2xl p-6 border border-[#c8a75e]/20 mt-6">
            <h3 className="text-xl font-bold text-[#f5f3ee] mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#c8a75e]" />
              Change Password
            </h3>

            {passwordMessage && (
              <div
                className={`mb-6 p-4 rounded-xl ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-premium mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e] transition-colors"
                  required
                  minLength={8}
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-premium mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e] transition-colors"
                  required
                  minLength={8}
                />
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-premium mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-xl text-[#f5f3ee] focus:outline-none focus:border-[#c8a75e] transition-colors"
                  required
                  minLength={8}
                />
              </div>

              {/* Password Requirements */}
              <div className="bg-[#0b0f2a]/30 border border-[#c8a75e]/10 rounded-xl p-4">
                <p className="text-xs font-medium text-premium mb-2">Password Requirements:</p>
                <ul className="text-xs text-premium-light space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={changingPassword}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] font-semibold rounded-xl hover:shadow-premium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
