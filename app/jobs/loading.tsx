import { JobListSkeleton } from "@/components/ui/loading";

export default function JobsLoading() {
  return (
    <div className="bg-black min-h-screen">
      <section className="border-b border-neutral-800 bg-gradient-to-b from-neutral-950 to-black py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-64 animate-pulse bg-neutral-800" />
            <div className="mx-auto mt-4 h-6 w-96 animate-pulse bg-neutral-900" />
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-800 bg-neutral-950 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-5 w-32 animate-pulse bg-neutral-800" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-4">
            <div className="h-12 w-full animate-pulse bg-neutral-900" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8 w-20 animate-pulse bg-neutral-800" />
              ))}
            </div>
          </div>

          <JobListSkeleton count={5} />
        </div>
      </section>
    </div>
  );
}
