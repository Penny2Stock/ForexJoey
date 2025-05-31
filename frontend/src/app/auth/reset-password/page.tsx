'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiArrowLeftLine, RiMailLine, RiLockUnlockLine } from 'react-icons/ri';
import { supabase } from '@/services/supabase';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset password email. Please try again.');
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
      
      <div className="container max-w-md mx-auto px-4 py-16 flex-1 flex flex-col justify-center relative z-10">
        <div className="mb-6">
          <Link href="/auth/sign-in" className="text-gray-400 hover:text-white flex items-center">
            <RiArrowLeftLine className="mr-2" /> Back to Sign In
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
                  <RiLockUnlockLine className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-white">Reset your password</h1>
                <p className="text-gray-400 mt-2">We'll send you a link to reset your password</p>
              </div>
              
              <form onSubmit={handleResetPassword} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
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
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-glow transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center text-green-400 mx-auto mb-4">
                <RiMailLine className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-gray-300 mb-6">
                We've sent a password reset link to <span className="text-blue-400">{email}</span>. 
                Please check your inbox and follow the instructions.
              </p>
              <Link
                href="/auth/sign-in"
                className="inline-block px-6 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
