import { useState, useCallback } from 'react';
import './App.css';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LogosBar from './components/LogosBar';
import InfoSection from './components/InfoSection';
import FooterSection from './components/FooterSection';

export default function App() {
  const [loadPercent, setLoadPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleProgress = useCallback((pct) => {
    setLoadPercent(pct);
  }, []);

  const handleComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const { canvasRef } = useScrollAnimation(handleProgress, handleComplete);

  return (
    <>
      {/* Loading Screen */}
      <Loader percentage={loadPercent} isHidden={isLoaded} />

      {/* Background scrolling canvas */}
      <div id="canvas-container">
        <canvas ref={canvasRef} id="anim-canvas" />
      </div>

      {/* Scrollable content layer overlay */}
      <div id="content-wrapper">
        <Navbar />

        <HeroSection />

        <LogosBar />

        {/* About Section */}
        <InfoSection
          id="about"
          tag="ABOUT US"
          title="HI, I'M X3 FASHION"
          subtitle="I'm your ultimate companion to make a lasting impression in the digital realm"
          description="Proin nibh nisl condimentum id. Sem nulla pharetra diam sit amet nisl suscipit. Sagittis id consectetur purus ut faucibus pulvinar elementum integer enim. Vitae purus faucibus ornare suspendisse. In ornare quam viverra orci sagittis eu volutpat odio. Praesent semper feugiat nibh sed. Accumsan lacus vel facilisis volutpat est velit egestas dui id."
        />

        {/* Services Section */}
        <InfoSection
          id="services"
          align="right"
          tag="WELCOME TO X3 FASHION'S WORLD..."
          title="WHY X3 FASHION IS PERFECT FOR YOU?"
          subtitle="With my sleek design and intuitive features, I embody the essence of modern sophistication"
          features={[
            {
              title: 'Stylish',
              text: 'With modern design and captivating visuals, I exude professionalism and class, ensuring you stand out.',
            },
          ]}
        />

        <FooterSection />
      </div>
    </>
  );
}
