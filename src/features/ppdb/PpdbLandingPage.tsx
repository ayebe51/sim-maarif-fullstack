import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { GraduationCap, Building2, CheckCircle, ShieldCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Id } from "../../../convex/_generated/dataModel";

export default function PpdbLandingPage() {
    const schools = useQuery(api.schools.list);
    const register = useMutation(api.ppdb.register);

    const [form, setForm] = useState({
        schoolId: "",
        studentName: "",
        nisn: "",
        phone: ""
    });
    
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.schoolId || !form.studentName || !form.phone) {
            toast.error("Mohon lengkapi data yang wajib diisi!");
            return;
        }

        try {
            await register({
                schoolId: form.schoolId as Id<"schools">,
                studentName: form.studentName,
                nisn: form.nisn,
                phone: form.phone
            });
            setIsSubmitted(true);
            toast.success("Pendaftaran berhasil terkirim!");
        } catch (error) {
            toast.error("Terjadi kesalahan sistem. Coba lagi.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl border-0 text-center py-12">
                    <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                    <CardTitle className="text-2xl font-bold text-slate-800 mb-2">Pendaftaran Berhasil!</CardTitle>
                    <p className="text-slate-600 mb-8 px-6">
                        Data Anda telah masuk ke sistem kami. Silakan tunggu informasi lebih lanjut yang akan kami kirimkan melalui WhatsApp ke nomor {form.phone}.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">Kembali ke Beranda</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900">
            {/* Navbar */}
            <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 p-4">
                <div className="max-w-5xl mx-auto flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg leading-tight">EduSaaS PPDB</h1>
                        <p className="text-emerald-200 text-xs">Penerimaan Peserta Didik Baru Online</p>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto p-4 md:p-8 grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
                {/* Hero Section */}
                <div className="text-white space-y-6">
                    <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/50">Tahun Ajaran 2026/2027</Badge>
                    <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
                        Wujudkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Generasi Emas</span> Bersama Kami
                    </h2>
                    <p className="text-emerald-100/70 text-lg">
                        Layanan pendaftaran sekolah mudah, cepat, dan transparan. Gabung sekarang untuk mendapatkan akses ke pendidikan berkualitas di bawah naungan LP Maarif NU.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <div className="flex items-center gap-2 text-sm text-emerald-200">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Terakreditasi A
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-200">
                            <Building2 className="w-5 h-5 text-emerald-400" /> Fasilitas Lengkap
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-800">Formulir Pendaftaran</CardTitle>
                        <CardDescription>Isi data awal untuk memulai pendaftaran PPDB</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Pilih Sekolah Tujuan *</label>
                                <Select value={form.schoolId} onValueChange={(val) => setForm({...form, schoolId: val})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih sekolah..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {schools?.map((s) => (
                                            <SelectItem key={s._id} value={s._id}>{s.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Nama Lengkap Siswa *</label>
                                <Input 
                                    placeholder="Contoh: Ahmad Abdullah" 
                                    value={form.studentName}
                                    onChange={(e) => setForm({...form, studentName: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">NISN (Opsional)</label>
                                <Input 
                                    placeholder="Nomor Induk Siswa Nasional" 
                                    value={form.nisn}
                                    onChange={(e) => setForm({...form, nisn: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Nomor WhatsApp Orang Tua *</label>
                                <Input 
                                    placeholder="Contoh: 08123456789" 
                                    value={form.phone}
                                    onChange={(e) => setForm({...form, phone: e.target.value})}
                                />
                                <p className="text-xs text-slate-500">Gunakan nomor WA aktif. Pengumuman akan dikirim ke nomor ini.</p>
                            </div>

                            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg h-12 text-lg mt-6">
                                Daftar Sekarang
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
