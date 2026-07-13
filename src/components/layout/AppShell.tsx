import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  FileText,
  LayoutDashboard,
  Menu,
  School,
  Settings,
  User,
  LogOut,
  Users,
  UserPlus,
  AlertTriangle,
  FileBarChart,
  Trophy,
  Crown,
  Gavel,
  Archive,
  ArrowRightLeft,
  ChevronDown,
  CreditCard,
  Stethoscope,
  FileEdit,
  ScanLine,
  GraduationCap,
  BookOpen,
  ClipboardList,
  UserCheck,
} from "lucide-react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { NotificationDropdown } from "@/components/common/NotificationDropdown"
import { Toaster } from "sonner"

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // Get user role for conditional menu visibility
  const userStr = localStorage.getItem("user");
  const userRole = userStr ? JSON.parse(userStr)?.role : null;
  const isSuperAdmin = userRole === "super_admin";

  // Navigation Groups
  let navGroups = [
    {
      title: "Master Data",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Profil Lembaga", href: "/dashboard/master/schools", icon: School },
        { label: "Data Guru & Tendik", href: "/dashboard/master/teachers", icon: Users },
        { label: "Data Siswa", href: "/dashboard/master/students", icon: User },
      ]
    },
    {
      title: "Absensi",
      items: [
        { label: "Scanner QR", href: "/dashboard/attendance/scanner", icon: ScanLine },
        { label: "Kehadiran Guru", href: "/dashboard/attendance/teachers", icon: UserCheck },
        { label: "Kehadiran Siswa", href: "/dashboard/attendance/students", icon: Users },
        { label: "Laporan Kehadiran", href: "/dashboard/attendance/report", icon: FileBarChart },
        { label: "Mata Pelajaran", href: "/dashboard/attendance/subjects", icon: BookOpen },
        { label: "Kelas / Rombel", href: "/dashboard/attendance/classes", icon: School },
        { label: "Jadwal Jam", href: "/dashboard/attendance/schedule", icon: ClipboardList },
        { label: "Pengaturan Absensi", href: "/dashboard/attendance/settings", icon: Settings },
      ]
    },
    {
      title: "Tahfidz",
      items: [
        { label: "Target Hafalan", href: "/dashboard/tahfidz/targets", icon: Trophy },
        { label: "Setoran / Penilaian", href: "/dashboard/tahfidz/records", icon: FileEdit },
        { label: "Laporan Tahfidz", href: "/dashboard/tahfidz/reports", icon: FileBarChart },
      ]
    },
    {
      title: "Kesiswaan & PPDB",
      items: [
        { label: "Pendaftar PPDB", href: "/dashboard/ppdb", icon: UserPlus },
      ]
    },
    {
      title: "Keuangan",
      items: [
        { label: "Manajemen SPP", href: "/dashboard/finance/spp", icon: CreditCard },
      ]
    },
    {
      title: "Administrasi Sistem",
      items: [
        { label: "Manajemen User", href: "/dashboard/users", icon: Users },
        { label: "Manajemen Billing", href: "/dashboard/billing", icon: CreditCard },
        { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
      ]
    }
  ];

  if (userRole === "teacher") {
     navGroups = [
       {
         title: "Utama",
         items: [
           { label: "Dashboard Guru", href: "/teacher", icon: LayoutDashboard },
         ]
       },
       {
         title: "Absensi",
         items: [
           { label: "Scanner QR Siswa", href: "/teacher/attendance/scanner", icon: ScanLine },
         ]
       },
       {
         title: "Tahfidz",
         items: [
           { label: "Setoran Hafalan", href: "/teacher/tahfidz/records", icon: FileEdit },
           { label: "Target Capaian", href: "/teacher/tahfidz/targets", icon: Trophy },
         ]
       },
       {
         title: "Akademik & E-Rapor",
         items: [
           { label: "Input Nilai Siswa", href: "/teacher/akademik/nilai", icon: BookOpen },
         ]
       }
     ];
  } else if (userRole === "guardian") {
     navGroups = [
       {
         title: "Utama",
         items: [
           { label: "Portal Wali Murid", href: "/guardian", icon: LayoutDashboard },
         ]
       }
     ];
   }
  return (
    <div className="flex h-screen w-full bg-slate-50 relative overflow-hidden print:block print:h-auto print:overflow-visible">
      {/* Subtle Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[140px] pointer-events-none print:hidden" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[140px] pointer-events-none print:hidden" />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-amber-400/10 rounded-full blur-[140px] pointer-events-none print:hidden" />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-white/70 backdrop-blur-2xl border-r border-white/60 shadow-[4px_0_24px_rgba(16,185,129,0.05)] transition-all duration-300 ease-in-out md:static print:hidden",
          sidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full md:w-0 md:translate-x-0 md:opacity-0 md:w-[0px] md:overflow-hidden"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center border-b border-slate-100 px-6 bg-gradient-to-r from-emerald-600/5 to-transparent">
          <Link to="/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tight text-slate-800">
            <div className="p-1.5 bg-white rounded-xl shadow-sm border border-emerald-100">
                <School className="h-8 w-8 text-emerald-600" />
            </div>
            <div className={cn("flex flex-col justify-center", !sidebarOpen && "hidden")}>
              <span className="leading-none text-emerald-800 font-extrabold pb-1">EduSaaS</span>
              <span className="text-[10px] leading-none text-emerald-600/70 font-medium tracking-wide">EduSaaS</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-2 px-3">
            {navGroups.map((group, groupIndex) => {
              // Filter items inside the group based on RBAC
              const userStr = localStorage.getItem("user")
              const user = userStr ? JSON.parse(userStr) : null
              const userRole = user?.role || ""

              const visibleItems = group.items.filter(item => {
                  // 1. ADMIN & OPERATOR (Settings access)
                  if (item.label === "Pengaturan") {
                      return ["super_admin", "admin_yayasan", "admin", "operator"].includes(userRole);
                  }

                  // 2. YAYASAN & SUPER ADMIN EXCLUSIVE
                  if (["Manajemen User", "Manajemen Billing"].includes(item.label)) {
                      return ["super_admin", "admin_yayasan", "admin"].includes(userRole);
                  }

                 // 3. OPERATOR (DEFAULT)
                 return true;
              })

              if (visibleItems.length === 0) return null

              const isDefaultOpen = group.title === "Master Data"

              return (
                <Collapsible 
                  key={groupIndex} 
                  defaultOpen={isDefaultOpen} 
                  className="group/collapsible"
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground">
                    {group.title}
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=closed]/collapsible:-rotate-90" />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-1 pt-1 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                    {visibleItems.map((item, index) => {
                      const isExactMatch = location.pathname === item.href
                      const isChildRoute = location.pathname.startsWith(item.href + '/') && item.href !== '/dashboard'
                      const isActive = isExactMatch || isChildRoute

                      return (
                        <Link
                          key={index}
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                            isActive
                              ? "bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-800 font-bold shadow-sm border border-emerald-200/60 ring-1 ring-emerald-500/10"
                              : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      )
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
               <User className="h-4 w-4 text-gray-500"/>
            </div>
            <div className="flex flex-col overflow-hidden">
                {(() => {
                  const userStr = localStorage.getItem("user")
                  const user = userStr ? JSON.parse(userStr) : null
                  return (
                    <>
                      <span className="truncate text-sm font-medium">{user?.name || "User"}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email || ""}</span>
                    </>
                  )
                })()}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 w-full justify-start text-muted-foreground hover:text-red-500"
            onClick={() => {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                window.location.href = "/login"
            }}
          >
             <LogOut className="mr-2 h-4 w-4"/> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden relative z-10 w-full max-w-full print:block print:overflow-visible print:h-auto">
        {/* Header */}
        <header className="flex h-20 items-center gap-4 px-6 bg-white/40 backdrop-blur-md border-b border-white/50 sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.02)] print:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex hover:bg-emerald-50 hover:text-emerald-700">
             <Menu className="h-5 w-5"/>
             <span className="sr-only">Toggle Sidebar</span>
          </Button>
           {/* Mobile Menu Toggle (reusing same logic roughly) */}
           <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
             <Menu className="h-5 w-5"/>
          </Button>
          
          <div className="ml-auto flex items-center gap-2">
             <NotificationDropdown />
             <span className="text-sm font-medium text-muted-foreground border-l pl-4 ml-2">
               Tahun Ajaran: {(() => {
                 const now = new Date()
                 const year = now.getFullYear()
                 const month = now.getMonth() + 1 // 0-indexed
                 // Academic year starts in July (month 7)
                 // If Jan-June: show (year-1)/(year)
                 // If Jul-Dec: show (year)/(year+1)
                 return month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`
               })()}
             </span>
          </div>
        </header>

        {/* Main Content View with Scroll */}
        <main className="flex-1 overflow-y-auto p-6 print:p-0 print:overflow-visible print:block print:h-auto">
           {children}
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </div>
  )
}
