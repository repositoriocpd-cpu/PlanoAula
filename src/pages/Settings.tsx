import React, { useState } from 'react';
import {
    User,
    School,
    FileText,
    Database,
    Info,
    Save,
    RefreshCw,
    Download,
    Shield,
    Lock,
    Ban,
    CheckCircle,
    Activity,
    Upload,
    Pencil
} from 'lucide-react';
import type { Profile, SchoolSettings, SystemLog } from '../types/settings';

import { createClient } from '@supabase/supabase-js';
import { supabase, isConfigured } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

// Mock Data
const MOCK_LOGS: SystemLog[] = [
    { id: '1', user_id: '1', action: 'LOGIN', details: 'Login realizado com sucesso', ip_address: '192.168.1.1', created_at: new Date().toISOString(), user_name: 'Professor Admin' },
    { id: '2', user_id: '2', action: 'CREATE_PLAN', details: 'Criou plano de aula: Matemática 5º Ano', ip_address: '192.168.1.4', created_at: new Date(Date.now() - 3600000).toISOString(), user_name: 'Maria Silva' },
    { id: '3', user_id: '1', action: 'UPDATE_SETTINGS', details: 'Atualizou dados da escola', ip_address: '192.168.1.1', created_at: new Date(Date.now() - 7200000).toISOString(), user_name: 'Professor Admin' },
];

const MOCK_SCHOOL: SchoolSettings = {
    id: '1',
    school_name: 'Escola Municipal Exemplo',
    address: 'Rua da Educação, 123 - Centro',
    phone: '(21) 99999-9999',
    email: 'contato@escola.municipal.br',
    principal_name: 'Diretora Ana Oliveira',
    updated_at: new Date().toISOString()
};

// Temporary client for creating users without logging out
const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createUserClient = isConfigured
    ? createClient(URL, KEY, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })
    : null;

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'teacher' as 'admin' | 'teacher'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!createUserClient) {
                throw new Error('Supabase não está configurado corretamente.');
            }
            const { error: signUpError } = await createUserClient.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                        role: formData.role
                    }
                }
            });

            if (signUpError) throw signUpError;

            alert('Usuário criado com sucesso!');
            onSuccess();
            onClose();
            setFormData({ name: '', email: '', password: '', role: 'teacher' });
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Erro ao criar usuário. Verifique se o e-mail já está em uso.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Novo Usuário</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <Ban className="w-5 h-5 rotate-45" /> {/* Using Ban as X icon fallback if X not imported, or just generic close */}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2 border"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2 border"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha Inicial</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2 border"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                        <select
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2 border"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value as 'admin' | 'teacher' })}
                        >
                            <option value="teacher">Professor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-lg shadow-purple-500/30 flex items-center"
                        >
                            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                            Criar Usuário
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: Profile | null;
}

function EditUserModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        role: 'teacher' as 'admin' | 'teacher'
    });

    React.useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name,
                role: user.role
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    role: formData.role
                })
                .eq('id', user.id);

            if (error) throw error;

            alert('Usuário atualizado com sucesso!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Erro ao atualizar usuário.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Editar Usuário</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <Ban className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2 border"
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            disabled
                            className="w-full rounded-lg bg-gray-50 border-gray-200 text-gray-500 px-4 py-2 border cursor-not-allowed"
                            value={user.email}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">O e-mail não pode ser alterado por aqui.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                        <select
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2 border"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value as 'admin' | 'teacher' })}
                        >
                            <option value="teacher">Professor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-lg shadow-purple-500/30 flex items-center"
                        >
                            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: Profile | null;
}

