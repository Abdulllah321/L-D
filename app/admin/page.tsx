"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Lock,
  Menu,
  X as XIcon,
  Book,
  Activity,
  MousePointer2,
  Globe,
  Smartphone,
  Users,
  Clock,
  ArrowUpRight,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsEvent {
  id: string;
  type: 'view' | 'click' | 'convert';
  target: string;
  timestamp: Date;
  user: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Real-time Data State
  const [activeUsers, setActiveUsers] = useState(0);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();

        if (data.error) return;

        setActiveUsers(data.activeUsers);
        setTrafficData(data.trafficData);
        setRecentEvents(data.recentEvents);
        setTopPages(data.topPages);
        setTotalClicks(data.totalClicks);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };

    fetchAnalytics(); // Initial fetch
    const interval = setInterval(fetchAnalytics, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (response.ok) {
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        setIsAuthenticated(false);
        setShowLogin(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setShowLogin(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        const data = await response.json();
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      setShowLogin(true);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Admin Login</h1>
          <p className="text-center text-gray-600 mb-8">Access the analytics dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input type="text" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" required />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">Login</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: sidebarOpen ? 0 : -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className="fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 flex flex-col"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <XIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Overiew</h3>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 font-medium">
              <LayoutDashboard className="w-5 h-5" />
              <span>Real-time</span>
            </button>
            <a href="/admin/designations" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors mt-1">
              <Book className="w-5 h-5" />
              <span>Designations</span>
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <h2 className="text-xl font-semibold text-gray-900">Live Dashboard</h2>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: <span className="font-mono text-gray-700">Just now</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Users</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{activeUsers}</h3>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                <span>Live now</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Avg. Session</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">--:--</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span>Calculating...</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Bounce Rate</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">--%</h3>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span>Calculating...</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalClicks}</h3>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <MousePointer2 className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span>Today's aggregate</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Traffic Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Real-time Traffic (Last 30m)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Top Pages</h3>
              <div className="space-y-4">
                {topPages.length > 0 ? (
                  topPages.map((page) => (
                    <div key={page.name} className="relative">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 truncate max-w-[180px]" title={page.name}>{page.name}</span>
                        <span className="text-gray-500">{page.visits} views</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(page.visits / (topPages[0]?.visits || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No page data yet.</p>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Device Usage</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Smartphone className="w-5 h-5 text-gray-600 mb-2" />
                    <span className="text-xs text-gray-500">Mobile/Tablet</span>
                    <span className="font-bold text-gray-900">--%</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-gray-600 mb-2" />
                    <span className="text-xs text-gray-500">Desktop</span>
                    <span className="font-bold text-gray-900">--%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Events Feed */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h3 className="text-lg font-bold text-gray-900">Live Activity Feed</h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                LIVE
              </span>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {recentEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-teal-500"
                  >
                    <div className={`p-2 rounded-full ${event.type === 'click' ? 'bg-orange-100 text-orange-600' :
                      event.type === 'convert' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                      {event.type === 'click' ? <MousePointer2 className="w-4 h-4" /> :
                        event.type === 'convert' ? <Zap className="w-4 h-4" /> :
                          <Activity className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        <span className="font-bold">{event.user}</span> {event.type === 'view' ? 'viewed' : event.type} <span className="text-teal-600">{event.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {recentEvents.length === 0 && (
                <p className="text-gray-500 text-center py-8">Waiting for live events...</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
