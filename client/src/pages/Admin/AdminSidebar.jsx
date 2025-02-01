import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Instructor.css";
function AdminSidebar() {
  return (
    <>
      <div className="mt-16  h-[92vh] flex" id="instructorId">
        <aside className=" w-64 bg-white shadow-md hidden md:block">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
            <nav>
              <NavLink
                className="flex items-center bg-slate-100 py-2 mb-2 rounded-md pl-4 gap-2 "
                to="/admin/dashboard"
              >
                <BarChart className="mr-2 h-4 w-4" /> dashboard
              </NavLink>

              <NavLink
                className="flex items-center bg-slate-100 py-2 mb-2 rounded-md pl-4 gap-2 "
                to="/admin/course"
              >
                <BarChart className="mr-2 h-4 w-4" /> courses
              </NavLink>
            </nav>
          </div>
        </aside>
        <div className="flex-1 p-10 ">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
