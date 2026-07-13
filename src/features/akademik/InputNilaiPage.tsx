import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";
import { Save, FileSpreadsheet } from "lucide-react";

export default function InputNilaiPage() {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const schoolId = user?.schoolId as Id<"schools">;
    const teacherId = user?.teacherId as Id<"teachers">;

    const [classId, setClassId] = useState<string>("");
    const [subjectId, setSubjectId] = useState<string>("");
    const [semester, setSemester] = useState<string>("Ganjil");
    const [academicYear, setAcademicYear] = useState<string>("2023/2024");
    const [examType, setExamType] = useState<string>("PTS");

    const classes = useQuery(api.classes.list, schoolId ? { schoolId } : "skip");
    const subjects = useQuery(api.subjects.list, schoolId ? { schoolId } : "skip");
    
    // In a real app we might fetch students by class
    const allStudents = useQuery(api.students.list, schoolId ? { schoolId } : "skip");
    const studentsInClass = allStudents?.filter(s => s.classId === classId) || [];

    const existingScores = useQuery(api.akademik.getScores, 
        classId && subjectId ? {
            classId: classId as Id<"classes">,
            subjectId: subjectId as Id<"subjects">,
            semester,
            academicYear,
            type: examType
        } : "skip"
    );

    const inputScore = useMutation(api.akademik.inputScore);
    const [localScores, setLocalScores] = useState<Record<string, number>>({});

    const handleScoreChange = (studentId: string, value: string) => {
        if (value === "") {
            setLocalScores(prev => {
                const next = { ...prev };
                delete next[studentId];
                return next;
            });
            return;
        }
        const num = parseInt(value);
        if (isNaN(num)) return;
        if (num < 0 || num > 100) return;
        setLocalScores(prev => ({ ...prev, [studentId]: num }));
    };

    const handleSave = async (studentId: string) => {
        const score = localScores[studentId];
        if (score === undefined) return;
        
        try {
            await inputScore({
                schoolId,
                teacherId,
                classId: classId as Id<"classes">,
                subjectId: subjectId as Id<"subjects">,
                studentId: studentId as Id<"students">,
                semester,
                academicYear,
                type: examType,
                score
            });
            toast.success("Nilai berhasil disimpan!");
        } catch (e) {
            toast.error("Gagal menyimpan nilai");
        }
    };

    const getScoreForStudent = (studentId: string) => {
        if (localScores[studentId] !== undefined) return localScores[studentId];
        const existing = existingScores?.find(s => s.studentId === studentId);
        return existing ? existing.score : "";
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Input Nilai Akademik</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Filter Penilaian</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Select value={academicYear} onValueChange={setAcademicYear}>
                        <SelectTrigger><SelectValue placeholder="Tahun Ajaran" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2023/2024">2023/2024</SelectItem>
                            <SelectItem value="2024/2025">2024/2025</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={semester} onValueChange={setSemester}>
                        <SelectTrigger><SelectValue placeholder="Semester" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Ganjil">Ganjil</SelectItem>
                            <SelectItem value="Genap">Genap</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={examType} onValueChange={setExamType}>
                        <SelectTrigger><SelectValue placeholder="Jenis Ujian" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="UH">Ulangan Harian</SelectItem>
                            <SelectItem value="PTS">Penilaian Tengah Semester</SelectItem>
                            <SelectItem value="PAS">Penilaian Akhir Semester</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={classId} onValueChange={setClassId}>
                        <SelectTrigger><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                        <SelectContent>
                            {classes?.map(c => (
                                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={subjectId} onValueChange={setSubjectId}>
                        <SelectTrigger><SelectValue placeholder="Pilih Mapel" /></SelectTrigger>
                        <SelectContent>
                            {subjects?.map(s => (
                                <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {classId && subjectId && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Daftar Siswa</CardTitle>
                        <Button variant="outline" className="gap-2">
                            <FileSpreadsheet className="w-4 h-4" /> Export Excel
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="py-3 px-4">No</th>
                                        <th className="py-3 px-4">NISN</th>
                                        <th className="py-3 px-4">Nama Siswa</th>
                                        <th className="py-3 px-4 w-32 text-center">Nilai (0-100)</th>
                                        <th className="py-3 px-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {studentsInClass.map((student, idx) => (
                                        <tr key={student._id} className="hover:bg-slate-50">
                                            <td className="py-3 px-4 text-slate-500">{idx + 1}</td>
                                            <td className="py-3 px-4 text-slate-500">{student.nisn || "-"}</td>
                                            <td className="py-3 px-4 font-medium">{student.nama}</td>
                                            <td className="py-3 px-4">
                                                <Input 
                                                    type="number"
                                                    min="0" max="100"
                                                    value={getScoreForStudent(student._id)}
                                                    onChange={(e) => handleScoreChange(student._id, e.target.value)}
                                                    className="text-center font-semibold"
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Button size="sm" onClick={() => handleSave(student._id)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                                                    <Save className="w-4 h-4" /> Simpan
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {studentsInClass.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-slate-500">
                                                Belum ada data siswa di kelas ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
