"use client";

import { DynamicWidget, useAuthenticateConnectedUser, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useEffect, useState, useContext } from 'react';
import { User } from '@prisma/client';
import { ContextValue } from "./../context/context";

const Login = () => {
    const { fetchOrCreateUser } = useContext(ContextValue);
    const { user, isAuthenticated, primaryWallet } = useDynamicContext();
    const { isAuthenticating } = useAuthenticateConnectedUser();
    const [balance, setBalance] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchBalance = async () => {
            if (primaryWallet) {
                try {
                    const value = await primaryWallet.connector.getBalance();
                    setBalance(value);
                } catch (error) {
                    console.error('Error fetching balance:', error);
                }
            }
        };
        fetchBalance();
    }, [primaryWallet]);

    useEffect(() => {
        const handleFetchOrCreateUser = async () => {
            if (isAuthenticated && !isAuthenticating && user && balance !== undefined) {
                const userData = {
                    dynamicUserId: user.userId ?? "",
                    picture: user.verifiedCredentials?.[2]?.oauthAccountPhotos?.[0] ?? "", 
                    username: user.verifiedCredentials?.[2]?.oauthUsername ?? "",
                    theme: true,
                    multiplier: 0,
                    netWorth: parseFloat(balance),
                };

                try {
                    const fetchedOrCreatedUser = await fetchOrCreateUser(userData.dynamicUserId, userData);
                } catch (error) {
                    console.error('Error fetching or creating user:', error);
                }
            }
        };

        handleFetchOrCreateUser();
    }, [isAuthenticated, isAuthenticating, user, balance]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center text-white">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center">
                        <img src="/logo.png" alt="logo" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">Onboard the world</h1>
                <p className="text-lg mb-16">
                    Web3 login for <span className="text-blue-400">everyone</span>.
                </p>
                <DynamicWidget />
                <button
                    className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => { }}
                >
                    Test fetchOrCreateUser
                </button>
                <div className="flex mt-16 space-x-4 ">
                    <a
                        href="https://docs.dynamic.xyz/"
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 inline-flex items-center justify-center rounded-lg border-2 border-[#3B3636] shadow-lg w-64"
                    >
                        <h2 className="font-semibold">Docs</h2>
                    </a>
                    <a
                        href="https://demo.dynamic.xyz/"
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 inline-flex items-center justify-center border-2 border-[#3B3636] rounded-lg shadow-lg w-64"
                    >
                        <h2 className="font-semibold">Demo</h2>
                    </a>
                    <a
                        href="https://app.dynamic.xyz/"
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 inline-flex items-center justify-center border-2 border-[#3B3636] rounded-lg shadow-lg w-64"
                    >
                        <h2 className="font-semibold">Dashboard</h2>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;