import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { Profile } from '../types/settings';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        console.log('fetchProfile started for:', userId);
        try {
            // Add a specific timeout for the database query
            const profilePromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timeout')), 15000)
            );

            const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

            if (error) {
                console.warn('Error fetching profile (expected if new user):', error);
                return null;
            }
            console.log('Profile fetched successfully');
            return data as Profile;
        } catch (error) {
            console.error('fetchProfile exploded:', error);
            return null;
        }
    };

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            console.log('Starting getSession...');
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                console.log('Session retrieved:', session?.user?.email);

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    console.log('Fetching profile for:', session.user.id);
                    const userProfile = await fetchProfile(session.user.id);
                    console.log('Profile retrieved:', userProfile?.full_name);
                    setProfile(userProfile);
                }
            } catch (err) {
                console.error('Error getting session:', err);
                setSession(null);
                setUser(null);
                setProfile(null);
            } finally {
                // Ensure loading is set to false even if we are still waiting for profile
                console.log('setLoading(false) in getSession');
                setLoading(false);
            }
        };

        const failsafe = setTimeout(() => {
            if (loading) {
                console.warn('Auth failsafe triggered after 20s - Forcing loading=false');
                setLoading(false);
            }
        }, 20000);

        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            try {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    console.log('Fetching profile for event:', session.user.id);
                    // Don't wait for profile to set loading to false
                    setLoading(false);
                    const userProfile = await fetchProfile(session.user.id);
                    setProfile(userProfile);
                } else {
                    setProfile(null);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error in onAuthStateChange:', error);
                setLoading(false);
            }
        });

        return () => {
            clearTimeout(failsafe);
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        console.log('signOut called');
        try {
            await supabase.auth.signOut();
            console.log('Supabase signOut successful');
        } catch (error) {
            console.error('Error during Supabase signOut:', error);
        } finally {
            // Force clear state locally
            setSession(null);
            setUser(null);
            setProfile(null);
            console.log('Local auth states cleared');
        }
    };

    const value = {
        user,
        session,
        profile,
        loading,
        signOut
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
