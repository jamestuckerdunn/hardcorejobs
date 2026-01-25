import { Card } from "./card-base";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  company,
  image,
}: TestimonialCardProps) {
  return (
    <Card className="p-8">
      <blockquote className="text-lg text-neutral-300 italic">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="mt-6 flex items-center gap-4">
        {image ? (
          <img
            src={image}
            alt={`Photo of ${author}`}
            className="h-12 w-12 object-cover grayscale"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center bg-neutral-800 text-lg font-bold text-white">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-sm text-neutral-500">
            {role}, {company}
          </p>
        </div>
      </div>
    </Card>
  );
}
