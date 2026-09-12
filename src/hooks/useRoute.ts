import { useEffect, useState, useCallback } from "react";

export type Route = "home" | "repo-of-the-week" | "hackathon";

function getRouteFromLocation(): Route {
  if (typeof window === "undefined") return "home";

  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();

  if (
    hash.includes("repo-of-the-week") ||
    path.includes("repo-of-the-week")
  ) {
    return "repo-of-the-week";
  }

  if (hash.includes("hackathon") || path.includes("hackathon")) {
    return "hackathon";
  }

  return "home";
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(getRouteFromLocation);

  useEffect(() => {
    // If the visitor lands on a hash URL, clean it up to the aesthetic path
    if (window.location.hash.includes("repo-of-the-week")) {
      window.history.replaceState(null, "", "/repo-of-the-week");
    } else if (window.location.hash.includes("hackathon")) {
      window.history.replaceState(null, "", "/hackathon");
    }

    const handleLocationChange = () => {
      setRoute(getRouteFromLocation());
    };

    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const navigate = useCallback((target: Route, sectionId?: string) => {
    if (target === "repo-of-the-week") {
      window.history.pushState(null, "", "/repo-of-the-week");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (target === "hackathon") {
      window.history.pushState(null, "", "/hackathon");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (sectionId) {
        window.history.pushState(null, "", `/#${sectionId}`);
      } else {
        window.history.pushState(null, "", "/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    setRoute(target);
  }, []);

  return { route, navigate };
}
