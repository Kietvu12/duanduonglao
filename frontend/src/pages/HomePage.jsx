import Session1 from '../components/Session1';
import Session2 from '../components/Session2';
import Session3 from '../components/Session3';
import Session4 from '../components/Session4';
import Session5 from '../components/Session5';
import Session6 from '../components/Session6';
import Session7 from '../components/Session7';
import AnimatedSection from '../components/AnimatedSection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Session1 không cần animation vì đã có typing effect */}
      <Session1 />
      <AnimatedSection delay={0}>
        <Session2 />
      </AnimatedSection>
      <AnimatedSection delay={50}>
        <Session3 />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Session4 />
      </AnimatedSection>
      <AnimatedSection delay={150}>
        <Session5 />
      </AnimatedSection>
      <AnimatedSection delay={200}>
        <Session6 />
      </AnimatedSection>
      <AnimatedSection delay={250}>
        <Session7 />
      </AnimatedSection>
    </div>
  );
};

export default HomePage;

