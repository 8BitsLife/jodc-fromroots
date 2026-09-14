import { lazy, Suspense, useCallback, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { ScrollStroke } from "./components/ScrollStroke";
import { About } from "./components/About";
import { WhatWeDo } from "./components/WhatWeDo";
import { Contribute } from "./components/Contribute";
import { Events } from "./components/Events";
import { Programs } from "./components/Programs";
import { Join } from "./components/Join";
import { Footer } from "./components/Footer";
import { Atmosphere } from "./components/Atmosphere";
import { Cursor } from "./components/Cursor";
import { Preloader, shouldShowPreloader } from "./components/Preloader";
import { useRoute } from "./hooks/useRoute";

// Sub-pages are split out so the landing page doesn't ship their code.
const HackathonPage = lazy(() =>
  import("./components/hackathon/HackathonPage").then((m) => ({ default: m.HackathonPage })),
);
const RepoOfTheWeekPage = lazy(() =>
  import("./components/repo-of-the-week/RepoOfTheWeekPage").then((m) => ({ default: m.RepoOfTheWeekPage })),
);
const TeamPage = lazy(() => import("./components/TeamPage").then((m) => ({ default: m.TeamPage })));

export default function App() {
  const { route, navigate } = useRoute();
  // Decided once on first render; the preloader stays mounted so its exit can play.
  const [withIntro] = useState(shouldShowPreloader);
  const [revealed, setRevealed] = useState(!withIntro);
  const reveal = useCallback(() => setRevealed(true), []);

  return (
    // reducedMotion="user" makes every framer animation honour the visitor's
    // OS setting, the same way the CSS keyframes already do.
    <MotionConfig reducedMotion="user">
      {withIntro && <Preloader onReveal={reveal} />}

      <Atmosphere />
      <Cursor />
      {revealed && <Nav currentRoute={route} onNavigate={navigate} />}

      {/* Pages mount as the curtain lifts, so their entrance animations are seen. */}
      {!revealed ? null : route !== "home" ? (
        <Suspense fallback={<div className="min-h-dvh" />}>
          {route === "repo-of-the-week" ? (
            <RepoOfTheWeekPage onBackToHome={() => navigate("home")} onNavigate={navigate} />
          ) : route === "hackathon" ? (
            <HackathonPage onBackToHome={() => navigate("home")} onNavigate={navigate} />
          ) : (
            <TeamPage onNavigate={navigate} />
          )}
        </Suspense>
      ) : (
        <>
          <main id="main">
            <Hero />
            <Marquee />
            <ScrollStroke />
            <About />
            <WhatWeDo />
            <Contribute />
            <Events />
            <Programs />
            <Join />
          </main>
          <Footer onNavigate={navigate} />
        </>
      )}
    </MotionConfig>
  );
}
