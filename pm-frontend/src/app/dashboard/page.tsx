'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Card, { CardContent } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Patient } from '@/types';

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadPatients();
        }
    }, [isAuthenticated]);

    const loadPatients = async () => {
        try {
            const data = await api.getPatients();
            setPatients(data);
        } catch (error) {
            console.error('Failed to load patients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const stats = [
        {
            title: 'Total Patients',
            value: patients.length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'New This Month',
            value: patients.filter(p => {
                const date = new Date(p.dateOfBirth);
                const now = new Date();
                return date.getMonth() === now.getMonth();
            }).length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
            color: 'from-green-500 to-emerald-500',
        },
        {
            title: 'Active Records',
            value: patients.length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: 'from-purple-500 to-pink-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Sidebar />

            <main className="ml-64">
                <Header
                    title="Dashboard"
                    subtitle="Welcome back! Here's your patient overview."
                />

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <Card key={index} hover>
                                <CardContent className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">{stat.title}</p>
                                        <p className="text-2xl font-bold text-white">
                                            {isLoading ? '...' : stat.value}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Recent Patients */}
                    <Card>
                        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Recent Patients</h2>
                            <button
                                onClick={() => router.push('/patients')}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                View all →
                            </button>
                        </div>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-8 text-center text-slate-400">
                                    Loading patients...
                                </div>
                            ) : patients.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">
                                    No patients found. Add your first patient!
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-slate-400 border-b border-slate-700/50">
                                            <th className="px-6 py-3 font-medium">Name</th>
                                            <th className="px-6 py-3 font-medium">Email</th>
                                            <th className="px-6 py-3 font-medium">Date of Birth</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.slice(0, 5).map((patient) => (
                                            <tr
                                                key={patient.id}
                                                className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-white font-medium">{patient.name}</td>
                                                <td className="px-6 py-4 text-slate-300">{patient.email}</td>
                                                <td className="px-6 py-4 text-slate-300">{patient.dateOfBirth}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
