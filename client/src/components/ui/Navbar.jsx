import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Darkmode from "./Darkmode";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLogoutUserMutation } from "@/Redux/Api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  let { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const { toast } = useToast();

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  async function handleLogout() {
    await logoutUser();
  }
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: data?.message || "User log out.",
      });
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <>
      <div className="h-16 items-center dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 right-0 left-0 duration-300 z-10">
        {/* desktop device */}
        <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center pt-2">
          <div className="flex justify-center items-center gap-1">
            <School size={30} />
            <h1
              className="text-2xl font-extrabold hidden md:block cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              E-Learning
            </h1>
          </div>
          <div className="flex justify-center items-center gap-8">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage
                        src={user?.photoUrl || "https://github.com/shadcn.png"}
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Link to="/my-learning">My Learning</Link>
                        <DropdownMenuShortcut></DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/profile">Edit Profile</Link>
                        <DropdownMenuShortcut></DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        Log out
                        {/* <DropdownMenuShortcut>⌘</DropdownMenuShortcut> */}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {user && user.role === "instructor" && (
                      <>
                        <DropdownMenuItem>
                          <Link to="/admin/dashboard">Dashboard</Link>
                          <DropdownMenuShortcut></DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button onClick={() => navigate("/login")}>Signup</Button>
                </div>
              </>
            )}
            <Darkmode />
          </div>
        </div>

        {/* mobile device */}
        <div className=" md:hidden flex justify-between items-center px-4 h-full pt-2">
          <h1 className="text-2xl font-extrabold ">E-Learning</h1>
          <MobileNavbar />
        </div>
      </div>
    </>
  );
};

export default Navbar;

const MobileNavbar = () => {
  let role = "instructor";
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="bg-gray-200 hover:bg-gray-300 "
          variant="outlined"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <div className="flex justify-between mt-4  mb-4">
            <SheetTitle>E Learning</SheetTitle>
            <Darkmode />
          </div>
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col justify-between space-y-4 mb-5">
          <span>
            <Link to="/my-learning">My Learning</Link>
          </span>
          <span>
            <Link to="/profile">Edit Profile</Link>
          </span>
          <span> Logout </span>
          <p>Dashboard</p>
        </nav>
        {role === "instructor" && (
          <>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Dashboard</Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
