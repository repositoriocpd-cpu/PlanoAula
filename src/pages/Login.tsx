import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Auto-navigate if the listener already caught the session
    React.useEffect(() => {
        if (user && !isLoading) {
            console.log('User already detected in Login, navigating home...');
            navigate('/');
        }
    }, [user, navigate, isLoading]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            console.log('Attempting login for:', email);

            // Add a timeout to the login request
            const loginPromise = supabase.auth.signInWithPassword({
                email,
                password,
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Tempo limite de conexão excedido. Verifique sua internet.')), 15000)
            );

            const { error: authError } = await Promise.race([loginPromise, timeoutPromise]) as any;

            if (authError) {
                console.error('Auth error returned:', authError);
                throw authError;
            }

            console.log('Login successful, navigating...');
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Falha ao entrar. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-300/30 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl h-[80vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden relative z-10 mx-4">

                {/* Left Side - Visual / Branding */}
                <div className="hidden md:flex flex-col justify-center items-center w-1/2 relative bg-gradient-to-br from-purple-600 to-pink-600 text-white p-12">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://source.unsplash.com/random/800x1200/?education,book')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                    <div className="text-center z-10">
                        <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md mb-8 inline-block shadow-lg">
                            <BookOpen size={64} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black mb-4 tracking-tight leading-tight">
                            PlanejaEdu
                        </h1>
                        <p className="text-xl font-light text-purple-100 mb-8">
                            Transformando o futuro da educação com tecnologia e criatividade.
                        </p>
                        <div className="flex gap-2 justify-center opacity-60">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                    </div>
                    <div className="absolute bottom-6 text-xs text-purple-200/60 font-mono">
                        v1.2.0 • SMEDU
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/80 backdrop-blur-sm">
                    <div className="max-w-sm mx-auto w-full">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo(a)</h2>
                        <p className="text-gray-500 mb-8">Acesse sua conta para gerenciar planos e conteúdos.</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center animate-pulse">
                                <Lock className="w-4 h-4 mr-2" /> {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50 focus:bg-white transition-all duration-300 outline-none"
                                        placeholder="seu.email@escola.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50 focus:bg-white transition-all duration-300 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="flex justify-end mt-2">
                                    <a href="#" className="text-xs text-purple-600 hover:text-purple-800 font-medium hover:underline transition">
                                        Esqueceu a senha?
                                    </a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-white font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl shadow-purple-500/20 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin h-6 w-6" />
                                ) : (
                                    <>
                                        Entrar no Sistema
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 text-center w-full text-xs text-gray-400">
                &copy; {new Date().getFullYear()} PlanejaEdu. Todos os direitos reservados.
            </div>
        </div>
    );
}
