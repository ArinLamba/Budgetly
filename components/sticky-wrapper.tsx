type Props = {
  children: React.ReactNode;
};

export const StickyWrapper = ({
  children,
}: Props) => {
  return (
    <aside className="fixed right-1 h-full top-0 z-20 hidden w-[272px] flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm backdrop-blur lg:flex "
    >
      {children}
    </aside>
  );
};
