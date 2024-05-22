"use client";

import { User, UserScores, UserSettings } from "@prisma/client";
import { useRouter } from "next/navigation";
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
    netWorthCalc: (address: string) => void;
    multiplerUpdater: () => void;
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
    netWorthCalc: async (address: string) => { },
    multiplerUpdater: async () => {},
};

export const ContextValue = createContext<ContextTypes>(ContextDefaultValues);

export function useTheme() {
    return useContext(ContextValue);
}

type Props = {
    children: ReactNode;
}

export function ContextProvider({ children }: Props) {
    const router = useRouter();
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

    const netWorthCalc = async (address: string) => {
        try {
            const res = await fetch('/api/wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address })
            });

            if (res.ok) {
                const response = await res.json();

                const netWorth: number = response.result.reduce((sum: number, token: { usd_value: number | null }) => {
                    if (token.usd_value !== null) {
                        return sum + token.usd_value;
                    }
                    return sum;
                }, 0)

                if (scores.userId) {
                    // TODO: REDUCE THIS TO 0 [+10 just for testing]
                    console.log(scores.netWorth, netWorth + 10);
                    if (scores.netWorth !== netWorth + 10) {
                        netWorthUpdater(scores.userId, netWorth + 10)
                    }
                } else {
                    // router.push("/login");
                }
            } else {
                throw new Error("Failed to get netWorth");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const netWorthUpdater = async (dynamicUserId: string, netWorth: number) => {
        try {
            const res = await fetch('/api/settings/balance-updater', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dynamicUserId, netWorth })
            });

            if (res.ok) {
                const response = await res.json();
                setScore(response);
                console.log("net worth :", netWorth, response);
            } else {
                // console.error(response.error);
                // // TODO: make a modal for this
                throw new Error("Failed to update netWorth");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const multiplerUpdater = async () => {
        try {
            if(scores.userId) {
            const multiplier = scores.multiplier + 1;
            const dynamicUserId = scores.userId;
            const res = await fetch('/api/settings/signin-incrementer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dynamicUserId, multiplier })
            });

            if (res.ok) {
                const response = await res.json();
                setScore(response);
                console.log(response);
            } else {
                // console.error(response.error);
                // // TODO: make a modal for this
                throw new Error("Failed to update netWorth");
            }
        } else {
            console.log("no userid");
            // throw new Error("Failed to get userId");
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
        fetchOrCreateUser,
        netWorthCalc,
        multiplerUpdater
    };

    return (
        <ContextValue.Provider value={value}>
            {children}
        </ContextValue.Provider>
    );
}
