"use client";

import { useEffect, useState, useContext, ReactEventHandler, ChangeEvent, FormEvent } from 'react';
import { ContextValue } from "./../context/context";
import { useAuthenticateConnectedUser, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useRouter } from "next/navigation";
import Loader from "./../components/loaderhere"
import { UserSettings } from '@prisma/client';
import { CldUploadWidget } from 'next-cloudinary';

const Settings = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useDynamicContext();
  const { isAuthenticating } = useAuthenticateConnectedUser();
  const { settings, manageUser, settingsUpdater, theme, toggleTheme } = useContext(ContextValue);
  const [details, setDetails] = useState<UserSettings>(settings);

  useEffect(() => {
    setDetails(settings);
  }, [settings])

  const [loader, setLoader] = useState(1);
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
    }, 1000)
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("this is the handle submit");
    if (settings.username !== details.username || settings.picture !== details.picture) {
      settingsUpdater(details.userId, details.username, details.picture);
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  }

  const handleImageUpload = (result: any) => {
    const imageUrl = result.info.secure_url;
    setDetails((prevDetails) => ({
      ...prevDetails,
      picture: imageUrl,
    }));
  };

  const placeholder = "https://avatars.githubusercontent.com/u/98532264?v=4";

  return (
    <>
      {loader === 1 ?
        <Loader />
        :
        <>
          <div className="flex justify-center items-center mt-8 w-full h-screen z-50">
            <form onSubmit={handleSubmit} action="#">
              <div className="space-y-12 ">
                <div className="border-b w-[100vh] border-gray-900 pb-12">
                <h1 className="text-2xl font-bold mb-4 uppercase">SETTINGS</h1>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6"
                      >
                        Username
                      </label>
                      <div className="mt-2 flex justify-center">
                        <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                            N3TWORTHGAME/
                          </span>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 rounded-r-md"
                            placeholder={details.username}
                            defaultValue={details.username}
                            onChange={onChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="photo"
                        className="block text-sm font-medium leading-6"
                      >
                        Photo
                      </label>
                      <div className="mt-2 flex items-center justify-center gap-x-2">
                        {details.picture ? (
                          <img
                            src={details.picture}
                            className="w-[15vh]"
                            alt="pfp"
                          />
                        ) : (
                          <img
                            src={placeholder}
                            className="w-[15vh]"
                            alt="pfp"
                          />
                        )}
                        <CldUploadWidget uploadPreset="ppgzrcox" onSuccess={handleImageUpload}
                        >
                          {({ open }) => {
                            return (
                              <button
                                onClick={(event) => {
                                  event.preventDefault();
                                  open();
                                }}
                                className='rounded-md border bg-cyan-600 px-3 py-2 text-sm bg-text/5 hover:bg-background hover:text-primary border-opacity-10 transition ease-in-out duration-300 '>
                                Upload an Image
                              </button>
                            );
                          }}
                        </CldUploadWidget>
                      </div>
                    </div>
                  </div>


                  {/* <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox"
                      checked={theme === true}
                      onChange={() => {
                        toggleTheme();
                        console.log(theme);
                      }
                      }
                      className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark Mode</span>
                  </label> */}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6 w-full">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6"
                  onClick={() => setDetails(settings)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md border bg-cyan-600 px-3 py-2 text-sm bg-text/5 hover:bg-background hover:text-primary border-opacity-10 transition ease-in-out duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </>
      }
    </>
  );
}

export default Settings
