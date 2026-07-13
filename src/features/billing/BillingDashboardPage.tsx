import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ShieldCheck, Clock } from "lucide-react";

export default function BillingDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Billing & Layanan</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Paket Aktif</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">Pro</div>
                        <p className="text-xs text-slate-500">30 Lembaga Menggunakan PRO</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Menunggu Pembayaran</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">5</div>
                        <p className="text-xs text-slate-500">Invoice pending bulan ini</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">Rp 12.500.000</div>
                        <p className="text-xs text-slate-500">Bulan ini</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Tagihan (Mock)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500">Integrasi Payment Gateway dapat disambungkan pada bagian ini untuk memantau status tagihan sekolah/yayasan yang berlangganan.</p>
                </CardContent>
            </Card>
        </div>
    )
}
