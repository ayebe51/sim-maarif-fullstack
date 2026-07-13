import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Teachers table
  teachers: defineTable({
    nuptk: v.any(),
    nomorIndukPegawai: v.optional(v.any()),
    nama: v.any(),
    nip: v.optional(v.any()),
    jenisKelamin: v.optional(v.any()),
    tempatLahir: v.optional(v.any()),
    tanggalLahir: v.optional(v.any()),
    pendidikanTerakhir: v.optional(v.any()),
    mapel: v.optional(v.any()),
    unitKerja: v.optional(v.any()), 
    schoolId: v.optional(v.id("schools")), // STRICT RESTORED
    provinsi: v.optional(v.string()),
    kabupaten: v.optional(v.string()),
    kecamatan: v.optional(v.any()),
    kelurahan: v.optional(v.string()),
    status: v.optional(v.any()),
    tmt: v.optional(v.any()), 
    isCertified: v.optional(v.any()),
    phoneNumber: v.optional(v.any()),
    email: v.optional(v.any()),
    isActive: v.optional(v.any()),
    isVerified: v.optional(v.any()), 
    isSkGenerated: v.optional(v.any()), 
    pdpkpnu: v.optional(v.any()),
    photoId: v.optional(v.any()),
    suratPermohonanUrl: v.optional(v.any()), 
    nomorSuratPermohonan: v.optional(v.any()),
    tanggalSuratPermohonan: v.optional(v.any()),
    ktaNumber: v.optional(v.any()),
    createdAt: v.any(),
    updatedAt: v.any(),
  })
    .index("by_nuptk", ["nuptk"])
    .index("by_nim", ["nomorIndukPegawai"])
    .index("by_unit", ["unitKerja"])
    .index("by_kecamatan", ["kecamatan"])
    .index("by_active", ["isActive"])
    .index("by_updatedAt", ["updatedAt"])
    .index("by_schoolId", ["schoolId"]) 
    // .index("by_schoolId", ["schoolId"]) 
    .index("by_school_active", ["schoolId", "isActive"]) 
    .searchIndex("search_teacher", {
      searchField: "nama",
      filterFields: ["isActive", "unitKerja", "kecamatan"], 
    }),

  // Students table
  students: defineTable({
    nisn: v.any(),
    nik: v.optional(v.any()), 
    nomorIndukPegawai: v.optional(v.any()),
    nama: v.any(),
    jenisKelamin: v.optional(v.any()),
    tempatLahir: v.optional(v.any()),
    tanggalLahir: v.optional(v.any()),
    namaAyah: v.optional(v.any()),
    namaIbu: v.optional(v.any()), 
    alamat: v.optional(v.any()),
    provinsi: v.optional(v.string()),
    kabupaten: v.optional(v.string()),
    kecamatan: v.optional(v.any()),
    kelurahan: v.optional(v.string()),
    namaSekolah: v.optional(v.any()),
    npsn: v.optional(v.any()), 
    kelas: v.optional(v.any()),
    nomorTelepon: v.optional(v.any()),
    namaWali: v.optional(v.any()),
    photoId: v.optional(v.any()),
    isVerified: v.optional(v.any()),
    qrCode: v.optional(v.any()),
    status: v.optional(v.string()), // Aktif, Lulus, Keluar
    lastTransitionAt: v.optional(v.number()), // Marker for batch processing
    createdAt: v.any(),
    updatedAt: v.any(),
  })
    .index("by_nisn", ["nisn"])
    .index("by_school", ["namaSekolah"])
    .index("by_npsn", ["npsn"])
    .index("by_kecamatan", ["kecamatan"])
    .index("by_status", ["status"])
    .index("unique_school_status", ["namaSekolah", "status"]) // Optimizer
    .searchIndex("search_students", {
      searchField: "nama",
      filterFields: ["namaSekolah", "kecamatan", "nisn"],
    }),

  // Schools table
  schools: defineTable({
    nsm: v.any(),
    npsn: v.optional(v.any()),
    nama: v.any(),
    alamat: v.optional(v.any()),
    provinsi: v.optional(v.string()),
    kabupaten: v.optional(v.string()),
    kecamatan: v.optional(v.any()),
    kelurahan: v.optional(v.string()),
    telepon: v.optional(v.any()),
    email: v.optional(v.any()),
    kepalaMadrasah: v.optional(v.any()),
    akreditasi: v.optional(v.any()),
    statusJamiyyah: v.optional(v.any()), 
    createdAt: v.any(),
    updatedAt: v.any(),
  })
    .index("by_nsm", ["nsm"])
    .index("by_nama", ["nama"])
    .index("by_npsn", ["npsn"])
    .index("by_kecamatan", ["kecamatan"])
    .searchIndex("search_schools", {
      searchField: "nama",
      filterFields: ["kecamatan"],
    }),

  // Users table for authentication
  users: defineTable({
    email: v.any(),
    name: v.any(),
    passwordHash: v.any(),
    passwordSalt: v.optional(v.string()), // Added for secure hashing
    role: v.any(), 
    unit: v.optional(v.any()), 
    schoolId: v.optional(v.id("schools")), // STRICT RESTORED
    teacherId: v.optional(v.id("teachers")), // Enterprise SaaS: Teacher Role
    guardianId: v.optional(v.id("students")), // Enterprise SaaS: Parent/Guardian Role
    isActive: v.any(),
    createdAt: v.any(),
    updatedAt: v.any(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_teacher", ["teacherId"]),

  // Settings table (Global App Settings) - Force Sync
  settings: defineTable({
      key: v.any(), 
      value: v.optional(v.any()), 
      storageId: v.optional(v.any()), 
      mimeType: v.optional(v.any()),
      schoolId: v.optional(v.any()), 
      updatedAt: v.any(),
  }).index("by_key", ["key"]),

  // NEW Settings Table (V2) - Fresh Start
  settings_v2: defineTable({
      key: v.any(), 
      value: v.any(), 
      mimeType: v.any(),
      schoolId: v.optional(v.any()), 
      updatedAt: v.any(),
  }).index("by_key", ["key"]),

  // ============ TAHFIDZ SYSTEM ============

  // Target Hafalan Siswa
  tahfidz_targets: defineTable({
    studentId: v.id("students"),
    schoolId: v.id("schools"),
    targetType: v.string(), // "Juz", "Surah"
    targetValue: v.string(), // "Juz 30", "Al-Baqarah", etc
    targetDate: v.optional(v.string()), // Target pencapaian
    status: v.string(), // "In Progress", "Achieved", "Failed"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_student", ["studentId"])
    .index("by_school_status", ["schoolId", "status"]),

  // Catatan Setoran Hafalan
  tahfidz_records: defineTable({
    studentId: v.id("students"),
    schoolId: v.id("schools"),
    teacherId: v.id("teachers"), // Guru penyimak
    tanggal: v.string(),
    surahMulai: v.string(),
    ayatMulai: v.number(),
    surahSelesai: v.string(),
    ayatSelesai: v.number(),
    penilaian: v.string(), // "Sangat Lancar", "Lancar", "Kurang Lancar", "Mengulang"
    nilaiAngka: v.optional(v.number()), // 1-100 (opsional)
    catatanTajwid: v.optional(v.string()),
    keteranganTambahan: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_student_date", ["studentId", "tanggal"])
    .index("by_school_date", ["schoolId", "tanggal"])
    .index("by_teacher", ["teacherId"]),

  // Dashboard stats cache (for performance)
  dashboardStats: defineTable({
    totalTeachers: v.any(),
    totalStudents: v.any(),
    totalSchools: v.any(),
    totalSk: v.any(),
    lastUpdated: v.any(),
  }),

  // Notifications table
  notifications: defineTable({
    userId: v.any(),        
    type: v.any(),              
    title: v.any(),             
    message: v.any(),           
    isRead: v.any(),           
    metadata: v.optional(v.any()),
    createdAt: v.any(),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "isRead"])
    .index("by_created", ["createdAt"]),

  // Activity Logs for Audit Trail (Enterprise)
  activity_logs: defineTable({
    user: v.any(),
    role: v.any(),
    action: v.any(),
    details: v.any(),
    ipAddress: v.optional(v.string()), // Enterprise Audit
    userAgent: v.optional(v.string()), // Enterprise Audit
    timestamp: v.optional(v.number()),
  }),

  // ============ ENTERPRISE SAAS FEATURES ============

  // WA Gateway (GoWA) Outbox
  wa_outbox: defineTable({
    schoolId: v.optional(v.id("schools")),
    targetNumber: v.string(),
    message: v.string(),
    status: v.string(), // "PENDING", "SENT", "FAILED"
    type: v.string(), // "ABSENSI", "TAHFIDZ", "BILLING", "OTHER"
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_status", ["status"]).index("by_school", ["schoolId"]),

  // ==========================================
  // MODULE 4: FINANCE (SPP & TAGIHAN)
  // ==========================================
  
  spp_invoices: defineTable({
    studentId: v.id("students"),
    schoolId: v.id("schools"),
    title: v.string(), // e.g. "SPP Juli 2024"
    amount: v.number(),
    dueDate: v.number(),
    status: v.string(), // "UNPAID", "PARTIAL", "PAID"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_student", ["studentId"]).index("by_school", ["schoolId"]),

  spp_payments: defineTable({
    invoiceId: v.id("spp_invoices"),
    studentId: v.id("students"),
    schoolId: v.id("schools"),
    amountPaid: v.number(),
    paymentMethod: v.string(), // "CASH", "TRANSFER"
    paymentDate: v.number(),
    recordedBy: v.optional(v.id("users")),
  }).index("by_invoice", ["invoiceId"]).index("by_student", ["studentId"]),

  // SaaS Subscriptions
  subscriptions: defineTable({
    schoolId: v.id("schools"),
    planType: v.string(), // "BASIC", "PRO", "ENTERPRISE"
    status: v.string(), // "ACTIVE", "EXPIRED", "SUSPENDED", "PENDING"
    billingCycle: v.string(), // "MONTHLY", "YEARLY"
    price: v.number(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_school", ["schoolId"])
    .index("by_status", ["status"]),

  // SaaS Payment Transactions (Payment Gateway)
  transactions: defineTable({
    schoolId: v.id("schools"),
    subscriptionId: v.id("subscriptions"),
    amount: v.number(),
    paymentMethod: v.optional(v.string()), // e.g., "Virtual Account BCA", "QRIS"
    paymentStatus: v.string(), // "PENDING", "PAID", "FAILED"
    paymentUrl: v.optional(v.string()), // Link to PG invoice
    externalId: v.optional(v.string()), // Midtrans/Xendit Transaction ID
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_school", ["schoolId"])
    .index("by_status", ["paymentStatus"]),


  // Approval history for audit trail
  approvalHistory: defineTable({
    documentId: v.any(),  
    documentType: v.any(),  
    action: v.any(),  
    fromStatus: v.optional(v.any()),  
    toStatus: v.optional(v.any()),  
    performedBy: v.any(),  
    performedAt: v.any(),  
    comment: v.optional(v.any()),  
    metadata: v.optional(v.any()),
  })
    .index("by_document", ["documentId"])
    .index("by_document_type", ["documentType"])
    .index("by_user", ["performedBy"])
    .index("by_date", ["performedAt"]),

  // Sessions for Secure Authentication
  sessions: defineTable({
    token: v.any(), 
    userId: v.any(),
    expiresAt: v.any(),
    ipAddress: v.optional(v.any()),
    userAgent: v.optional(v.any()),
    createdAt: v.any(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),



  // Debug Logs for diagnosing remote issues
  debug_logs: defineTable({
    action: v.any(),
    report: v.any(),
    status: v.any(),
    createdAt: v.any(),
  })
    .index("by_created", ["createdAt"]),



  // ============ ATTENDANCE SYSTEM ============

  // Mata Pelajaran
  subjects: defineTable({
    nama: v.string(),
    kode: v.optional(v.string()),
    schoolId: v.id("schools"),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_school", ["schoolId"])
    .index("by_school_active", ["schoolId", "isActive"]),

  // Kelas / Rombongan Belajar
  classes: defineTable({
    nama: v.string(),
    tingkat: v.string(),
    tahunAjaran: v.string(),
    waliKelasId: v.optional(v.id("teachers")),
    schoolId: v.id("schools"),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_school", ["schoolId"])
    .index("by_school_active", ["schoolId", "isActive"]),

  // Jadwal Jam Pelajaran
  lessonSchedule: defineTable({
    jamKe: v.number(),
    jamMulai: v.string(),
    jamSelesai: v.string(),
    schoolId: v.id("schools"),
    createdAt: v.number(),
  })
    .index("by_school", ["schoolId"]),

  // Absensi Guru
  teacherAttendance: defineTable({
    teacherId: v.id("teachers"),
    schoolId: v.id("schools"),
    tanggal: v.string(),
    jamMasuk: v.optional(v.string()),
    jamPulang: v.optional(v.string()),
    status: v.string(),
    keterangan: v.optional(v.string()),
    scannedBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_school_date", ["schoolId", "tanggal"])
    .index("by_teacher_date", ["teacherId", "tanggal"])
    .index("by_teacher", ["teacherId"]),

  // Absensi Siswa (per kelas, per mapel)
  studentAttendance: defineTable({
    studentId: v.string(),
    schoolId: v.id("schools"),
    classId: v.id("classes"),
    subjectId: v.id("subjects"),
    tanggal: v.string(),
    jamKe: v.optional(v.number()),
    status: v.string(),
    keterangan: v.optional(v.string()),
    recordedByTeacherId: v.optional(v.id("teachers")),
    scannedBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_school_date", ["schoolId", "tanggal"])
    .index("by_class_date", ["classId", "tanggal"])
    .index("by_student_date", ["studentId", "tanggal"])
    .index("by_class_subject_date", ["classId", "subjectId", "tanggal"]),

  // Log Absensi Agregat (Hemat Baris)
  studentAttendanceLogs: defineTable({
    schoolId: v.id("schools"),
    classId: v.id("classes"),
    subjectId: v.id("subjects"),
    tanggal: v.string(),
    jamKe: v.optional(v.number()),
    // logs: Map studentId -> { status, jam, scannedBy, recordedBy, keterangan, updatedAt }
    logs: v.any(), 
    updatedAt: v.number(),
  })
    .index("by_school_date", ["schoolId", "tanggal"])
    .index("by_class_subject_date", ["classId", "subjectId", "tanggal"]),

  // Pengaturan Absensi Per Sekolah
  attendanceSettings: defineTable({
    schoolId: v.id("schools"),
    absensiGuruAktif: v.boolean(),
    absensiSiswaAktif: v.boolean(),
    scannerPin: v.optional(v.string()),
    qrScanAktif: v.boolean(),
    gowaUrl: v.optional(v.string()), // URL for GoWA WhatsApp Gateway
    gowaDeviceId: v.optional(v.string()), // Multi-tenant WhatsApp Device ID
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_school", ["schoolId"]),
  // ==========================================
  // MODULE 5: E-RAPOR & AKADEMIK
  // ==========================================
  exam_scores: defineTable({
    studentId: v.id("students"),
    subjectId: v.optional(v.id("subjects")),
    examType: v.string(), // "PTS", "PAS", "UAS"
    score: v.number(),
    semester: v.string(),
    academicYear: v.string(),
  }).index("by_student", ["studentId"]),

  report_cards: defineTable({
    studentId: v.id("students"),
    schoolId: v.id("schools"),
    semester: v.string(),
    academicYear: v.string(),
    notes: v.optional(v.string()),
    isPublished: v.boolean(),
  }).index("by_student", ["studentId"]).index("by_school", ["schoolId"]),

  // ==========================================
  // MODULE 6: PPDB ONLINE
  // ==========================================
  ppdb_registrations: defineTable({
    schoolId: v.id("schools"),
    studentName: v.string(),
    nisn: v.optional(v.string()),
    phone: v.string(),
    status: v.string(), // "PENDING", "VERIFIED", "REJECTED"
    documents: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_school", ["schoolId"]),

});
