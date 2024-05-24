"use client";
import React, { useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { useAuthenticateConnectedUser, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useRouter } from 'next/navigation';
import { ContextValue } from "../context/context";
import Loader from "../components/loaderhere";

interface LeaderboardEntry {
    dynamicUserId: string;
    username: string;
    profilePicture: string;
    score: number;
}

const Leaderboard = () => {

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const router = useRouter();
    const { user, isAuthenticated, handleLogOut } = useDynamicContext();
    const { isAuthenticating } = useAuthenticateConnectedUser();
    // const [verifiedCredentials, setVerifiedCredentials] = useState<UserProfile | null>(null);
    const [loader, setLoader] = useState(1);
    const { manageUser } = useContext(ContextValue);

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

    const fetchData = async () => {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        if (data) {
            setLeaderboard(data);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const channel = supabase
            .channel('leaderboard showcase realtime')
            .on('postgres_changes', {
                event: "*",
                schema: "public",
                table: "UserScores"
            }, () => {
                console.log('Change received!');
                fetchData();
            }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <>
            {loader === 1 ?
                <Loader />
                :
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
                    <table className="min-w-full bg-blue-400">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Username</th>
                                <th className="py-2 px-4 border-b">Profile Picture</th>
                                <th className="py-2 px-4 border-b">Net Worth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{entry.username}</td>
                                    <td className="py-2 px-4 border-b">
                                        {entry.profilePicture ? (
                                            <img
                                                src={entry.profilePicture}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <p>No image</p>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">{entry.score.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </>
    );
};

export default Leaderboard;