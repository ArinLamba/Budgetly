type Props = {
  children: React.ReactNode;
};

export const StickyWrapper = ({
  children,
}: Props) => {
  return (
    <aside className="fixed right-3 top-3 z-20 hidden h-[calc(100dvh-1.5rem)] w-[272px] flex-col overflow-hidden rounded-lg border bg-card/95 text-card-foreground shadow-sm backdrop-blur lg:flex "
    >
      {children}
    </aside>
  );
};
