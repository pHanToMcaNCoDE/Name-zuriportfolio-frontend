'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthMutation from '../../hooks/Auth/useAuthMutation';
import { signUpWithOAuth } from '../../http/auth';
import { ADMIN_ID, useAuth } from '../../context/AuthContext';
import { notify } from '@ui/Toast';
import Head from 'next/head';

function FacebookRedirect() {
  const router = useRouter();
  const { handleAuth, userCameFrom } = useAuth();
  const { mutate: signUserWithFacebook } = useAuthMutation(signUpWithOAuth, {
    onSuccess: (data) => {
      // TODO: Find out the response for succesful signup for users with 2fa enabled and disabled
      console.log('Google success data: ', data);

      const token = data.data.token;
      localStorage.setItem('zpt', token);

      // Checking if user enabled 2fa
      if (data?.response && data?.response?.message === 'TWO FACTOR AUTHENTICATION CODE SENT') {
        // Setting to localStorage because 2fa page needs them
        localStorage.setItem('zpt', data?.response?.token);
        localStorage.setItem('email', data?.response?.email);

        router.push('/auth/2fa');
        return;
      }

      if (data.message === 'Login successful') {
        handleAuth(data.data);
        localStorage.setItem('zpt', data?.data?.token);

        // redirecting the user  to admin dashbord if they are an admin
        if (data.data.user.roleId === ADMIN_ID) {
          router.push('/super-admin/analytics-and-reporting');
          return;
        }

        router.push(userCameFrom || '/explore');
        return;
      }
    },
    onError: (error) => {
      notify({
        message: 'Error logging in. Please try again.',
        type: 'error',
      });

      // if an error occurs, take the user to where they came from or to home page if undefined
      router.push(userCameFrom || '/');
    },
  });

  useEffect(() => {
    const query = window.location.search.split('?')[1];

    signUserWithFacebook({ query, oAuth: 'facebook' });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  return (
    <>
      <Head>
        <link rel="icon" href="/assets/zuriLogo.svg" />

        {/* SEO Stuff start */}
        <title>Facebook Redirect - Zuri Portfolio</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Zuri Portfolio" />

        <meta key="metaname" itemProp="name" name="title" content="Zuri Portfolio" />
        <meta
          key="metadescription"
          itemProp="description"
          name="description"
          content="Facebook redirect for you Zuri Portfolio."
        />
        <meta name="keywords" content="Zuri, Portfolio, Facebook redirect" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

        <meta name="language" content="English" />
        {/* <meta key="metaimage" itemProp="image" name="image" content="screen image is supposed to be here" /> */}

        {/* <!-- Twitter Meta Tags --> */}
        <meta key="twitter:title" name="twitter:title" content="Zuri Portfolio" />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="Facebook redirect for you Zuri Portfolio."
        />
        <meta key="twitter:image" name="twitter:image" content="https://staging.zuri.team/auth/facebook-redirect" />
        {/* <meta key="twitter:card" name="twitter:card" content="summary_large_image" /> */}

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://staging.zuri.team" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Zuri Portfolio" />
        <meta property="og:description" content="Facebook redirect for you Zuri Portfolio." />
        {/* <meta property="og:image" content="https://i.imgur.com/3JjV8Dx.jpg" /> */}

        {/* SEO Stuff end */}
      </Head>
      <div className="flex item-center justify-center mt-[2rem]">Please Wait...</div>
    </>
  );
}
export default FacebookRedirect;
