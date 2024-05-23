"use client";
import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

interface LeaderboardEntry {
    dynamicUserId: string;
    username: string;
    profilePicture: string;
    score: number;
}

const Leaderboard = () => {

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

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
                event : "*",
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
    );
};

export default Leaderboard;