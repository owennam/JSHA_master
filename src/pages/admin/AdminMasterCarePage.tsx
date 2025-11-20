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

// Master Care 데이터 구조는 아직 API가 없으므로 임시로 정의하거나 
// dashboard-summary에서 가져온 것과 유사하게 구현해야 함.
// 여기서는 일단 플레이스홀더로 구현하고 나중에 연결.

const AdminMasterCarePage = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Master Care 신청</h2>
                    <p className="text-muted-foreground">
                        병원 컨설팅 및 Master Care 신청 내역입니다.
                    </p>
                </div>
            </div>

            <div className="rounded-md border bg-white p-8 text-center">
                <p className="text-muted-foreground">
                    현재 Master Care 신청 내역 조회 기능은 준비 중입니다. <br />
                    Google Sheets에서 직접 확인해주세요.
                </p>
            </div>
        </div>
    );
};

export default AdminMasterCarePage;
