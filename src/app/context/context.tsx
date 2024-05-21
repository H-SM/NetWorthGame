"use client";

import { User, UserScores, UserSettings } from "@prisma/client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ContextTypes = {
    settings: UserSettings;
    changeSettings: (changedSet: UserSettings) => void;
    scores: UserScores;
    changeScore: (changedSet: UserScores) => void;
    theme: boolean;
    toggleTheme: () => void;
    random: () => void;
    fetchOrCreateUser: (
        dynamicUserId: string,
        info: {
            username: string;
            picture: string;
            theme: boolean;
            multiplier: number;
            netWorth: number;
        }
    ) => Promise<User | undefined>;
};

const ContextDefaultValues: ContextTypes = {
    settings: {} as UserSettings,
    changeSettings: (changedSet: UserSettings) => { },
    scores: {} as UserScores,
    changeScore: (changedSet: UserScores) => { },
    theme: true,
    toggleTheme: () => { },
    random: () => { },
    fetchOrCreateUser: async () => undefined,
};

export const ContextValue = createContext<ContextTypes>(ContextDefaultValues);

export function useTheme() {
    return useContext(ContextValue);
}

type Props = {
    children: ReactNode;
}

export function ContextProvider({ children }: Props) {
    const [theme, setTheme] = useState<boolean>(false);
    const [settings, setSettings] = useState<UserSettings>({} as UserSettings);
    const [scores, setScore] = useState<UserScores>({} as UserScores);

    const toggleTheme = () => {
        setTheme(!theme);
    };

    const random = () => {
        console.log("ji");
    };

    const changeSettings = (changedSet: UserSettings) => {
        setSettings(changedSet)
    }

    const changeScore = (changedSet: UserScores) => {
        setScore(changedSet)
    }

    const fetchOrCreateUser = async (
        dynamicUserId: string,
        info: {
            username: string;
            picture: string;
            theme: boolean;
            multiplier: number;
            netWorth: number;
        }
    ): Promise<User | undefined> => {
        try {
            const response = await fetch(`/api/login?dynamicUserId=${dynamicUserId}`);

            if (response.ok) {
                const user = await response.json();
                console.log(user);
                changeSettings(user.settings);
                changeScore(user.scores);
                return user;
            } else if (response.status === 404) {
                // User not found, create a new user
                const { username, picture, theme, multiplier, netWorth } = info;
                const newUserResponse = await fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        dynamicUserId,
                        username,
                        picture,
                        theme,
                        multiplier,
                        netWorth,
                    }),
                });

                if (newUserResponse.ok) {
                    const newUser = await newUserResponse.json();
                    console.log(newUser);
                    changeSettings(newUser.settings);
                    changeScore(newUser.scores);
                    return newUser;
                } else {
                    throw new Error("Failed to create a new user");
                }
            } else {
                throw new Error("Failed to fetch the user");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const value = {
        settings,
        changeSettings,
        scores,
        changeScore,
        theme,
        toggleTheme,
        random,
        fetchOrCreateUser
    };

    return (
        <ContextValue.Provider value={value}>
            {children}
        </ContextValue.Provider>
    );
}
