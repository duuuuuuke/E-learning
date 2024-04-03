import { auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";
import LandingNav from "./_components/LandingNav";
import LandingFooter from "./_components/LandingFooter";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
    const { userId } = auth();
    if (userId) {
        return redirect("/dashboard");
    }

    return (
        <>
            <header>
                <LandingNav />
            </header>
            <main>{children}</main>
            <footer>
                <LandingFooter />
            </footer>
        </>
    );
};

export default LandingLayout;
