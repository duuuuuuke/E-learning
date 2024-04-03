"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import qs from "query-string";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/hooks/useDebounce";

const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value);

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: {
                    categoryId: currentCategoryId,
                    title: debouncedValue
                }
            },
            { skipEmptyString: true, skipNull: true }
        );
        router.push(url);
    }, [debouncedValue, currentCategoryId, pathname, router]);
    return (
        <div className="relative">
            <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
            <Input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
                placeholder="Search for a course"
            />
        </div>
    );
};

export default SearchInput;
