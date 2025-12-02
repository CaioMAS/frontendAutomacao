"use client";

import { useState } from 'react';
import { UserConfig } from '@/types/auth';
import ConfigUserDetails from './ConfigUserDetails';
import ConfigUserForm from './ConfigUserForm';

interface ConfigUserContainerProps {
    initialConfig: UserConfig | null;
}

export default function ConfigUserContainer({ initialConfig }: ConfigUserContainerProps) {
    const [config, setConfig] = useState<UserConfig | null>(initialConfig);
    const [isEditing, setIsEditing] = useState<boolean>(!initialConfig);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (config) {
            setIsEditing(false);
        }
    };

    const handleSuccess = (newConfig: UserConfig) => {
        setConfig(newConfig);
        setIsEditing(false);
    };

    return (
        <div>
            {isEditing ? (
                <ConfigUserForm
                    initialData={config}
                    onCancel={config ? handleCancel : undefined}
                    onSuccess={handleSuccess}
                />
            ) : (
                config && <ConfigUserDetails config={config} onEdit={handleEdit} />
            )}
        </div>
    );
}
