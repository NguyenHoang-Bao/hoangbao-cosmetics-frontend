import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Cau hinh class name, xu ly boolean/mang/object va tailwind-mergeConfigs(xung dot class tailwin)

export function cn(...inputs: ClassValue[]): string{
    return twMerge(clsx(inputs));
}

//xem lai them 