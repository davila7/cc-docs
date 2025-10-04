import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import Layout from '@theme/Layout';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const history = useHistory();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automatically handles the callback
        // Just check if we have a session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          history.push('/');
          return;
        }

        if (session) {
          // Redirect to profile page
          history.push('/profile');
        } else {
          // No session, redirect to home
          history.push('/');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        history.push('/');
      }
    };

    handleCallback();
  }, [history]);

  return (
    <Layout title="Authenticating..." description="Authentication callback">
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '1.2rem',
        color: 'var(--ifm-color-emphasis-600)'
      }}>
        Authenticating with GitHub...
      </div>
    </Layout>
  );
}
