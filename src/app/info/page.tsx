"use client";

import { useState, useEffect } from 'react';
import { DynamicWidget, UserProfile, Wallet, useAuthenticateConnectedUser, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import Loading from '../components/loaderhere';
import { ContextValue } from "./../context/context";
import { useContext } from "react";

const Page = () => {
    const { user, isAuthenticated, handleLogOut } = useDynamicContext();
    const { isAuthenticating } = useAuthenticateConnectedUser();
    const [verifiedCredentials, setVerifiedCredentials] = useState<UserProfile | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setVerifiedCredentials(user);
        }
    }, [user]);

    useEffect(() => {
        console.log(isAuthenticating, isAuthenticated);
    }, [isAuthenticating])
    const { primaryWallet } = useDynamicContext();

    useEffect(() => {
        const fetchBalance = async () => {
            if (primaryWallet) {
                const value = await primaryWallet.connector.getBalance();
                if (value) {
                    setBalance(value + 0.000001);
                }
            }
        };
        fetchBalance();
    }, [primaryWallet]);

    // console.log(verifiedCredentials);
    // console.log(isAuthenticated);
    if (verifiedCredentials === undefined) {
        //TODO: overlook this state
        return <Loading />;
    }

    const { theme, toggleTheme } = useContext(ContextValue);
    return (
        <div>
            {isAuthenticated === false ?
                <div>LOADING...</div>
                :
                verifiedCredentials && verifiedCredentials ? (
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

            {balance ? <p>Wallet Balance: {balance}</p> : <p>Loading balance...</p>}
            UR THEME : {theme === true ? "dark" : "light"}
        </div>
    );
}

export default Page;
