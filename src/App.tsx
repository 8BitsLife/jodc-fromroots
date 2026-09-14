import { useState } from "react";
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
import { ScrollProgress } from "./components/ScrollProgress";
import { Cursor } from "./components/Cursor";
import { HackathonPage } from "./components/hackathon/HackathonPage";
import { RepoOfTheWeekPage } from "./components/repo-of-the-week/RepoOfTheWeekPage";
import { TeamPage } from "./components/TeamPage";
import { useRoute } from "./hooks/useRoute";
import { Preloader } from "./components/Preloader";

export default function App() {
  const { route, navigate } = useRoute();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <MotionConfig reducedMotion="user">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <div className="site-atmosphere" aria-hidden="true" />
      <ScrollProgress />
      <Cursor />
      <Nav currentRoute={route} onNavigate={navigate} />

      {route === "repo-of-the-week" ? (
        <div className="route-page-canvas">
          <RepoOfTheWeekPage onBackToHome={() => navigate("home")} onNavigate={navigate} />
        </div>
      ) : route === "hackathon" ? (
        <div className="route-page-canvas">
          <HackathonPage onBackToHome={() => navigate("home")} onNavigate={navigate} />
        </div>
      ) : route === "team" ? (
        <div className="route-page-canvas">
          <TeamPage onNavigate={navigate} />
        </div>
      ) : (
        <div className="home-page-canvas">
          <div className="home-background-art" aria-hidden="true" />
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
        </div>
      )}
    </MotionConfig>
  );
}
