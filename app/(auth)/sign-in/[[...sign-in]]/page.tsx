import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-black px-4 py-12">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-white text-black hover:bg-neutral-200 uppercase font-semibold tracking-wider",
            card: "bg-black border border-neutral-800",
            headerTitle: "text-white font-black uppercase tracking-tight",
            headerSubtitle: "text-neutral-400",
            socialButtonsBlockButton:
              "bg-black border border-neutral-700 text-white hover:bg-neutral-900",
            socialButtonsBlockButtonText: "text-white font-medium",
            formFieldLabel: "text-neutral-400 uppercase text-xs tracking-wider",
            formFieldInput:
              "bg-black border-neutral-700 text-white focus:border-white",
            footerActionLink: "text-white hover:text-neutral-300",
            identityPreviewText: "text-white",
            identityPreviewEditButton: "text-neutral-400 hover:text-white",
            formFieldInputShowPasswordButton: "text-neutral-400",
            dividerLine: "bg-neutral-800",
            dividerText: "text-neutral-500",
          },
        }}
      />
    </div>
  );
}
