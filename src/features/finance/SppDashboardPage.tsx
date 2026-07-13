import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Printer, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";

export default function SppDashboardPage() {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    const invoices = useQuery(api.finance.getInvoices, { 
        schoolId: user?.schoolId ? (user.schoolId as Id<"schools">) : undefined 
    });
    
    const payInvoice = useMutation(api.finance.payInvoice);

    const handlePay = async (invoiceId: Id<"spp_invoices">, amount: number) => {
        try {
            await payInvoice({
                invoiceId,
                amountPaid: amount,
                paymentMethod: "CASH",
                recordedBy: user._id as Id<"users">
            });
            toast.success("Pembayaran berhasil dicatat");
        } catch (e) {
            toast.error("Gagal mencatat pembayaran");
        }
    };

    if (invoices === undefined) return <div className="p-8">Memuat data tagihan...</div>;

    const unpaidInvoices = invoices.filter((i: any) => i.status === "UNPAID");

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen SPP & Tagihan</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tagihan Belum Lunas</CardTitle>
                        <CreditCard className="h-4 w-4 text-rose-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{unpaidInvoices.length} Siswa</div>
                        <p className="text-xs text-slate-500">Perlu ditindaklanjuti</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Tagihan SPP</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="py-3 px-4">Bulan</th>
                                    <th className="py-3 px-4">NISN</th>
                                    <th className="py-3 px-4">Nama Siswa</th>
                                    <th className="py-3 px-4">Nominal</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoices.map((inv: any) => (
                                    <tr key={inv._id} className="hover:bg-slate-50">
                                        <td className="py-3 px-4 font-medium">{inv.title}</td>
                                        <td className="py-3 px-4 text-slate-500">{inv.studentNisn}</td>
                                        <td className="py-3 px-4">{inv.studentName}</td>
                                        <td className="py-3 px-4 text-slate-600">Rp {inv.amount.toLocaleString('id-ID')}</td>
                                        <td className="py-3 px-4">
                                            {inv.status === "PAID" ? (
                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none"><CheckCircle className="w-3 h-3 mr-1"/> Lunas</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50">Belum Lunas</Badge>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {inv.status !== "PAID" ? (
                                                <Button size="sm" onClick={() => handlePay(inv._id, inv.amount)} className="bg-blue-600 hover:bg-blue-700">
                                                    Terima Pembayaran
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" className="text-slate-600">
                                                    <Printer className="w-4 h-4 mr-2"/> Kuitansi
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500">Belum ada data tagihan. Tagihan otomatis dibuat tanggal 1.</td>
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
