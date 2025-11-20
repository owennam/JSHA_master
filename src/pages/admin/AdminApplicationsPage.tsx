import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Application {
    timestamp: string;
    name: string;
    email: string;
    phone: string;
    hospital: string;
    status: string;
}

const AdminApplicationsPage = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [filteredApps, setFilteredApps] = useState<Application[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch('/api/admin/applications');
                const result = await response.json();
                if (result.success) {
                    setApplications(result.data);
                    setFilteredApps(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch applications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    useEffect(() => {
        const filtered = applications.filter(app =>
            app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.phone?.includes(searchTerm)
        );
        setFilteredApps(filtered);
    }, [searchTerm, applications]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">마스터 코스 신청자</h2>
                    <p className="text-muted-foreground">
                        교육 신청자 명단을 확인하고 관리합니다.
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="이름, 병원명, 전화번호 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>신청일시</TableHead>
                            <TableHead>이름</TableHead>
                            <TableHead>병원명</TableHead>
                            <TableHead>연락처</TableHead>
                            <TableHead>이메일</TableHead>
                            <TableHead>상태</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    로딩 중...
                                </TableCell>
                            </TableRow>
                        ) : filteredApps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    신청 내역이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredApps.map((app, index) => (
                                <TableRow key={index}>
                                    <TableCell>{app.timestamp}</TableCell>
                                    <TableCell className="font-medium">{app.name}</TableCell>
                                    <TableCell>{app.hospital}</TableCell>
                                    <TableCell>{app.phone}</TableCell>
                                    <TableCell>{app.email}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                            {app.status || '신청완료'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminApplicationsPage;
