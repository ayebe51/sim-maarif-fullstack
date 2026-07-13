import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import LoginPage from "./features/auth/LoginPage"
import AppShell from "./components/layout/AppShell"
import DashboardPage from "./features/dashboard/DashboardPage"
import SchoolListPage from "./features/master-data/SchoolListPage"
import SchoolDetailPage from "./features/master-data/SchoolDetailPage"
import TeacherListPage from "./features/master-data/TeacherListPage"
import StudentListPage from "./features/master-data/StudentListPage"
import UserListPage from "./features/users/UserListPage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import SettingsPage from "./features/settings/SettingsPage"
import HeadmasterExpiryPage from "./features/monitoring/HeadmasterExpiryPage"
import ReportPage from "./features/reports/ReportPage"
import KtaGeneratorPage from "./features/kta/KtaGeneratorPage"
import ProtectedLayout from "./components/layout/ProtectedLayout"
import EventsPage from "./features/events/EventsPage"
import CreateEventPage from "./features/events/CreateEventPage"
import EventDetailPage from "./features/events/EventDetailPage"
import CompetitionDetailPage from "./features/events/CompetitionDetailPage"
import PublicVerificationPage from "./features/verification/PublicVerificationPage"
import VerifyTeacherPage from "./features/verification/VerifyTeacherPage"
import VerifyStudentPage from "./features/verification/VerifyStudentPage"

import MutationPage from "./features/mutations/MutationPage"
import SchoolProfilePage from "./features/schools/SchoolProfilePage"
import ChangePasswordPage from "./features/auth/ChangePasswordPage"
import DataAuditPage from '@/features/master-data/DataAuditPage';
import StudentCardPage from "./features/kta/StudentCardPage"
import { PengajuanNuptkPage } from "./features/sdm/PengajuanNuptkPage"
import TargetsPage from "./features/tahfidz/TargetsPage"
import RecordsPage from "./features/tahfidz/RecordsPage"
import ReportsPage from "./features/tahfidz/ReportsPage"
import { PersetujuanNuptkPage } from "./features/sdm/PersetujuanNuptkPage"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { GlobalErrorBoundary } from "./components/common/GlobalErrorBoundary"
import TeacherDashboardPage from "./features/dashboard/TeacherDashboardPage"
import GuardianDashboardPage from "./features/dashboard/GuardianDashboardPage"
import BillingDashboardPage from "./features/billing/BillingDashboardPage"
import SppDashboardPage from "./features/finance/SppDashboardPage"
import InputNilaiPage from "./features/akademik/InputNilaiPage"
import PpdbLandingPage from "./features/ppdb/PpdbLandingPage"
import PpdbAdminDashboard from "./features/ppdb/PpdbAdminDashboard"

// Attendance Module
import QrScannerPage from "./features/attendance/QrScannerPage"
import TeacherAttendancePage from "./features/attendance/TeacherAttendancePage"
import StudentAttendancePage from "./features/attendance/StudentAttendancePage"
import StudentAttendanceReportPage from "./features/attendance/StudentAttendanceReportPage"
import SubjectsPage from "./features/attendance/SubjectsPage"
import ClassesPage from "./features/attendance/ClassesPage"
import LessonSchedulePage from "./features/attendance/LessonSchedulePage"
import AttendanceSettingsPage from "./features/attendance/AttendanceSettingsPage"

// Create a client
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ppdb" element={<PpdbLandingPage />} />
          <Route path="/verify/:id" element={<PublicVerificationPage />} />
          <Route path="/verify/teacher/:nuptk" element={<VerifyTeacherPage />} />
          <Route path="/verify/student/:nisn" element={<VerifyStudentPage />} />
          
          {/* Protected Routes Wrapper */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedLayout>
                  <AppShell>
                    <GlobalErrorBoundary>
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="master/schools" element={<SchoolListPage />} />
                        <Route path="master/schools/:id" element={<SchoolDetailPage />} />
                        <Route path="master/students" element={<StudentListPage />} />
                        <Route path="master/teachers" element={<TeacherListPage />} />
                        <Route path="users" element={<UserListPage />} />
                        <Route path="school/profile" element={<SchoolProfilePage />} />
                        <Route path="audit" element={<DataAuditPage />} />
                        <Route path="finance/spp" element={<SppDashboardPage />} />
                        <Route path="ppdb" element={<PpdbAdminDashboard />} />
                        <Route path="billing" element={<BillingDashboardPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="change-password" element={<ChangePasswordPage />} />
                        <Route path="monitoring/headmasters" element={<HeadmasterExpiryPage />} />
                        <Route path="reports" element={<ReportPage />} />
                        <Route path="kta" element={<KtaGeneratorPage />} />
                        <Route path="student-card" element={<StudentCardPage />} />
                        <Route path="events" element={<EventsPage />} />
                        <Route path="events/new" element={<CreateEventPage />} />
                        <Route path="events/:id" element={<EventDetailPage />} />
                        <Route path="competitions/:competitionId" element={<CompetitionDetailPage />} />
                        <Route path="sdm/nuptk/pengajuan" element={<PengajuanNuptkPage />} />
                        <Route path="sdm/nuptk/persetujuan" element={<PersetujuanNuptkPage />} />

                        <Route path="mutations" element={<MutationPage />} />

                        {/* Tahfidz Module */}
                        <Route path="tahfidz/targets" element={<TargetsPage />} />
                        <Route path="tahfidz/records" element={<RecordsPage />} />
                        <Route path="tahfidz/reports" element={<ReportsPage />} />

                        {/* Attendance Module */}
                        <Route path="attendance/scanner" element={<QrScannerPage />} />
                        <Route path="attendance/teachers" element={<TeacherAttendancePage />} />
                        <Route path="attendance/students" element={<StudentAttendancePage />} />
                        <Route path="attendance/report" element={<StudentAttendanceReportPage />} />
                        <Route path="attendance/subjects" element={<SubjectsPage />} />
                        <Route path="attendance/classes" element={<ClassesPage />} />
                        <Route path="attendance/schedule" element={<LessonSchedulePage />} />
                        <Route path="attendance/settings" element={<AttendanceSettingsPage />} />
                      </Routes>
                    </GlobalErrorBoundary>
                  </AppShell>
              </ProtectedLayout>
            }
          />

          {/* Teacher Routes Wrapper */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedLayout>
                  <AppShell>
                    <GlobalErrorBoundary>
                      <Routes>
                        <Route path="/" element={<TeacherDashboardPage />} />
                        <Route path="attendance/scanner" element={<QrScannerPage />} />
                        <Route path="tahfidz/records" element={<RecordsPage />} />
                        <Route path="tahfidz/targets" element={<TargetsPage />} />
                        <Route path="akademik/nilai" element={<InputNilaiPage />} />
                      </Routes>
                    </GlobalErrorBoundary>
                  </AppShell>
              </ProtectedLayout>
            }
          />

          {/* Guardian Routes Wrapper */}
          <Route
            path="/guardian/*"
            element={
              <ProtectedLayout>
                  <AppShell>
                    <GlobalErrorBoundary>
                      <Routes>
                        <Route path="/" element={<GuardianDashboardPage />} />
                      </Routes>
                    </GlobalErrorBoundary>
                  </AppShell>
              </ProtectedLayout>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
