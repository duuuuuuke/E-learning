"use client";

import { Category } from "@prisma/client";

import {
    FcElectronics,
    FcEngineering,
    FcMultipleDevices,
    FcMusic,
    FcSalesPerformance
} from "react-icons/fc";
import { FaBtc } from "react-icons/fa";
import { IconType } from "react-icons";

import CategoryItem from "./CategoryItem";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    Blockchain: FaBtc,
    Music: FcMusic,
    Business: FcSalesPerformance,
    Engineering: FcEngineering,
    "Computer Science": FcMultipleDevices,
    Hardware: FcElectronics,
    Other: FcMultipleDevices
};

const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    );
};

export default Categories;
