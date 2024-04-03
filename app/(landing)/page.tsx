import FeaturesIntro from "./_components/FeaturesIntro";
import Hero from "./_components/Hero";
import KeyFeatures from "./_components/KeyFeatures";

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center gap-y-16 my-8">
            <Hero />
            <FeaturesIntro />
            <KeyFeatures />
        </div>
    );
};

export default LandingPage;
