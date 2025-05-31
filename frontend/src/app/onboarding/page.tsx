'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { supabase } from '@/services/supabase';

/**
 * Onboarding Page
 * 
 * This page presents new users with an educational flow focused on:
 * 1. Understanding ForexJoey's AI-first approach
 * 2. Learning proper risk management techniques
 * 3. Setting up account parameters for optimal trading
 * 
 * The page ensures users are properly authenticated before accessing
 * the onboarding experience, redirecting to login if necessary.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // If not logged in, redirect to login
          router.push('/login?redirect=/onboarding');
          return;
        }
        
        setIsAuthenticated(true);
        
        // Check if user has already completed onboarding
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('content_id', 'onboarding-complete')
          .eq('completed', true)
          .single();
          
        if (data) {
          // If already completed, set state but don't redirect (allow reviewing)
          setHasCompletedOnboarding(true);
        }
        
      } catch (err) {
        console.error('Error checking authentication:', err);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-primary">Loading your personalized experience...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show message (redirect happens in useEffect)
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If already completed onboarding, show welcome back message with option to review
  if (hasCompletedOnboarding) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-lg p-8 shadow-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Welcome Back to ForexJoey</h1>
          <p className="mb-6">
            You've already completed the onboarding process. You can review the material
            again or head back to your dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setHasCompletedOnboarding(false)}
              className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-foreground font-medium rounded-lg"
            >
              Review Onboarding
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show onboarding flow
  return <OnboardingFlow />;
}
