import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <Skeleton className="h-80 w-full" />
    </div>
  );
}
