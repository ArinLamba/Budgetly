type Props = {
  children: React.ReactNode;
};

export const FeedWrapper = ({ children }: Props) => {
  return (
    <div className="flex-1 h-full relative p-2">
			{children}
    </div>
  );
};