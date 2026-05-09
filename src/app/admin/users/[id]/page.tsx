'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react'

interface UserDetail {
  id: string
  email: string
  fullName: string
  role: string
  emailVerified: boolean
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

interface RoleRequest {
  id: string
  requestedRole: string
  reason: string | null
  status: string
  adminNotes: string | null
  createdAt: string
  reviewedAt: string | null
  reviewer?: {
    fullName: string
    email: string
  }
}

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState<UserDetail | null>(null)
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // Validate session and check admin role
  useEffect(() => {
    async function validateSession() {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login?redirect=/admin/users')
          return
        }

        const data = await response.json()
        if (data.user.role !== 'admin') {
          router.push('/')
          return
        }

        setCurrentUser(data.user)
      } catch (error) {
        router.push('/login?redirect=/admin/users')
      } finally {
        setAuthLoading(false)
      }
    }
    validateSession()
  }, [router])

  useEffect(() => {
    if (!currentUser) return
    loadUserDetails()
  }, [currentUser, userId])

  const loadUserDetails = async () => {
    try {
      const [userResponse, requestsResponse] = await Promise.all([
        fetch(`/api/admin/users/${userId}`),
        fetch(`/api/admin/users/${userId}/role-requests`)
      ])

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData.user)
      }

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        setRoleRequests(requestsData.roleRequests || [])
      }
    } catch (error) {
      console.error('Error loading user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (isActive: boolean) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        loadUserDetails()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setUpdating(false)
    }
  }

  const updateUserRole = async (role: string) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        loadUserDetails()
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    } finally {
      setUpdating(false)
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a75e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-premium">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Don't render if user is not authenticated (will be redirected)
  if (!currentUser) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a75e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-premium-light">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-[#c8a75e] hover:text-[#d4b56d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>
        <div className="glass-effect rounded-2xl p-12 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#f5f3ee] mb-2">User Not Found</h3>
          <p className="text-premium-light">The requested user could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-[#c8a75e] hover:text-[#d4b56d] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      {/* User Header */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#c8a75e] to-[#d4b56d] flex items-center justify-center">
              <User className="w-8 h-8 text-[#0b0f2a]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#f5f3ee] mb-2">
                {user.fullName}
              </h1>
              <div className="flex items-center gap-2 text-premium-light mb-2">
                <Mail className="w-4 h-4" />
                {user.email}
                {user.emailVerified && (
                  <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#c8a75e]" />
                  <span className="text-[#f5f3ee] capitalize">{user.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#aab0d6]" />
                  <span className="text-premium-light">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                user.isActive
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {user.isActive ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Inactive
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[#f5f3ee] mb-4">Account Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                User ID
              </label>
              <p className="text-[#f5f3ee] mt-1 font-mono text-sm">{user.id}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                Role
              </label>
              <select
                value={user.role}
                onChange={(e) => updateUserRole(e.target.value)}
                disabled={updating}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30"
              >
                <option value="user">User</option>
                <option value="editor">Editor</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                Account Status
              </label>
              <div className="mt-2">
                <button
                  onClick={() => updateUserStatus(!user.isActive)}
                  disabled={updating}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                    user.isActive
                      ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                  } disabled:opacity-50`}
                >
                  {user.isActive ? 'Deactivate Account' : 'Activate Account'}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                Last Login
              </label>
              <p className="text-[#f5f3ee] mt-1">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : 'Never logged in'}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#aab0d6] uppercase tracking-wider">
                Last Updated
              </label>
              <p className="text-[#f5f3ee] mt-1">
                {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Role Requests History */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[#f5f3ee] mb-4">Role Requests</h2>
          {roleRequests.length === 0 ? (
            <p className="text-premium-light text-sm">No role requests found</p>
          ) : (
            <div className="space-y-3">
              {roleRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-[#0b0f2a]/40 rounded-xl p-4 border border-[#c8a75e]/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#f5f3ee] capitalize">
                      {request.requestedRole}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        request.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : request.status === 'approved'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  {request.reason && (
                    <p className="text-xs text-premium-light mb-2">{request.reason}</p>
                  )}
                  {request.adminNotes && (
                    <p className="text-xs text-[#c8a75e] italic mb-2">
                      Admin: {request.adminNotes}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-premium-light">
                    <Clock className="w-3 h-3" />
                    {new Date(request.createdAt).toLocaleDateString()}
                    {request.reviewedAt && (
                      <>
                        <span>•</span>
                        <span>
                          Reviewed {new Date(request.reviewedAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                  {request.reviewer && (
                    <p className="text-xs text-premium-light mt-1">
                      Reviewed by: {request.reviewer.fullName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
