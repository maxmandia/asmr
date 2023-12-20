import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import React from "react";

function index() {
  return <AuthenticateWithRedirectCallback />;
}

export default index;
