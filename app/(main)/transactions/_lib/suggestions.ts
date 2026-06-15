import type { PaymentMethod, TransactionType } from "./types";

export type TransactionSuggestionIcon = string;

export type TransactionSuggestion = {
  amount: number;
  categoryName: string;
  color: string;
  description: string;
  icon: TransactionSuggestionIcon;
  id: string;
  label: string;
  paymentMethod: PaymentMethod;
  type: TransactionType;
};

export type TransactionSuggestionGroup = {
  label: string;
  suggestions: TransactionSuggestion[];
};

const suggestionColors = [
  "#06b6d4",
  "#f97316",
  "#8b5cf6",
  "#3b82f6",
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#34d399",
  "#ec4899",
  "#ef4444",
  "#14b8a6",
  "#a855f7",
  "#84cc16",
  "#64748b",
];

export const transactionSuggestionGroups: TransactionSuggestionGroup[] = [
  {
    label: "Food & Dining",
    suggestions: [
      makeSuggestion("coffee", "Coffee", "Food & Dining", 120, "upi", "coffee"),
      makeSuggestion("swiggy", "Swiggy", "Food & Dining", 250, "upi", "food"),
      makeSuggestion("zomato", "Zomato", "Food & Dining", 300, "upi", "food"),
      makeSuggestion("groceries", "Groceries", "Food & Dining", 1200, "upi", "grocery"),
      makeSuggestion("restaurant", "Restaurant", "Food & Dining", 1500, "card", "food"),
      makeSuggestion("snacks", "Snacks", "Food & Dining", 180, "upi", "food"),
      makeSuggestion("bakery", "Bakery", "Food & Dining", 350, "upi", "food"),
      makeSuggestion("ice-cream", "Ice Cream", "Food & Dining", 220, "upi", "food"),
      makeSuggestion("office-lunch", "Office Lunch", "Food & Dining", 280, "upi", "food"),
    ],
  },
  {
    label: "Travel",
    suggestions: [
      makeSuggestion("petrol", "Petrol", "Transport", 1000, "cash", "fuel"),
      makeSuggestion("uber", "Uber", "Transport", 450, "upi", "taxi"),
      makeSuggestion("ola", "Ola", "Transport", 420, "upi", "taxi"),
      makeSuggestion("metro", "Metro Card", "Transport", 200, "upi", "bus"),
      makeSuggestion("bus-pass", "Bus Pass", "Transport", 800, "upi", "bus"),
      makeSuggestion("parking", "Parking", "Transport", 100, "upi", "parking"),
      makeSuggestion("train-ticket", "Train Ticket", "Travel", 650, "upi", "travel"),
      makeSuggestion("flight-ticket", "Flight Ticket", "Travel", 4500, "card", "travel"),
      makeSuggestion("hotel-booking", "Hotel Booking", "Travel", 2500, "card", "hotel"),
      makeSuggestion("cab-rental", "Cab Rental", "Travel", 1600, "upi", "cab"),
    ],
  },
  {
    label: "Bills",
    suggestions: [
      makeSuggestion("internet", "Internet Bill", "Bills & Utilities", 800, "upi", "wifi"),
      makeSuggestion("mobile", "Mobile Recharge", "Bills & Utilities", 299, "upi", "phone"),
      makeSuggestion("electricity", "Electricity Bill", "Bills & Utilities", 1600, "upi", "bill"),
      makeSuggestion("rent", "Rent", "Bills & Utilities", 12000, "bank_transfer", "home"),
      makeSuggestion("credit-card", "Credit Card Bill", "Bills & Utilities", 5000, "bank_transfer", "card"),
      makeSuggestion("water-bill", "Water Bill", "Bills & Utilities", 400, "upi", "water"),
      makeSuggestion("gas-bill", "Gas Cylinder", "Bills & Utilities", 1100, "upi", "bill"),
      makeSuggestion("maintenance", "Society Maintenance", "Home", 2500, "bank_transfer", "home"),
      makeSuggestion("loan-emi", "Loan EMI", "Loan & EMI", 9000, "bank_transfer", "loan"),
      makeSuggestion("insurance", "Insurance Premium", "Insurance", 2200, "bank_transfer", "insurance"),
    ],
  },
  {
    label: "Lifestyle",
    suggestions: [
      makeSuggestion("netflix", "Netflix", "Entertainment", 199, "upi", "movie"),
      makeSuggestion("prime", "Prime Video", "Entertainment", 299, "card", "movie"),
      makeSuggestion("shopping", "Shopping", "Entertainment", 2000, "card", "shopping"),
      makeSuggestion("medicine", "Medicine", "Bills & Utilities", 600, "upi", "heart"),
      makeSuggestion("gift", "Gift", "Entertainment", 1000, "upi", "gift"),
      makeSuggestion("books", "Books", "Entertainment", 700, "upi", "book"),
      makeSuggestion("spotify", "Spotify", "Subscriptions", 119, "upi", "music"),
      makeSuggestion("youtube", "YouTube Premium", "Subscriptions", 149, "card", "subscription"),
      makeSuggestion("clothes", "Clothes", "Shopping", 1800, "card", "shopping"),
      makeSuggestion("salon", "Salon", "Personal Care", 700, "upi", "heart"),
      makeSuggestion("pet-care", "Pet Care", "Pets", 900, "upi", "pet"),
    ],
  },
  {
    label: "Health & Fitness",
    suggestions: [
      makeSuggestion("doctor", "Doctor Visit", "Healthcare", 800, "upi", "doctor"),
      makeSuggestion("pharmacy", "Pharmacy", "Healthcare", 500, "upi", "medicine"),
      makeSuggestion("lab-test", "Lab Test", "Healthcare", 1200, "card", "doctor"),
      makeSuggestion("gym", "Gym Membership", "Fitness", 1500, "upi", "gym"),
      makeSuggestion("sports", "Sports", "Fitness", 900, "upi", "gym"),
    ],
  },
  {
    label: "Learning & Work",
    suggestions: [
      makeSuggestion("course", "Online Course", "Education", 2000, "card", "education"),
      makeSuggestion("tuition", "Tuition", "Education", 3000, "bank_transfer", "education"),
      makeSuggestion("stationery", "Stationery", "Education", 350, "upi", "book"),
      makeSuggestion("software", "Software Subscription", "Work", 1200, "card", "subscription"),
      makeSuggestion("coworking", "Coworking", "Work", 2500, "upi", "bank"),
    ],
  },
  {
    label: "Savings & Investments",
    suggestions: [
      makeSuggestion("sip", "SIP Investment", "Investments", 5000, "bank_transfer", "investment"),
      makeSuggestion("fixed-deposit", "Fixed Deposit", "Savings", 10000, "bank_transfer", "savings"),
      makeSuggestion("emergency-fund", "Emergency Fund", "Savings", 3000, "bank_transfer", "savings"),
      makeSuggestion("gold", "Gold Savings", "Investments", 2500, "upi", "investment"),
      makeSuggestion("charity", "Charity", "Donations", 500, "upi", "charity"),
    ],
  },
  {
    label: "Income",
    suggestions: [
      makeSuggestion("salary", "Salary", "Income", 35000, "bank_transfer", "salary", "income"),
      makeSuggestion("freelance", "Freelance Project", "Income", 5000, "bank_transfer", "bank", "income"),
      makeSuggestion("bonus", "Bonus", "Income", 10000, "bank_transfer", "gift", "income"),
      makeSuggestion("refund", "Refund", "Income", 1200, "upi", "bank", "income"),
      makeSuggestion("cashback", "Cashback", "Income", 250, "upi", "card", "income"),
      makeSuggestion("interest", "Interest", "Income", 700, "bank_transfer", "investment", "income"),
      makeSuggestion("dividend", "Dividend", "Income", 1000, "bank_transfer", "investment", "income"),
      makeSuggestion("rental-income", "Rental Income", "Income", 12000, "bank_transfer", "rent", "income"),
      makeSuggestion("pocket-money", "Pocket Money", "Income", 2000, "upi", "cash", "income"),
      makeSuggestion("sold-item", "Sold Item", "Income", 1500, "upi", "shopping", "income"),
    ],
  },
];

export const transactionSuggestions = transactionSuggestionGroups.flatMap(
  (group) => group.suggestions
);

const quickSuggestionIds = [
  "coffee",
  "swiggy",
  "petrol",
  "salary",
  "internet",
  "netflix",
];

export const transactionQuickSuggestions = quickSuggestionIds
  .map((id) => transactionSuggestions.find((suggestion) => suggestion.id === id))
  .filter((suggestion): suggestion is TransactionSuggestion => Boolean(suggestion));

function makeSuggestion(
  id: string,
  label: string,
  categoryName: string,
  amount: number,
  paymentMethod: PaymentMethod,
  icon: TransactionSuggestionIcon,
  type: TransactionType = "expense",
  color = getSuggestionColor(id)
): TransactionSuggestion {
  return {
    amount,
    categoryName,
    color,
    description: label,
    icon,
    id,
    label,
    paymentMethod,
    type,
  };
}

function getSuggestionColor(id: string) {
  const colorIndex = Array.from(id).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0
  );

  return suggestionColors[colorIndex % suggestionColors.length];
}
