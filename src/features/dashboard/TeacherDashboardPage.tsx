import { Card, CardContent } from "@/components/ui/card";
import { User, Trophy, BookOpen } from "lucide-react";

export default function TeacherDashboardPage() {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div className="flex items-center gap-5 relative z-10">
                    <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <User size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            Portal Guru
                        </h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            Selamat datang, <span className="font-bold text-emerald-800">{user?.name || "Guru"}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-0 shadow-sm bg-white overflow-hidden rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                                <span className="text-sm font-medium text-slate-500">Kelas Diajar</span>
                                <span className="text-3xl font-extrabold text-slate-800">4</span>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-white overflow-hidden rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                                <span className="text-sm font-medium text-slate-500">Setoran Hafalan Hari Ini</span>
                                <span className="text-3xl font-extrabold text-emerald-800">12</span>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <Trophy className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