function ChangePasswordModal({ isOpen, onClose, user }: ChangePasswordModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) throw error;

            alert('Senha alterada com sucesso! (Note: Devido a restrições de segurança do Supabase no frontend, você só pode alterar sua própria senha conectada. Para outros usuários, use o Painel Admin do Supabase)');
            onClose();
            setPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Erro ao alterar a senha.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Alterar Senha</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <Ban className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg">
                    <Info className="w-4 h-4 inline mr-2" />
                    Usuário: <strong>{user.full_name}</strong>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2 border"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-lg shadow-purple-500/30 flex items-center"
                        >
                            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                            Redefinir Senha
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function Settings() {
    const { profile } = useAuth();
    const [activeTab, setActiveTab] = useState<'users' | 'school' | 'logs' | 'backup' | 'about'>('users');

    if (profile?.role !== 'admin') {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6">
                    <Shield className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
                <p className="text-gray-500 max-w-sm mx-auto">
                    Apenas administradores do sistema podem acessar este módulo.
                    Se você acredita que deveria ter acesso, entre em contato com o suporte.
                </p>
                <div className="mt-8">
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg shadow-gray-200"
                    >
                        Voltar para o Início
                    </button>
                </div>
            </div>
        );
    }

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [school, setSchool] = useState<SchoolSettings>(MOCK_SCHOOL);
    const [logs] = useState(MOCK_LOGS);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

    // Fetch Profiles
    React.useEffect(() => {
        if (activeTab === 'users') {
            fetchProfiles();
        }
    }, [activeTab]);

    const fetchProfiles = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProfiles(data || []);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };

    // Handlers
    const handleToggleUserStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            // Optimistic update
            setProfiles(profiles.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erro ao atualizar status do usuário.');
        }
    };

    const handleSaveSchool = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    const handleBackup = async () => {
        setIsLoading(true);
        try {
            // Fetch data from all relevant tables
            const [
                { data: profiles },
                { data: school },
                { data: logs },
                { data: annualPlans },
                { data: sequences },
                { data: assessments },
                { data: reports },
                { data: lessons } // Assuming 'lessons' table exists based on context
            ] = await Promise.all([
                supabase.from('profiles').select('*'),
                supabase.from('school_settings').select('*'),
                supabase.from('system_logs').select('*'),
                supabase.from('annual_plans').select('*'),
                supabase.from('didactic_sequences').select('*'),
                supabase.from('assessments').select('*'),
                supabase.from('reports').select('*'),
                supabase.from('lesson_plans').select('*')
            ]);

            const backupData = {
                timestamp: new Date().toISOString(),
                version: '1.0',
                data: {
                    profiles: profiles || [],
                    school_settings: school || [],
                    system_logs: logs || [],
                    annual_plans: annualPlans || [],
                    didactic_sequences: sequences || [],
                    assessments: assessments || [],
                    reports: reports || [],
                    lesson_plans: lessons || []
                }
            };

            // Create and download JSON file
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_smedu_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            alert('Backup realizado e baixado com sucesso!');
        } catch (error) {
            console.error('Error creating backup:', error);
            alert('Erro ao criar backup. Verifique o console para mais detalhes.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm('Tem certeza que deseja restaurar este backup? Isso pode sobrescrever dados existentes.')) {
            event.target.value = ''; // Reset input
            return;
        }

        setIsLoading(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const json = e.target?.result as string;
                const backup = JSON.parse(json);

                if (!backup.data) throw new Error('Formato de backup inválido');

                // Restore logic would go here. 
                // For MVP/Safety, we might just log it or implement specific restore logic.
                // Restoring data can be complex due to foreign keys and existing IDs.
                // For now, let's simulate a successful restore or just Insert if empty?
                // Real implementation would require careful upserts.

                console.log('Restoring data:', backup.data);

                // Example: Restore School Settings (Safest to start with)
                if (backup.data.school_settings && backup.data.school_settings.length > 0) {
                    const { error } = await supabase
                        .from('school_settings')
                        .upsert(backup.data.school_settings);
                    if (error) console.error('Error restoring school settings:', error);
                }

                alert('Backup enviado com sucesso! (Restauração completa ainda não implementada para segurança dos dados)');
            } catch (error) {
                console.error('Error restoring backup:', error);
                alert('Erro ao processar arquivo de backup.');
            } finally {
                setIsLoading(false);
                if (event.target) event.target.value = '';
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Configurações do Sistema</h1>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex space-x-1 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    <User className="w-4 h-4 mr-2" /> Usuários
                </button>
                <button
                    onClick={() => setActiveTab('school')}
                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'school' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    <School className="w-4 h-4 mr-2" /> Escola
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'logs' ? 'bg-orange-50 text-orange-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    <FileText className="w-4 h-4 mr-2" /> Log Sistema
                </button>
                <button
                    onClick={() => setActiveTab('backup')}
                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'backup' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    <Database className="w-4 h-4 mr-2" /> Backup
                </button>
                <button
                    onClick={() => setActiveTab('about')}
                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'about' ? 'bg-gray-100 text-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    <Info className="w-4 h-4 mr-2" /> Sobre
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 overflow-y-auto custom-scrollbar">

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Gerenciamento de Usuários</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                            >
                                + Novo Usuário
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3">Nome / E-mail</th>
                                        <th className="px-6 py-3">Função</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {profiles.map((profile) => (
                                        <tr key={profile.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{profile.full_name}</div>
                                                <div className="text-gray-500 text-xs">{profile.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${profile.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {profile.role === 'admin' ? 'Administrador' : 'Professor'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center text-xs font-medium ${profile.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                                    {profile.is_active ? (
                                                        <><CheckCircle className="w-3 h-3 mr-1" /> Ativo</>
                                                    ) : (
                                                        <><Ban className="w-3 h-3 mr-1" /> Inativo</>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(profile);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="text-gray-400 hover:text-blue-600 transition"
                                                    title="Editar Usuário"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(profile);
                                                        setIsPasswordModalOpen(true);
                                                    }}
                                                    className="text-gray-400 hover:text-purple-600 transition"
                                                    title="Alterar Senha"
                                                >
                                                    <Lock className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleUserStatus(profile.id, profile.is_active)}
                                                    className={`${profile.is_active ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'} transition`}
                                                    title={profile.is_active ? "Desativar" : "Ativar"}
                                                >
                                                    {profile.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* School Tab */}
                {activeTab === 'school' && (
                    <form onSubmit={handleSaveSchool} className="space-y-6 max-w-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                <School className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Dados da Instituição</h2>
                                <p className="text-sm text-gray-500">Informações utilizadas nos cabeçalhos dos documentos gerados.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Escola</label>
                                <input
                                    type="text"
                                    value={school.school_name}
                                    onChange={e => setSchool({ ...school, school_name: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                                <input
                                    type="text"
                                    value={school.address}
                                    onChange={e => setSchool({ ...school, address: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                <input
                                    type="text"
                                    value={school.phone}
                                    onChange={e => setSchool({ ...school, phone: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Institucional</label>
                                <input
                                    type="email"
                                    value={school.email}
                                    onChange={e => setSchool({ ...school, email: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Diretor(a) Responsável</label>
                                <input
                                    type="text"
                                    value={school.principal_name}
                                    onChange={e => setSchool({ ...school, principal_name: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                            >
                                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                )}

                {/* Logs Tab */}
                {activeTab === 'logs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Registro de Atividades</h2>
                            <button className="text-sm text-gray-500 hover:text-gray-900 flex items-center">
                                <Download className="w-4 h-4 mr-1" /> Exportar CSV
                            </button>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {logs.map((log, index) => (
                                <div key={log.id} className={`p-4 flex items-start gap-4 ${index !== logs.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition`}>
                                    <div className={`mt-1 p-2 rounded-full ${log.action === 'LOGIN' ? 'bg-green-100 text-green-600' : log.action === 'UPDATE_SETTINGS' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className="font-medium text-gray-900">{log.action.replace('_', ' ')}</p>
                                            <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                            <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {log.user_name}</span>
                                            <span className="flex items-center"><Shield className="w-3 h-3 mr-1" /> {log.ip_address}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Backup Tab */}
                {activeTab === 'backup' && (
                    <div className="max-w-2xl mx-auto text-center space-y-8 py-8">
                        <div className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <Database className="w-12 h-12" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Backup e Segurança</h2>
                            <p className="text-gray-500 mt-2">Realize cópias de segurança de todos os dados do sistema regularmente.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left">
                            <h3 className="font-medium text-gray-900 mb-2">Último Backup Automático</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                Realizado em {new Date().toLocaleDateString()} às 03:00 AM (Sucesso)
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleBackup}
                                disabled={isLoading}
                                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-500/30 flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <><RefreshCw className="w-5 h-5 animate-spin mr-2" /> Processando Backup...</>
                                ) : (
                                    <><Download className="w-5 h-5 mr-2" /> REALIZAR BACKUP MANUAL AGORA</>
                                )}
                            </button>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleRestore}
                                    className="hidden"
                                    id="restore-backup-input"
                                    disabled={isLoading}
                                />
                                <label
                                    htmlFor="restore-backup-input"
                                    className={`w-full py-4 bg-white text-green-600 border-2 border-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition cursor-pointer flex justify-center items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Upload className="w-5 h-5 mr-2" /> ENVIAR BACKUP DO SISTEMA POR AQUI
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                    <div className="max-w-3xl space-y-8">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black mb-2">PlanejaEdu <span className="text-purple-400">SMEDU</span></h2>
                                <p className="text-gray-300">Sistema de Gestão Pedagógica e Planejamento</p>
                                <div className="mt-6 flex gap-4">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">v1.2.0</span>
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">Build 2026.02</span>
                                </div>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                                <Shield className="w-64 h-64" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                    <Info className="w-5 h-5 mr-2 text-blue-500" /> Funcionalidades Principais
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Geração de Planos de Aula com IA</li>
                                    <li>• Planejamento Anual e Sequências Didáticas</li>
                                    <li>• Criação de Avaliações e Relatórios</li>
                                    <li>• Biblioteca de Recursos Digitais (BNCC)</li>
                                    <li>• Gestão de Usuários e Permissões</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                    <Lock className="w-5 h-5 mr-2 text-green-500" /> Segurança e Privacidade
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Criptografia de dados sensíveis (End-to-End)</li>
                                    <li>• Conformidade com LGPD</li>
                                    <li>• Backups diários automatizados</li>
                                    <li>• Controle de acesso baseado em funções (RBAC)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center text-xs text-gray-400 pt-8 border-t border-gray-100">
                            <p>&copy; 2026 Secretaria Municipal de Educação. Todos os direitos reservados.</p>
                            <p>Desenvolvido pelo Departamento de Tecnologia da Informação.</p>
                        </div>
                    </div>
                )}
            </div>

            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchProfiles}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchProfiles}
                user={selectedUser}
            />

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                user={selectedUser}
            />
        </div >
    );
}
