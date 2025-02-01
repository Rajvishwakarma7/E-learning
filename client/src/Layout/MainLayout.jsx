import Navbar from "@/components/ui/Navbar";

import React from "react";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
