"use client";

import { User, UserScores, UserSettings } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type userDataTypes = {
    dynamicUserId: string;
    picture: string;
    username: string;
    theme: boolean;
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
    random: () => void;
    fetchOrCreateUser: (
        dynamicUserId: string,
        info: {
            username: string;
            picture: string;
            theme: boolean;
            multiplier: number;
            netWorth: number;
            totalWorth: number;
        }
    ) => Promise<User | undefined>;
    netWorthCalc: (address: string) => void;
    multiplerUpdater: (dynamicUserId: string) => void;
};

const ContextDefaultValues: ContextTypes = {
    settings: {} as UserSettings,
    changeSettings: (changedSet: UserSettings) => { },
    scores: {} as UserScores,
    changeScore: (changedSet: UserScores) => { },
    multi: false,
    manageUser: (userData: userDataTypes, address: string) => { },
    toggleMulti: () => { },
    random: () => { },
    fetchOrCreateUser: async () => undefined,
    netWorthCalc: async (address: string) => { },
    multiplerUpdater: async (dynamicUserId: string) => { },
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
    const [settings, setSettings] = useState<UserSettings>({} as UserSettings);
    const [scores, setScore] = useState<UserScores>({} as UserScores);

    useEffect(() => {
        const multiValue = JSON.parse(localStorage.getItem('multi') ?? 'false');
        setMulti(multiValue);
        const settingsValue = JSON.parse(localStorage.getItem('settings') ?? '{}');
        const scoresValue = JSON.parse(localStorage.getItem('scores') ?? '{}');

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
            theme: boolean;
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
                console.log(user);
                changeSettings(user.settings);
                changeScore(user.scores);
                //update multiplier over "multi"
                console.log(multi);
                if (mul === true) {
                    console.log(dynamicUserId);
                    multiplerUpdater(dynamicUserId);
                    toggleMulti();
                }
                return user;
            } else if (response.status === 404) {
                // User not found, create a new user
                const { username, picture, theme, multiplier, netWorth, totalWorth } = info;
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
                        totalWorth
                    }),
                });

                if (newUserResponse.ok) {
                    const newUser = await newUserResponse.json();
                    console.log(newUser);
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
                    // TODO: REDUCE THIS TO 0 [+10 just for testing]
                    let totalWorth = (netWorth + 10) * scores.multiplier;

                    console.log(scores.netWorth, netWorth + 10);
                    if (scores.netWorth !== netWorth + 10) {
                        netWorthUpdater(scores.userId, netWorth + 10, totalWorth)
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
                console.log(response);
            } else {
                throw new Error("Failed to update netWorth");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const settingsUpdater = async (dynamicUserId: string, username: string, theme: boolean, picture: string) => {
        try {
            const res = await fetch('/api/settings/settings-updater', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dynamicUserId, username, theme, picture })
            });

            if (res.ok) {
                const response = await res.json();
                setSettings(response);
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
        random,
        fetchOrCreateUser,
        netWorthCalc,
        multiplerUpdater,
        manageUser
    };

    return (
        <ContextValue.Provider value={value}>
            {children}
        </ContextValue.Provider>
    );
}
