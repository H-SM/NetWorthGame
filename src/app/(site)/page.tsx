"use client";

import Image from "next/image";
import { ContextValue } from "./../context/context";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { useAuthenticateConnectedUser, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import Loader from "./../components/loaderhere"
import { useBalance } from "wagmi";
import supabase from "../lib/supabase";
import { useSpring, animated } from "react-spring";

interface LeaderboardEntry {
  dynamicUserId: string;
  username: string;
  profilePicture: string;
  score: number;
}

interface NumberProps {
  n: number;
}

const Number: React.FC<NumberProps> = ({ n }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>
}
export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useDynamicContext();
  const { isAuthenticating } = useAuthenticateConnectedUser();
  const { settings, scores, manageUser } = useContext(ContextValue);
  const [loader, setLoader] = useState(1);

  //TODO: look over this
  let stringer = "";
  if (user && user.verifiedCredentials?.[0]?.address) {
    stringer = user.verifiedCredentials?.[0]?.address.slice(2);
  }
  const { data: ethBalanceData } = useBalance({
    address: `0x${stringer}`,
  });

  const placeholder = "https://avatars.githubusercontent.com/u/98532264?v=4";

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

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
        <div className="w-full h-fit my-[10rem] flex flex-wrap justify-center items-center gap-3 z-50 bg-background ">
          <div className="w-[50rem] rounded-2xl h-[10rem] bg-accent/30 flex justify-evenly items-center font-poppins text-text">
            <div className="w-[15rem] h-[8rem] flex flex-col justify-center items-center">
              <p className="text-center font-medium text-[1.1rem]">
                Net Worth
              </p>
              <p className="font-bold text-[5rem] text-center mt-[-1.3rem]">
                <Number n={scores.totalWorth} />
              </p>
            </div>

            <div className="w-[15rem] h-[8rem] flex flex-col justify-center items-center">
              <p className="text-center font-medium text-[1.1rem]">
                ETH Balance
              </p>
              <p className="font-bold text-[5rem] text-center mt-[-1.3rem]">
                {ethBalanceData ? <Number n={parseFloat(ethBalanceData.formatted)} /> : <p>0</p>}
                {/* <Number n={scores.totalWorth} /> */}
              </p>
            </div>

            <div className="w-[15rem] h-[8rem] flex flex-col justify-center items-center">
              <p className="text-center font-medium text-[1.1rem]">
                Total Balance
              </p>
              <p className="font-bold text-[5rem] text-center mt-[-1.3rem]">
                <Number n={scores.netWorth} />
              </p>
            </div>
          </div>
          <div className="w-[24rem] rounded-2xl h-[10rem] bg-secondary/30 flex justify-evenly items-center font-poppins text-text">

            <div className="w-fit max-w-[15rem] h-[5rem] flex flex-col justify-center items-end text-text ">
              <p className="font-bold text-[1.2rem]">{settings.username}</p>
              <p className="text-[1.1rem] ">{ user && user.email}</p>
              <p className="text-[1.1rem]">{new Date(settings.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            <div className=" rounded-full overflow-hidden">
              <Image src={`${settings.picture ? settings.picture : placeholder}`} width={100} height={100} alt="pfp" className="w-full object-contain" />
            </div>

            {/* <h3>Native Balance: {nativeBalance?.balance.ether} ETH</h3>  */}
          </div>
          <div className="w-[75rem] rounded-2xl h-[30rem] bg-secondary/30 flex justify-start items-start font-poppins text-text overflow-y-auto ">
            <div className="w-full p-4">
              <h1 className="text-2xl font-bold mb-4 uppercase">Leaderboard</h1>
              <table className="min-w-full bg-blue-400">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-4 border-b">Rank</th>
                    <th className="py-2 px-4 border-b">Username</th>
                    <th className="py-2 px-4 border-b">Profile Picture</th>
                    <th className="py-2 px-4 border-b">Net Worth</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">{entry.username}</td>
                      <td className="py-2 px-4 border-b">
                        {entry.profilePicture ? (
                          <img
                            src={entry.profilePicture}
                            alt="Profile"
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <img
                            src={placeholder}
                            alt="Profile"
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">{entry.score.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      }
    </>
  );
}
