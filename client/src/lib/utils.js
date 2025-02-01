import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// formate data and time

export function formateDateTime(timestamp) {
  if (!timestamp || isNaN(new Date(timestamp).getTime())) {
    return "Invalid date";
  }

  // Convert to Date object
  const date = new Date(timestamp);

  // Format options
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  // Convert to Indian format
  return date.toLocaleString("en-IN", options);
}
