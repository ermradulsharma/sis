'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/services/api.service';
import { Clock, CheckCircle2, History } from 'lucide-react';
import { format } from 'date-fns';

export default function AttendancePage() {
    const [attendance, setAttendance] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPunching, setIsPunching] = useState(false);
    const [error, setError] = useState('');

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.get<any>('/hr/attendance');
            if (response.success && response.data) {
                setAttendance(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const handlePunch = async (action: 'clock-in' | 'clock-out') => {
        setIsPunching(true);
        setError('');
        try {
            const response = await apiService.post('/hr/attendance', { action });
            if (response.success) {
                fetchAttendance();
            } else {
                setError(response.error?.message || `Failed to ${action.replace('-', ' ')}`);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsPunching(false);
        }
    };

    const getStatusColor = () => {
        if (!attendance) return 'text-slate-400 bg-slate-800/50 border-slate-700';
        if (attendance && !attendance.clockOut) return 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50';
        return 'text-indigo-400 bg-indigo-950/30 border-indigo-900/50';
    };

    const getStatusText = () => {
        if (!attendance) return 'Not Clocked In';
        if (attendance && !attendance.clockOut) return 'Currently Clocked In';
        return 'Shift Completed';
    };

    return (
        <ContentArea>
            <PageHeader
                title="My Attendance"
                description="Clock in and out for your shift."
            />

            {error && (
                <div className="mb-6 rounded-md bg-rose-500/10 p-3 text-sm text-rose-500 border border-rose-500/20">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center flex flex-col items-center justify-center">
                    <Clock className={`h-16 w-16 mb-4 ${getStatusColor().split(' ')[0]}`} />

                    <div className={`px-4 py-1.5 rounded-full border text-sm font-medium mb-6 ${getStatusColor()}`}>
                        {getStatusText()}
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">{format(new Date(), 'h:mm a')}</h2>
                    <p className="text-slate-400 mb-8">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>

                    {!attendance ? (
                        <Button
                            size="lg"
                            className="w-full sm:w-auto px-12 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handlePunch('clock-in')}
                            isLoading={isPunching}
                        >
                            Clock In
                        </Button>
                    ) : !attendance.clockOut ? (
                        <Button
                            size="lg"
                            variant="danger"
                            className="w-full sm:w-auto px-12"
                            onClick={() => handlePunch('clock-out')}
                            isLoading={isPunching}
                        >
                            Clock Out
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 text-indigo-400 font-medium">
                            <CheckCircle2 className="h-5 w-5" /> You are done for the day!
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
                        <History className="h-5 w-5 text-indigo-500" /> Today's Log
                    </h3>

                    <div className="space-y-6">
                        <div className="relative pl-6 border-l-2 border-slate-800">
                            <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-slate-900 ${attendance ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                            <p className="text-sm font-medium text-slate-300">Clock In</p>
                            <p className="text-sm text-slate-500 mt-1">
                                {attendance?.clockIn ? format(new Date(attendance.clockIn), 'h:mm a') : '--:--'}
                            </p>
                        </div>

                        <div className="relative pl-6 border-l-2 border-transparent">
                            <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-slate-900 ${attendance?.clockOut ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                            <p className="text-sm font-medium text-slate-300">Clock Out</p>
                            <p className="text-sm text-slate-500 mt-1">
                                {attendance?.clockOut ? format(new Date(attendance.clockOut), 'h:mm a') : '--:--'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ContentArea>
    );
}
