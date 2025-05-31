'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiArrowLeftLine, RiUserLine, RiLockLine, RiMailLine, RiCheckLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { supabase } from '@/services/supabase';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with Supabase - user profile will be created automatically via database trigger
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            risk_profile: 'moderate',
            experience_level: 'beginner'
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        }
      });

      if (signUpError) throw signUpError;
      
      // The database trigger will automatically create the user profile and risk management rules

      setIsSuccess(true);
      
      // Redirect to onboarding in 3 seconds
      setTimeout(() => {
        router.push('/onboarding');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-black flex flex-col">
      {/* Background accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
      </div>
      
      <div className="container max-w-md mx-auto px-4 py-12 flex-1 flex flex-col justify-center relative z-10">
        <div className="mb-6">
          <Link href="/" className="text-gray-400 hover:text-white flex items-center">
            <RiArrowLeftLine className="mr-2" /> Back to Home
          </Link>
        </div>
        
        <motion.div
          className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white mx-auto mb-4">
                  <RiUserLine className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-white">Create your account</h1>
                <p className="text-gray-400 mt-2">Join ForexJoey for AI-powered trading signals</p>
              </div>
              
              <form onSubmit={handleSignUp} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <RiUserLine />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/70 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <RiMailLine />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/70 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <RiLockLine />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-gray-800/70 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    At least 8 characters
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      required
                      className="w-4 h-4 border border-gray-600 rounded bg-gray-800 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-400">
                      I agree to the <a href="/terms" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-glow transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
                
                <div className="text-center mt-6">
                  <p className="text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link href="/auth/sign-in" className="text-blue-400 hover:text-blue-300">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center text-green-400 mx-auto mb-4">
                <RiCheckLine className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
              <p className="text-gray-300 mb-8">
                Check your email to verify your account.<br />
                Redirecting to onboarding...
              </p>
              <div className="flex justify-center">
                <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                  ></motion.div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
