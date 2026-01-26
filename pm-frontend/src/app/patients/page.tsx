'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DeleteModal } from '@/components/ui/Modal';
import PatientForm from '@/components/patients/PatientForm';
import { api } from '@/lib/api';
import { Patient, PatientRequest } from '@/types';

export default function PatientsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError(null);
            const data = await api.getPatients();
            setPatients(data);
        } catch (err) {
            setError('Failed to load patients. Make sure the backend is running.');
            console.error('Failed to load patients:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (data: PatientRequest) => {
        setIsSubmitting(true);
        try {
            await api.createPatient(data);
            await loadPatients();
            setShowForm(false);
        } catch (err) {
            console.error('Failed to create patient:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data: PatientRequest) => {
        if (!editingPatient) return;
        setIsSubmitting(true);
        try {
            await api.updatePatient(editingPatient.id, data);
            await loadPatients();
            setEditingPatient(null);
        } catch (err) {
            console.error('Failed to update patient:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingPatient) return;
        setIsSubmitting(true);
        try {
            await api.deletePatient(deletingPatient.id);
            await loadPatients();
            setDeletingPatient(null);
        } catch (err) {
            console.error('Failed to delete patient:', err);
        } finally {
            setIsSubmitting(false);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Sidebar />

            <main className="ml-64">
                <Header
                    title="Patients"
                    subtitle={`Manage your patient records (${patients.length} total)`}
                    actions={
                        <Button onClick={() => setShowForm(true)}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Patient
                        </Button>
                    }
                />

                <div className="p-8">
                    {/* Add/Edit Form */}
                    {(showForm || editingPatient) && (
                        <Card className="mb-8">
                            <div className="px-6 py-4 border-b border-slate-700/50">
                                <h2 className="text-lg font-semibold text-white">
                                    {editingPatient ? 'Edit Patient' : 'Add New Patient'}
                                </h2>
                            </div>
                            <CardContent>
                                <PatientForm
                                    patient={editingPatient || undefined}
                                    onSubmit={editingPatient ? handleUpdate : handleCreate}
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditingPatient(null);
                                    }}
                                    isLoading={isSubmitting}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Patients Table */}
                    <Card>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-8 text-center text-slate-400">
                                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                                    Loading patients...
                                </div>
                            ) : patients.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">No patients yet</h3>
                                    <p className="text-slate-400 mb-4">Get started by adding your first patient.</p>
                                    <Button onClick={() => setShowForm(true)}>
                                        Add Your First Patient
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-slate-400 border-b border-slate-700/50">
                                                <th className="px-6 py-4 font-medium">Name</th>
                                                <th className="px-6 py-4 font-medium">Email</th>
                                                <th className="px-6 py-4 font-medium">Address</th>
                                                <th className="px-6 py-4 font-medium">Date of Birth</th>
                                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {patients.map((patient) => (
                                                <tr
                                                    key={patient.id}
                                                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                                                {patient.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-white font-medium">{patient.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-300">{patient.email}</td>
                                                    <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{patient.address}</td>
                                                    <td className="px-6 py-4 text-slate-300">{patient.dateOfBirth}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => setEditingPatient(patient)}
                                                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingPatient(patient)}
                                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={!!deletingPatient}
                onClose={() => setDeletingPatient(null)}
                onConfirm={handleDelete}
                title="Delete Patient"
                message={`Are you sure you want to delete ${deletingPatient?.name}? This action cannot be undone.`}
                isLoading={isSubmitting}
            />
        </div>
    );
}
