import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

interface FeatureCardProps {
    title: string;
    description: string;
    Icon: React.ReactNode;
}

const FeatureCard = ({ title, description, Icon }: FeatureCardProps) => {
    return (
        <Card className="w-11/12 sm:w-4/5 md:w-3/5 min-h-96 shadow-md flex flex-col justify-between p-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-x-2 text-slate-700 text-base md:text-2xl">
                    {Icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-slate-500 text-sm sm:text-base">
                    {description}
                </p>
            </CardContent>
            <CardFooter>
                <Button>
                    <a href="/dashboard">Get Started</a>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default FeatureCard;
