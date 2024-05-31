"use client";

import { useState, useEffect, useContext } from 'react';
import { DynamicWidget, UserProfile, useAuthenticateConnectedUser, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import Loading from '../components/loaderhere';
import { ContextValue } from "../context/context";
import { useRouter } from "next/navigation";
import Loader from "../components/loaderhere";
import { useBalance, useContractRead } from 'wagmi';

const Page = () => {
  const router = useRouter();
  const { user, isAuthenticated, handleLogOut } = useDynamicContext();
  const { isAuthenticating } = useAuthenticateConnectedUser();
  // const [verifiedCredentials, setVerifiedCredentials] = useState<UserProfile | null>(null);
  const [loader, setLoader] = useState(1);
  const { scores, settings, manageUser } = useContext(ContextValue);

  //TODO: look over this
  let stringer = "";
  if (user && user.verifiedCredentials?.[0]?.address) {
    stringer = user.verifiedCredentials?.[0]?.address.slice(2);
  }
  const { data: ethBalanceData } = useBalance({
    address: `0x${stringer}`,
  });


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

  // const { primaryWallet } = useDynamicContext();

  // useEffect(() => {
  //     const fetchEthBalance = async () => {
  //         if (primaryWallet) {
  //             const value = await primaryWallet.connector.getBalance();
  //             if (value) {
  //                 setEthBalance(value);
  //                 console.log(primaryWallet.address);
  //                 netWorthCalc(primaryWallet.address);
  //             }
  //         }
  //     };  


  //     fetchEthBalance();
  // }, [primaryWallet]);

  return (
    <>
      {loader === 1 ?
        <Loader />
        :
        <div>
          {isAuthenticated === false ?
            <div>LOADING...</div>
            :
            user ? (
              <div>
                <p>Issuer: {user.userId}</p>
                <p>email: {user.email}</p>
                <p>lastVerifiedCredentialId: {user.lastVerifiedCredentialId}</p>
                <p>environmentId: {user.environmentId}</p>
                <p>username: {settings.username}</p>
              </div>
            ) : (
              <p>No verified credentials available</p>
            )}

          {scores.totalWorth}
          {ethBalanceData ? <p>ETH Balance (wagmi): {ethBalanceData.formatted}</p> : <p>Loading ETH balance...</p>}
          {/* <h3>Native Balance: {nativeBalance?.balance.ether} ETH</h3>  */}
        </div>
      }
    </>
  );
};

export default Page;
