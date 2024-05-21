"use client";

import { useEffect, useState, useContext } from 'react';
import { ContextValue } from "./../context/context";
import { useAuthenticateConnectedUser, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useRouter } from 'next/router';

const Settings = () => {
  const router = useRouter();
  const { settings } = useContext(ContextValue);
  const { isAuthenticated } = useDynamicContext();
  const { isAuthenticating } = useAuthenticateConnectedUser();
  useEffect(() => {
    console.log(isAuthenticating);
  }, [isAuthenticating]);
  
  return (
    <div>
      this is settings
      username
      profilepicture
      theme
      logout
      help & support
      Data Deletion
      feedback & suggestions
    </div>
  )
}

export default Settings
