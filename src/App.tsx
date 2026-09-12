import { MotionConfig } from "framer-motion";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { ScrollStroke } from "./components/ScrollStroke";
import { About } from "./components/About";
import { WhatWeDo } from "./components/WhatWeDo";
import { Contribute } from "./components/Contribute";
import { Stats } from "./components/Stats";
import { Programs } from "./components/Programs";
import { Hackathon } from "./components/Hackathon";
import { Join } from "./components/Join";
import { Footer } from "./components/Footer";
import { ScrollProgress } from "./components/ScrollProgress";
import { Cursor } from "./components/Cursor";
import { RepoOfTheWeekPage } from "./components/repo-of-the-week/RepoOfTheWeekPage";
import { useRoute } from "./hooks/useRoute";

export default function App() {
  const { route, navigate } = useRoute();

  return (
    // reducedMotion="user" makes every framer animation honour the visitor's
    // OS setting, the same way the CSS keyframes already do.
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Cursor />
      <Nav currentRoute={route} onNavigate={navigate} />

      {route === "repo-of-the-week" ? (
        <RepoOfTheWeekPage onBackToHome={() => navigate("home")} onNavigate={navigate} />
      ) : (
        <>
          <main id="main">
            <Hero onExploreRepo={() => navigate("repo-of-the-week")} />
            <Marquee />
            <ScrollStroke />
            <About />
            <WhatWeDo />
            <Contribute />
            <Stats />
            <Programs />
            <Hackathon />
            <Join />
          </main>
          <Footer onNavigate={navigate} />
        </>
      )}
    </MotionConfig>
  );
}
