/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setSelectedYear } from "@/redux/slices/documentSlice";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  LogOut,
  FileText,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetDocumentsQuery } from "@/redux/api/baseApi";

export function Sidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedYear = useAppSelector((state) => state.documents.selectedYear);
  const [isDataOpen, setIsDataOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleYearClick = (year: string) => {
    dispatch(setSelectedYear(year));
    router.push(`/year/${year}`);
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("accessToken", { path: "/" });
    window.location.href = "/login";
  };

  const { data, isLoading } = useGetDocumentsQuery("");
  if (isLoading) return <div>Loading...</div>;

  let years = data.data.map((doc: any) => doc.year);
  years = new Set(["All-Documents", ...years]);
  years = Array.from(years);

  return (
    <>
      {/* Mobile menu toggle button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {/* <X className="h-5 w-5" /> */}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-[240px] min-w-[240px] z-50 transition-all duration-300",
          isMobileMenuOpen ? "left-0" : "-left-[240px] lg:left-0"
        )}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight">JITU NATH</h2>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <div className="px-3 py-2">
            <div
              className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsDataOpen(!isDataOpen)}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4" />
                <span>All Data</span>
              </div>
              {isDataOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>

            {isDataOpen && (
              <div className="mt-1 ml-2 space-y-1">
                {years.map((year: any) => (
                  <div
                    key={year}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-sm rounded-md cursor-pointer",
                      selectedYear === year
                        ? "bg-gray-100 dark:bg-gray-800 font-medium"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    onClick={() => handleYearClick(year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              router.push("/settings");
              setIsMobileMenuOpen(false);
            }}
          >
            <Settings className="h-4 w-4" />
            <span>Setting</span>
          </div>

          <Button
            variant="destructive"
            className="w-full mt-4 flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </>
  );
}
