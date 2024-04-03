import { Button } from "@/components/ui/button";

import Image from "next/image";

const LandingNav = () => {
    return (
        <nav className="flex justify-between items-center py-6 px-10">
            <Image height={130} width={130} src="/logo.svg" alt="logo" />
            <Button variant="ghost">
                <a href="/dashboard">Dashboard</a>
            </Button>
        </nav>
    );
};

export default LandingNav;
