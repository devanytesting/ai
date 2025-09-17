import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/redux";
import { Button } from "../components/ui/button";
import { Search, Home, LogIn } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    const redirect = setTimeout(() => {
      navigate(isAuthenticated ? "/dashboard" : "/signin", { replace: true });
    }, 5000);
    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm overflow-hidden">
            <div className="px-8 pt-10 pb-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
              <p className="mt-2 text-slate-600">We couldn’t find the page you’re looking for.</p>
              <p className="mt-1 text-sm text-slate-500">Redirecting in {seconds}s…</p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signin", { replace: true })}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isAuthenticated ? (
                    <Home className="mr-2 h-4 w-4" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  {isAuthenticated ? "Go to Dashboard" : "Go to Sign in"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Error 404 • {location.pathname}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
