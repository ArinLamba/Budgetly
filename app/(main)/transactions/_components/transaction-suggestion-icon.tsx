import { renderTransactionIcon, mapSuggestionIconToTransactionIcon } from "../_lib/appearance";
import type { TransactionSuggestionIcon } from "../_lib/suggestions";

type Props = {
  className?: string;
  icon: TransactionSuggestionIcon;
  color?: string;
};

export function TransactionSuggestionIcon({ className, icon, color }: Props) {
  return renderTransactionIcon(
    mapSuggestionIconToTransactionIcon(icon),
    className,
    { color }
  );
}
