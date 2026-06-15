type Props = {
  children: React.ReactNode;
};

const GoalLayout = ({ children }: Props) => {
  return (
    <div className="w-full lg:pr-[282px]">
      {children}
    </div>
  );
};

export default GoalLayout;
