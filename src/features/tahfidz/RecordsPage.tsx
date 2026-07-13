import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileEdit, BookOpen, User, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecordsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <FileEdit className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">Setoran / Penilaian</h1>
            <p className="text-emerald-600/80">Catat dan nilai setoran hafalan harian siswa</p>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" /> Input Setoran Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-emerald-100 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
            <CardHeader>
              <CardTitle className="text-emerald-800">Ringkasan Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Penyetor</p>
                  <p className="font-bold text-lg text-slate-800">0 Siswa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Rata-rata Kelancaran</p>
                  <p className="font-bold text-lg text-slate-800">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-emerald-100 shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Riwayat Setoran</CardTitle>
                <CardDescription>Data setoran hafalan terbaru</CardDescription>
              </div>
              <div className="flex items-center text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4 mr-2" /> Hari Ini
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Siswa</TableHead>
                    <TableHead>Surah/Ayat</TableHead>
                    <TableHead>Penilaian</TableHead>
                    <TableHead>Penyimak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      Belum ada data setoran hari ini (UI Preview)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
