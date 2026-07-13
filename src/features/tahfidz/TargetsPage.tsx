import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Plus, Target, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TargetsPage() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const schoolId = user?.schoolId;

  // For now, this is a placeholder UI since we need a complex form for adding targets
  // In a real implementation, we'd fetch actual targets from Convex

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <Trophy className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">Target Hafalan</h1>
            <p className="text-emerald-600/80">Kelola target hafalan Quran untuk setiap siswa</p>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" /> Tambah Target
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 flex items-center gap-2">
              <Target className="w-4 h-4" /> Total Target Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">124</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Target Tercapai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">45</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Mendekati Tenggat Waktu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">12</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle>Daftar Target Hafalan Siswa</CardTitle>
          <CardDescription>Menampilkan target hafalan yang sedang berjalan</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Tenggat Waktu</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  Belum ada data target hafalan (UI Preview)
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
