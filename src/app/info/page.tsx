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
    const [verifiedCredentials, setVerifiedCredentials] = useState<UserProfile | null>(null);
    const [ethBalance, setEthBalance] = useState<string | null>(null);
    const [loader, setLoader] = useState(1);
    const { netWorthCalc } = useContext(ContextValue);

    const { data: ethBalanceData } = useBalance({
        address: '0x4557B18E779944BFE9d78A672452331C186a9f48',
    });


    // 0x4557B18E779944BFE9d78A672452331C186a9f48
    
    useEffect(() => {
        setTimeout(() => {
            if (isAuthenticated === false && isAuthenticating === false) {
                setTimeout(() => {
                    setLoader(0);
                }, 300);
                router.push("/login");
            }
            else if (isAuthenticated === true && isAuthenticating === false) {
                setTimeout(() => {
                    setLoader(0);
                }, 300);
            }
            console.log(isAuthenticating, isAuthenticated);
        }, 1000)
    }, [isAuthenticated, isAuthenticating, router]);

    useEffect(() => {
        if (user) {
            setVerifiedCredentials(user);
        }
    }, [user]);

    useEffect(() => {
        console.log(isAuthenticating, isAuthenticated);
    }, [isAuthenticating]);

    const { primaryWallet } = useDynamicContext();

    useEffect(() => {
        const fetchEthBalance = async () => {
            if (primaryWallet) {
                const value = await primaryWallet.connector.getBalance();
                if (value) {
                    setEthBalance(value + 0.000001);
                    console.log(primaryWallet.address);
                    netWorthCalc(primaryWallet.address);
                }
            }
        };  


        fetchEthBalance();
    }, [primaryWallet]);

    return (
        <>
            {loader === 1 ?
                <Loader />
                :
                <div>
                    {isAuthenticated === false ?
                        <div>LOADING...</div>
                        :
                        verifiedCredentials ? (
                            <div>
                                <p>Issuer: {verifiedCredentials.userId}</p>
                                <p>email: {verifiedCredentials.email}</p>
                                <p>lastVerifiedCredentialId: {verifiedCredentials.lastVerifiedCredentialId}</p>
                                <p>environmentId: {verifiedCredentials.environmentId}</p>
                                <p>username: {verifiedCredentials.verifiedCredentials.length === 3 && verifiedCredentials.verifiedCredentials[2].oauthDisplayName}</p>
                            </div>
                        ) : (
                            <p>No verified credentials available</p>
                        )}

                    {ethBalance ? <p>ETH Balance: {ethBalance}</p> : <p>Loading ETH balance...</p>}
                    {ethBalanceData ? <p>ETH Balance (wagmi): {ethBalanceData.formatted}</p> : <p>Loading ETH balance...</p>}
                    {/* <h3>Native Balance: {nativeBalance?.balance.ether} ETH</h3>  */}
                </div>
            }
        </>
    );
};

export default Page;
