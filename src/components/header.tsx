
import { useState } from "react";
import {
  Menu,
  DownloadIcon,
  SettingsIcon,
  LogOutIcon,
  HelpCircle,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();

  // Temporary mock data
  const departmentUser = {
    first_name: "Samuel",
    last_name: "Adeyemi",
    department: "Department of Software Engineering",
    designation: "Head of Department",
  };

  const departmentName = [
    departmentUser.first_name,
    departmentUser.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      // Connect department logout API here later.
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setShowSettings(false);
      setConfirmingLogout(false);
      navigate("/", { replace: true });
    }
  };

  const settingDropdowns = [
    { icon: HelpCircle, action: "Help", color: "text-black/70" },
    {
      icon: KeyRound,
      action: "Change Password",
      color: "text-black/70",
    },
    { icon: LogOutIcon, action: "Log Out", color: "text-red-500" },
  ];

  return (
    <div className="w-full">
      <header className="bg-[#14263F] flex items-center justify-between px-2 md:px-6 lg:px-6 py-4 w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="text-white/70 lg:hidden hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <Menu size={24} strokeWidth={1.75} />
          </button>

          <div>
            <div className="flex items-baseline gap-1.5">
              <p className="font-sans text-white/70 text-sm">
                Welcome,
              </p>

              <p className="font-serif font-semibold text-white text-sm md:text-lg lg:text-lg leading-none">
                {departmentName}
              </p>
            </div>

            <p className="font-mono text-white/60 text-xs mt-1">
              {departmentUser.designation} · {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 lg:gap-2">
          <button
            aria-label="Download"
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
          >
            <DownloadIcon size={20} strokeWidth={1.75} />
          </button>

          <div className="relative">
            <button
              onClick={() =>
                setShowSettings((previous) => !previous)
              }
              aria-label="Settings"
              aria-expanded={showSettings}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
            >
              <SettingsIcon size={20} strokeWidth={1.75} />
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-black/5 overflow-hidden z-40">
                {settingDropdowns.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <button
                      key={item.action}
                      onClick={() => {
                        if (item.action === "Log Out") {
                          setShowSettings(false);
                          setConfirmingLogout(true);
                        } else {
                          setShowSettings(false);

                          if (item.action === "Change Password") {
                            navigate("/change-password");
                          } else if (item.action === "Help") {
                            navigate("/help");
                          }
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-black/[0.03] transition-colors ${item.color}`}
                    >
                      <ItemIcon size={16} strokeWidth={1.75} />
                      {item.action}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout confirmation */}
      {confirmingLogout && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
              <LogOutIcon size={21} />
            </div>

            <h2
              id="logout-title"
              className="text-lg font-semibold text-slate-900"
            >
              Log out of EduNova?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to end your session?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmingLogout(false)}
                disabled={loggingOut}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Yes, Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
