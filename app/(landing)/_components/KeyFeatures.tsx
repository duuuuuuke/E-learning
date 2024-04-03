import KeyFeatureItem from "./KeyFeatureItem";

const keyFeatures = [
    {
        title: "As a Student",
        features: [
            {
                title: "Wide Range of Courses:",
                description:
                    "From beginner to advanced levels, our marketplace offers courses spanning various subjects and disciplines."
            },
            {
                title: "Flexible Learning:",
                description:
                    "Access courses anytime, anywhere, and on any device. Fit learning seamlessly into your busy lifestyle."
            },
            {
                title: "Track Progress:",
                description:
                    "Record and track your progress through each course. Pick up where you left off and learn at your own pace."
            }
        ],
        isReversed: false
    },
    {
        title: "As a Teacher",
        features: [
            {
                title: "Course Creation Tools:",
                description:
                    "Easily design and upload your courses using our intuitive course creation tools. No technical expertise required."
            },
            {
                title: "Global Reach:",
                description:
                    "Tap into a vast network of eager learners from around the world. Expand your reach and impact beyond traditional classroom boundaries."
            },
            {
                title: "Earn Passive Income:",
                description:
                    "Monetize your expertise by setting your own prices and earning revenue for every course sale."
            },
            {
                title: "Analytics and Insights:",
                description:
                    "Track your course performance with detailed analytics and insights. Understand your audience better and optimize your content for maximum engagement."
            }
        ],
        isReversed: true
    }
];

const KeyFeatures = () => {
    return (
        <section className="md:w-4/5 space-y-16 p-6">
            {keyFeatures.map((item) => (
                <KeyFeatureItem
                    key={item.title}
                    title={item.title}
                    features={item.features}
                    isReversed={item.isReversed}
                />
            ))}
        </section>
    );
};

export default KeyFeatures;
