import { Card } from "./card-base";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-8 group">
      <div className="flex h-12 w-12 items-center justify-center border border-neutral-800 text-white group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-200">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold uppercase tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-3 text-neutral-400">{description}</p>
    </Card>
  );
}
