import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileBarChart, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <FileBarChart className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">Laporan Tahfidz</h1>
            <p className="text-emerald-600/80">Rekapitulasi pencapaian hafalan siswa</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle>Rekapitulasi Capaian Kelas</CardTitle>
          <CardDescription>Pilih kelas untuk melihat detail capaian siswa</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>No</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Capaian Terakhir</TableHead>
                <TableHead>Target Semester</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  Pilih filter kelas terlebih dahulu (UI Preview)
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
