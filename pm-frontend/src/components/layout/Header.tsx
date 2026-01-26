'use client';

import React from 'react';

interface HeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
    return (
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
            <div>
                <h1 className="text-xl font-semibold text-white">{title}</h1>
                {subtitle && (
                    <p className="text-sm text-slate-400">{subtitle}</p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-4">
                    {actions}
                </div>
            )}
        </header>
    );
}
