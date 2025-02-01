"use client";
import { Person } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "@/app/Store/Slice";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [userDropdown, setUserDropdown] = useState(false);

  // Get username from Redux state
  const username = useSelector((state) => state.user.username);
  const userbalance = useSelector((state) => state.user.balance);
  // Redirect to /admin if the username is empty
  useEffect(() => {
    if (!username) {
      router.push("/admin");
    }
  }, [username, router]);

  return (
    <header className="flex items-center justify-between bg-white p-3 border-b border-t border-r h-16">
      <div className="flex items-center">
        <div className="text-gray-800 text-xl font-bold capitalize ml-5">
          {pathname.split("/").pop() === "Submittions" ? (
            <>Submissions</>
          ) : (
            <>{pathname.split("/").pop()}</>
          )}
        </div>
      </div>
      <div className="flex items-center px-5">
        <div className="flex items-center bg-white p-1 rounded-lg h-10">
         
          <p className="text-xl px-4">{username || "Guest"}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdown(!userDropdown);
            }}
            className="rounded-full border hover:border hover:border-blue-500 p-2"
          >
            <Person className="text-2xl" />
          </button>
          {userDropdown && (
            <div className="absolute top-full z-10 bg-white px-3 py-3 right-0 flex flex-col border">
              <a
                onClick={() => dispatch(Logout())}
                href='/'
                className="border border-gray-300/0 hover:border-gray-800 px-2 py-1 rounded"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
