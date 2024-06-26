"use client";

import { User, UserScores, UserSettings } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type userDataTypes = {
    dynamicUserId: string;
    picture: string;
    username: string;
    multiplier: number;
    netWorth: number;
    totalWorth: number;
}

type ContextTypes = {
    settings: UserSettings;
    changeSettings: (changedSet: UserSettings) => void;
    scores: UserScores;
    changeScore: (changedSet: UserScores) => void;
    multi: boolean;
    manageUser: (userData: userDataTypes, address: string) => void;
    toggleMulti: () => void;
    theme: boolean;
    toggleTheme: () => void;
    random: () => void;
    fetchOrCreateUser: (
        dynamicUserId: string,
        info: {
            username: string;
            picture: string;
            multiplier: number;
            netWorth: number;
            totalWorth: number;
        }
    ) => Promise<User | undefined>;
    netWorthCalc: (address: string) => void;
    multiplerUpdater: (dynamicUserId: string) => void;
    settingsUpdater: (dynamicUserId: string, username: string, picture: string) => void;
};

const ContextDefaultValues: ContextTypes = {
    settings: {} as UserSettings,
    changeSettings: (changedSet: UserSettings) => { },
    scores: {} as UserScores,
    changeScore: (changedSet: UserScores) => { },
    multi: false,
    manageUser: (userData: userDataTypes, address: string) => { },
    toggleMulti: () => { },
    theme: false,
    toggleTheme: () => { },
    random: () => { },
    fetchOrCreateUser: async () => undefined,
    netWorthCalc: async (address: string) => { },
    multiplerUpdater: async (dynamicUserId: string) => { },
    settingsUpdater: async (dynamicUserId: string, username: string, picture: string) => { },
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
    const [multi, setMulti] = useState<boolean>(false);
    const [theme, setTheme] = useState<boolean>(false);
    const [settings, setSettings] = useState<UserSettings>({} as UserSettings);
    const [scores, setScore] = useState<UserScores>({} as UserScores);

    useEffect(() => {
        const multiValue = JSON.parse(localStorage.getItem('multi') ?? 'false');
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === null) {
            localStorage.setItem('theme', 'false');
            setTheme(false);
        } else {
            setTheme(JSON.parse(storedTheme));
        }

        const settingsValue = JSON.parse(localStorage.getItem('settings') ?? '{}');
        const scoresValue = JSON.parse(localStorage.getItem('scores') ?? '{}');

        setMulti(multiValue);
        setSettings(settingsValue);
        setScore(scoresValue);
    }, []);

    //superset function that overlooks changes in the user details
    const manageUser = async (userData: userDataTypes, address: string) => {
        try {
            await fetchOrCreateUser(userData.dynamicUserId, userData);
            await netWorthCalc(address);

        } catch (error) {
            console.error('Error fetching or creating user:', error);
        }

    }

    const toggleMulti = () => {
        setMulti((prevState) => !prevState);
        localStorage.setItem('multi', JSON.stringify(multi));
    };

    const toggleTheme = () => {
        setTheme((prevState) => !prevState);
        localStorage.setItem('theme', JSON.stringify(theme));
    };

    const random = () => {
        console.log("ji");
    };

    const changeSettings = (changedSet: UserSettings) => {
        setSettings(changedSet);
        localStorage.setItem('settings', JSON.stringify(changedSet));
    }

    const changeScore = (changedSet: UserScores) => {
        setScore(changedSet);
        localStorage.setItem('scores', JSON.stringify(changedSet));
    }

    const fetchOrCreateUser = async (
        dynamicUserId: string,
        info: {
            username: string;
            picture: string;
            multiplier: number;
            netWorth: number;
            totalWorth: number;
        }
    ): Promise<User | undefined> => {
        try {
            const response = await fetch(`/api/login?dynamicUserId=${dynamicUserId}`);

            const mul: boolean = JSON.parse(localStorage.getItem('multi') ?? 'false') || multi;

            if (response.ok) {
                const user = await response.json();
                changeSettings(user.settings);
                changeScore(user.scores);
                //update multiplier over "multi"
                if (mul === true) {
                    multiplerUpdater(dynamicUserId);
                    toggleMulti();
                }
                return user;
            } else if (response.status === 404) {
                // User not found, create a new user
                const { username, picture, multiplier, netWorth, totalWorth } = info;
                const newUserResponse = await fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        dynamicUserId,
                        username,
                        picture,
                        multiplier,
                        netWorth,
                        totalWorth
                    }),
                });

                if (newUserResponse.ok) {
                    const newUser = await newUserResponse.json();
                    changeSettings(newUser.settings);
                    changeScore(newUser.scores);
                    if (mul === true) {
                        multiplerUpdater(dynamicUserId);
                        toggleMulti();
                    }
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
                    let totalWorth = (netWorth) * scores.multiplier;

                    if (scores.netWorth !== netWorth) {
                        netWorthUpdater(scores.userId, netWorth, totalWorth)
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

    const netWorthUpdater = async (dynamicUserId: string, netWorth: number, totalWorth: number) => {
        try {
            const res = await fetch('/api/settings/balance-updater', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dynamicUserId, netWorth, totalWorth })
            });

            if (res.ok) {
                const response = await res.json();
                setScore(response);
            } else {
                // console.error(response.error);
                // // TODO: make a modal for this
                throw new Error("Failed to update netWorth");
            }
        } catch (error) {
            settingsUpdater
            console.error(error);
            throw error;
        }
    };

    const multiplerUpdater = async (dynamicUserId: string) => {
        try {
            const res = await fetch('/api/settings/signin-incrementer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dynamicUserId })
            });

            if (res.ok) {
                const response = await res.json();
                setScore(response);
            } else {
                throw new Error("Failed to update netWorth");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const settingsUpdater = async (dynamicUserId: string, username: string, picture: string) => {
        try {
            const res = await fetch('/api/settings/settings-updater', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dynamicUserId, username, picture })
            });

            if (res.ok) {
                const response = await res.json();
                changeSettings(response);
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

    const value = {
        settings,
        changeSettings,
        scores,
        changeScore,
        multi,
        toggleMulti,
        theme,
        toggleTheme,
        random,
        fetchOrCreateUser,
        netWorthCalc,
        multiplerUpdater,
        manageUser,
        settingsUpdater,
    };

    return (
        <ContextValue.Provider value={value}>
            {children}
        </ContextValue.Provider>
    );
}
