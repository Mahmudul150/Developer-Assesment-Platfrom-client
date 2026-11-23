import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
