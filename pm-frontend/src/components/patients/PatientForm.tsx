'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PatientRequest, Patient } from '@/types';

interface PatientFormProps {
    patient?: Patient;
    onSubmit: (data: PatientRequest) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function PatientForm({ patient, onSubmit, onCancel, isLoading }: PatientFormProps) {
    const [formData, setFormData] = useState<PatientRequest>({
        name: '',
        email: '',
        address: '',
        dateOfBirth: '',
        registrationDate: new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState<Partial<Record<keyof PatientRequest, string>>>({});

    useEffect(() => {
        if (patient) {
            setFormData({
                name: patient.name,
                email: patient.email,
                address: patient.address,
                dateOfBirth: patient.dateOfBirth,
                registrationDate: new Date().toISOString().split('T')[0],
            });
        }
    }, [patient]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof PatientRequest, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Name must be less than 100 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            await onSubmit(formData);
        }
    };

    const handleChange = (field: keyof PatientRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                required
            />

            <Input
                label="Email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                required
            />

            <Input
                label="Address"
                placeholder="ul. Przykładowa 123, 00-000 Warszawa"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                error={errors.address}
                required
            />

            <Input
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
                required
            />

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isLoading}
                    className="flex-1"
                >
                    {patient ? 'Update Patient' : 'Add Patient'}
                </Button>
            </div>
        </form>
    );
}
