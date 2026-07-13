import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  School, 
  CheckCircle, 
  LayoutDashboard,
  Calendar,
  Trophy,
  BookOpen,
  UserCheck
} from "lucide-react"
import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardOperator from "./components/DashboardOperator"

export default function DashboardPage() {
  const [user] = useState<any>(() => {
    const u = localStorage.getItem("user")
    return u ? JSON.parse(u) : null
  })

  const convexStats = useQuery(api.dashboard.getStats)

  // Redirect for operators if needed, or we can use the same dashboard
  if (user && user.role === 'operator') {
     return <DashboardOperator />
  }

  const stats = convexStats ? {
    schoolCount: convexStats.totalSchools || 0,
    teacherCount: convexStats.totalTeachers || 0,
    studentCount: convexStats.totalStudents || 0,
  } : {
    schoolCount: 0,
    teacherCount: 0,
    studentCount: 0,
  }

  // Placeholder data for Tahfidz & Absensi Trends
  const attendanceTrend = [
    { day: "Sen", hadir: 420 },
    { day: "Sel", hadir: 435 },
    { day: "Rab", hadir: 410 },
    { day: "Kam", hadir: 440 },
    { day: "Jum", hadir: 455 },
    { day: "Sab", hadir: 410 },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 relative z-10 mb-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100/50 rounded-xl shadow-inner border border-emerald-200/50">
                      <LayoutDashboard className="w-7 h-7 text-emerald-600" />
                  </div>
                  Dashboard Utama
              </h1>
              <p className="text-slate-500 mt-2 flex items-center gap-2">
                  Selamat datang kembali, <span className="font-bold text-emerald-800">{user?.name || "Admin"}</span>
              </p>
           </div>
         </div>
      </div>

      {/* OVERVIEW STATS (GRID 4) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        <Card className="border-0 shadow-sm bg-white overflow-hidden relative rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-slate-500">Siswa Aktif</span>
                    <span className="text-3xl font-extrabold text-slate-800">{stats.studentCount}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <Users className="h-6 w-6 text-emerald-600" />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white overflow-hidden relative rounded-2xl">
          <CardContent className="p-6">
             <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-slate-500">Guru Hadir</span>
                    <span className="text-3xl font-extrabold text-purple-600">92%</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                    <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white overflow-hidden relative rounded-2xl">
          <CardContent className="p-6">
             <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-slate-500">Siswa Hadir</span>
                    <span className="text-3xl font-extrabold text-blue-600">84%</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white overflow-hidden relative rounded-2xl">
          <CardContent className="p-6">
             <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-slate-500">Setoran</span>
                    <span className="text-3xl font-extrabold text-amber-600">124</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                    <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

       {/* TAHFIDZ & ATTENDANCE CHARTS */}
       <div className="grid gap-6 md:grid-cols-2 mt-8">
         <Card className="border-0 shadow-sm bg-white rounded-2xl">
           <CardHeader>
             <CardTitle className="text-slate-800 font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Tren Kehadiran Siswa (Mingguan)
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="hadir" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHadir)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
           </CardContent>
         </Card>

         <Card className="border-0 shadow-sm bg-white rounded-2xl">
           <CardHeader>
             <CardTitle className="text-slate-800 font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Pencapaian Target Tahfidz
             </CardTitle>
           </CardHeader>
           <CardContent className="flex flex-col justify-center gap-6 h-[250px]">
             <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-600">Juz 30 Selesai</span>
                  <span className="text-emerald-600">45 Siswa</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-600">Juz 29 Selesai</span>
                  <span className="text-blue-600">20 Siswa</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '20%' }}></div>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-600">Juz 1 Selesai</span>
                  <span className="text-amber-600">12 Siswa</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-amber-500 h-3 rounded-full" style={{ width: '12%' }}></div>
                </div>
             </div>
           </CardContent>
         </Card>
       </div>
    </div>
  )
}
