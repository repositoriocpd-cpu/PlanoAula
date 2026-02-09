export interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: 'admin' | 'teacher';
    is_active: boolean;
    created_at: string;
}

export interface SchoolSettings {
    id: string;
    school_name: string;
    address: string;
    phone: string;
    email: string;
    principal_name: string;
    updated_at: string;
}

export interface SystemLog {
    id: string;
    user_id: string;
    action: string;
    details: any;
    ip_address?: string;
    created_at: string;

    // Virtual fields for UI display (e.g., joined user name)
    user_name?: string;
}

export interface BackupStatus {
    lastBackup: string | null;
    status: 'idle' | 'processing' | 'success' | 'error';
    size?: string;
}
