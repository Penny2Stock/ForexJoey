'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiMailLine, RiCheckLine, RiErrorWarningLine } from 'react-icons/ri';
import { supabase } from '@/services/supabase';

// Separate client component for handling verification
function VerifyEmailContent() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if we have the necessary parameters in the URL
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (!token_hash || !type) {
          setError('Invalid verification link. Please request a new one.');
          setIsVerifying(false);
          return;
        }
        
        // Verify the email with Supabase
        if (type === 'email_change' || type === 'signup') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type === 'signup' ? 'signup' : 'email_change',
          });
          
          if (error) {
            throw error;
          }
          
          setIsSuccess(true);
          
          // Redirect to onboarding after 3 seconds
          setTimeout(() => {
            router.push('/onboarding');
          }, 3000);
        } else {
          setError('Invalid verification type');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to verify email. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyEmail();
  }, [searchParams, router]);

  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-glow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isVerifying ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Verifying Your Email</h2>
          <p className="text-gray-300">
            Please wait while we verify your email address...
          </p>
        </div>
      ) : isSuccess ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center text-green-400 mx-auto mb-4">
            <RiCheckLine className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
          <p className="text-gray-300 mb-8">
            Your email has been successfully verified.<br />
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
      ) : (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
            <RiErrorWarningLine className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
          <p className="text-gray-300 mb-6">
            {error || 'Something went wrong with the verification process.'}
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-block px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      )}
    </motion.div>
  );
}

// Main page component with Suspense boundary
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-black flex flex-col">
      {/* Background accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
      </div>
      
      <div className="container max-w-md mx-auto px-4 py-16 flex-1 flex flex-col justify-center relative z-10">
        <Suspense fallback={
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Loading...</h2>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
