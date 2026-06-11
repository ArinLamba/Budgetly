import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            alt="Budgetly logo"
            className="rounded-md"
            height={30}
            src="/logo.svg"
            width={30}
          />
          <span className="text-sm font-extrabold">Budgetly</span>
        </div>
        <p className="text-sm font-semibold text-slate-500">
          Track clearly. Budget calmly. Save with purpose.
        </p>
      </div>
    </footer>
  );
};
