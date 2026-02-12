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
        <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
            {/* Split Screen Layout */}
            <div className="flex w-full h-screen overflow-hidden bg-white shadow-2xl">

                {/* LEFT SIDE - VISUAL & VIDEO */}
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-purple-900">
                    {/* Video Background */}
                    <div className="absolute inset-0 w-full h-full z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
                        >
                            <source src="/assets/videos/student.mp4" type="video/mp4" />
                            {/* Fallback image */}
                            <img
                                src="https://source.unsplash.com/random/1920x1080/?students,school,learning"
                                alt="Background"
                                className="w-full h-full object-cover"
                            />
                        </video>
                        {/* Gradient Overlay - Smooth Purple/Pink Shading */}
                        {/* Base opacity layer */}
                        <div className="absolute inset-0 bg-purple-900/40 mix-blend-multiply"></div>
                        {/* Gradient from top-left (lighter) to bottom-right (darker) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/80 via-purple-900/80 to-pink-900/80 mix-blend-multiply"></div>
                        {/* Radial gradient for center focus */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/60"></div>
                    </div>

                    {/* Branding Content */}
                    <div className="relative z-10 top-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/30">
                                <BookOpen className="text-white h-6 w-6" />
                            </div>
                            <span className="text-white font-bold tracking-wider text-sm uppercase opacity-100 shadow-sm" style={{ fontFamily: "'Alexandria', sans-serif" }}>SMEDU D.G.E.</span>
                        </div>
                    </div>

                    <div className="relative z-10 mb-12">
                        <div className="mb-4">
                            <span className="px-3 py-1 rounded-full bg-pink-500/30 text-white text-xs font-semibold border border-white/20 backdrop-blur-sm">
                                Sistema Online
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-white mb-6 leading-tight drop-shadow-xl" style={{ fontFamily: "'Alexandria', sans-serif" }}>
                            SMEDU <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200">
                                Departamento Geral de Ensino
                            </span>
                        </h1>
                        <p className="text-lg text-pink-50 max-w-md leading-relaxed drop-shadow-md">
                            <span className="font-bold text-white block mb-1">Professor, Seu Tempo é Precioso!</span>
                            Esqueça a burocracia. Use o PlanejaEdu para criar planos de aula, avaliações e relatórios em segundos.
                        </p>

                        {/* Status Indicators */}
                        <div className="flex items-center gap-6 mt-8">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold shadow-md">
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm font-medium text-white shadow-sm">
                                <span className="text-white font-bold">Um Plus</span> na Geração de Planejamentos
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - LOGIN FORM */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white text-gray-800 relative">

                    <div className="w-full max-w-md z-10 bg-white p-8 rounded-2xl shadow-xl lg:shadow-none border border-gray-100 lg:border-none">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-3 text-gray-900">Bem-vindo de volta!</h2>
                            <p className="text-gray-500">Insira suas credenciais para acessar a plataforma.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center">
                                <Lock className="w-4 h-4 mr-2" /> {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">E-mail Corporativo</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none"
                                        placeholder="exemplo@smedu.rj.gov.br"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Senha</label>
                                    <a href="#" className="text-xs text-blue-600 hover:text-blue-700 transition font-medium">
                                        Esqueceu a senha?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center mb-6">
                                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                                    Lembrar-me
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin h-6 w-6" />
                                ) : (
                                    <>
                                        Entrar na Plataforma
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-400">
                                © {new Date().getFullYear()} SMEDU D.G.E. - Todos os direitos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
