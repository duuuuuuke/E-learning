import { getAnalytics } from "@/actions/getAnalytics";

import { auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";

import DataCard from "./_components/DataCard";
import Chart from "./_components/Chart";

const AnalyticsPage = async () => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/dashboard");
    }

    const { totalRevenue, totalSales, data } = await getAnalytics(userId);

    return (
        <div className="p-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-4">
                <DataCard
                    label="Total Revenue"
                    value={totalRevenue}
                    shouldFormat
                />
                <DataCard label="Total Sales" value={totalSales} />
            </div>
            {data.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No courses
                </div>
            ) : (
                <Chart data={data} />
            )}
        </div>
    );
};

export default AnalyticsPage;
