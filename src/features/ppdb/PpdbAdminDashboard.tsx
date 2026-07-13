import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function PpdbAdminDashboard() {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    
    const registrations = useQuery(api.ppdb.getRegistrations, { 
        schoolId: user?.schoolId ? (user.schoolId as Id<"schools">) : undefined 
    });
    
    const updateStatus = useMutation(api.ppdb.updateStatus);

    const handleUpdate = async (id: Id<"ppdb_registrations">, status: "VERIFIED" | "REJECTED") => {
        try {
            await updateStatus({ registrationId: id, status });
            toast.success(`Status berhasil diubah menjadi ${status}`);
        } catch (e) {
            toast.error("Gagal mengubah status pendaftar");
        }
    };

    if (registrations === undefined) return <div className="p-8">Memuat data pendaftar...</div>;

    const pendingCount = registrations.filter(r => r.status === "PENDING").length;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Verifikasi Pendaftar PPDB</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{pendingCount} Pendaftar</div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Calon Siswa Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="py-3 px-4">Tanggal Daftar</th>
                                    <th className="py-3 px-4">Nama Pendaftar</th>
                                    <th className="py-3 px-4">NISN</th>
                                    <th className="py-3 px-4">No. WA</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {registrations.map((reg) => (
                                    <tr key={reg._id} className="hover:bg-slate-50">
                                        <td className="py-3 px-4 text-slate-500">{new Date(reg.createdAt).toLocaleDateString("id-ID")}</td>
                                        <td className="py-3 px-4 font-medium">{reg.studentName}</td>
                                        <td className="py-3 px-4 text-slate-500">{reg.nisn || "-"}</td>
                                        <td className="py-3 px-4 text-slate-600">{reg.phone}</td>
                                        <td className="py-3 px-4">
                                            {reg.status === "VERIFIED" ? (
                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none"><CheckCircle className="w-3 h-3 mr-1"/> Diterima</Badge>
                                            ) : reg.status === "REJECTED" ? (
                                                <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50"><XCircle className="w-3 h-3 mr-1"/> Ditolak</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Menunggu</Badge>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-2">
                                            {reg.status === "PENDING" && (
                                                <>
                                                    <Button size="sm" onClick={() => handleUpdate(reg._id, "VERIFIED")} className="bg-emerald-600 hover:bg-emerald-700">
                                                        Terima
                                                    </Button>
                                                    <Button size="sm" onClick={() => handleUpdate(reg._id, "REJECTED")} variant="outline" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200">
                                                        Tolak
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {registrations.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500">Belum ada pendaftar masuk.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
