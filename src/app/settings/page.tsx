"use client";

import { useEffect, useState, useContext } from 'react';
import { ContextValue } from "./../context/context";
import { useAuthenticateConnectedUser, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useRouter } from "next/navigation";
import Loader from "./../components/loaderhere"

const Settings = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useDynamicContext();
  const { isAuthenticating } = useAuthenticateConnectedUser();
  const { settings, scores, manageUser } = useContext(ContextValue);

  const [loader, setLoader] = useState(1);
  useEffect(() => {
    setTimeout(() => {
      if (isAuthenticated === false && isAuthenticating === false) {
        setTimeout(() => {
          setLoader(0);
        }, 300);
        router.push("/login");
      }
      else if (isAuthenticated === true && isAuthenticating === false) {
        const settingsValue = JSON.parse(localStorage.getItem('settings') ?? '{}');
        if (user?.userId !== settingsValue.userId && user) {
          const userData = {
            dynamicUserId: user.userId ?? "",
            picture: user.verifiedCredentials?.[2]?.oauthAccountPhotos?.[0] ?? "",
            username: user.verifiedCredentials?.[2]?.oauthUsername ?? "",
            theme: true,
            multiplier: 1,
            netWorth: 0,
            totalWorth: 0,
          };

          manageUser(userData, user.verifiedCredentials?.[0]?.address ?? "")
        }
        setTimeout(() => {
          setLoader(0);
        }, 300);
      }
      console.log(isAuthenticating, isAuthenticated);
    }, 1000)
  }, []);

  return (
    <>
      {loader === 1 ?
        <Loader />
        :
        <>
          <div>
            this is settings
            username
            profilepicture
            theme
            logout
            help & support
            Data Deletion
            feedback & suggestions
          </div>
        </>
      }
    </>
  );
}

export default Settings
