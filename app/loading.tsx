import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-black">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-white" />
        <p className="mt-4 text-sm text-neutral-500">Loading...</p>
      </div>
    </div>
  );
}
