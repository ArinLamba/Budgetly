import * as TablerIcons from "@tabler/icons-react";
import { type Icon } from "@tabler/icons-react";
import { createElement, type CSSProperties } from "react";

export const transactionColors = [
  "#6366f1",
  "#10b981",
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#64748b",
  "#06b6d4",
  "#84cc16",
  "#ec4899",
  "#8b5cf6",
  "#22c55e",
  "#eab308",
  "#0f766e",
  "#475569",
] as const;

type TransactionIconItem = {
  icon: keyof typeof TablerIcons;
  name: string;
};

type TransactionIconCategory = {
  icons: TransactionIconItem[];
  label: string;
};

export const transactionIconCategories: TransactionIconCategory[] = [
  {
    label: "Money",
    icons: [
      { name: "Wallet", icon: "IconWallet" },
      { name: "Bank", icon: "IconBuildingBank" },
      { name: "Cash", icon: "IconCashBanknote" },
      { name: "Card", icon: "IconCreditCard" },
      { name: "Receipt", icon: "IconReceipt" },
      { name: "Piggy Bank", icon: "IconPigMoney" },
      { name: "Coins", icon: "IconCoins" },
      { name: "Rupee", icon: "IconCoinRupee" },
      { name: "Report Money", icon: "IconReportMoney" },
      { name: "Business", icon: "IconBusinessplan" },
      { name: "Pie Chart", icon: "IconChartPie" },
      { name: "Bar Chart", icon: "IconChartBar" },
      { name: "Trending Up", icon: "IconTrendingUp" },
      { name: "Trending Down", icon: "IconTrendingDown" },
      { name: "Calculator", icon: "IconCalculator" },
      { name: "Vault", icon: "IconLockDollar" },
    ],
  },
  {
    label: "Shopping",
    icons: [
      { name: "Store", icon: "IconBuildingStore" },
      { name: "Warehouse", icon: "IconBuildingWarehouse" },
      { name: "Grocery", icon: "IconShoppingCart" },
      { name: "Shopping", icon: "IconShoppingBag" },
      { name: "Basket", icon: "IconBasket" },
      { name: "Shirt", icon: "IconShirt" },
      { name: "Hanger", icon: "IconHanger" },
      { name: "Shoe", icon: "IconShoe" },
      { name: "Gift", icon: "IconGift" },
      { name: "Discount", icon: "IconRosetteDiscount" },
      { name: "Package", icon: "IconPackage" },
      { name: "Delivery", icon: "IconTruckDelivery" },
    ],
  },
  {
    label: "Food",
    icons: [
      { name: "Coffee", icon: "IconCoffee" },
      { name: "Food", icon: "IconToolsKitchen2" },
      { name: "Bowl", icon: "IconBowlSpoon" },
      { name: "Pizza", icon: "IconPizza" },
      { name: "Burger", icon: "IconBurger" },
      { name: "Ice Cream", icon: "IconIceCream2" },
      { name: "Cake", icon: "IconCake" },
      { name: "Beer", icon: "IconBeer" },
      { name: "Bottle", icon: "IconBottle" },
      { name: "Chef", icon: "IconChefHat" },
      { name: "Soup", icon: "IconSoup" },
      { name: "Apple", icon: "IconApple" },
      { name: "Vegetables", icon: "IconCarrot" },
    ],
  },
  {
    label: "Travel",
    icons: [
      { name: "Plane", icon: "IconPlane" },
      { name: "Train", icon: "IconTrain" },
      { name: "Bus", icon: "IconBus" },
      { name: "Car", icon: "IconCar" },
      { name: "Motorbike", icon: "IconMotorbike" },
      { name: "Bike", icon: "IconBike" },
      { name: "Taxi", icon: "IconCar" },
      { name: "Fuel", icon: "IconGasStation" },
      { name: "Parking", icon: "IconParking" },
      { name: "Map Pin", icon: "IconMapPin" },
      { name: "Road", icon: "IconRoad" },
      { name: "Ship", icon: "IconShip" },
    ],
  },
  {
    label: "Home & Bills",
    icons: [
      { name: "Home", icon: "IconHome" },
      { name: "Community", icon: "IconBuildingCommunity" },
      { name: "Apartment", icon: "IconBuildingSkyscraper" },
      { name: "Sofa", icon: "IconSofa" },
      { name: "Bed", icon: "IconBed" },
      { name: "Bath", icon: "IconBath" },
      { name: "Bulb", icon: "IconBulb" },
      { name: "Wifi", icon: "IconWifi" },
      { name: "Phone", icon: "IconPhone" },
      { name: "Mobile", icon: "IconDeviceMobile" },
      { name: "Laptop", icon: "IconDeviceLaptop" },
      { name: "Desktop", icon: "IconDeviceDesktop" },
      { name: "Printer", icon: "IconPrinter" },
      { name: "Plug", icon: "IconPlug" },
      { name: "Electricity", icon: "IconBolt" },
      { name: "Water", icon: "IconDroplet" },
      { name: "Gas", icon: "IconFlame" },
    ],
  },
  {
    label: "Health & Fitness",
    icons: [
      { name: "Health", icon: "IconShieldHeart" },
      { name: "Heart", icon: "IconHeart" },
      { name: "Doctor", icon: "IconStethoscope" },
      { name: "Medicine", icon: "IconPill" },
      { name: "Vaccine", icon: "IconVaccine" },
      { name: "Ambulance", icon: "IconAmbulance" },
      { name: "Dental", icon: "IconDental" },
      { name: "Eye Care", icon: "IconEye" },
      { name: "Activity", icon: "IconActivity" },
      { name: "Gym", icon: "IconBarbell" },
      { name: "Run", icon: "IconRun" },
      { name: "Yoga", icon: "IconYoga" },
      { name: "Swimming", icon: "IconSwimming" },
      { name: "Sports", icon: "IconBallFootball" },
    ],
  },
  {
    label: "Learning & Work",
    icons: [
      { name: "Book", icon: "IconBook" },
      { name: "Books", icon: "IconBooks" },
      { name: "Notebook", icon: "IconNotebook" },
      { name: "School", icon: "IconSchool" },
      { name: "Certificate", icon: "IconCertificate" },
      { name: "Briefcase", icon: "IconBriefcase" },
      { name: "Badge", icon: "IconIdBadge" },
      { name: "User Money", icon: "IconUserDollar" },
      { name: "Users", icon: "IconUsers" },
      { name: "Invoice", icon: "IconFileInvoice" },
      { name: "Document", icon: "IconFileText" },
      { name: "Mail", icon: "IconMail" },
    ],
  },
  {
    label: "Fun & Life",
    icons: [
      { name: "Game", icon: "IconDeviceGamepad2" },
      { name: "TV", icon: "IconDeviceTv" },
      { name: "Movie", icon: "IconMovie" },
      { name: "Music", icon: "IconMusic" },
      { name: "Headphones", icon: "IconHeadphones" },
      { name: "Microphone", icon: "IconMicrophone" },
      { name: "Ticket", icon: "IconTicket" },
      { name: "Palette", icon: "IconPalette" },
      { name: "Camera", icon: "IconCamera" },
      { name: "Photo", icon: "IconPhoto" },
      { name: "Confetti", icon: "IconConfetti" },
      { name: "Balloon", icon: "IconBalloon" },
      { name: "Baby", icon: "IconBabyCarriage" },
      { name: "Care", icon: "IconHeartHandshake" },
      { name: "Sparkles", icon: "IconSparkles" },
    ],
  },
  {
    label: "Nature",
    icons: [
      { name: "Pet Dog", icon: "IconDog" },
      { name: "Pet Cat", icon: "IconCat" },
      { name: "Plant", icon: "IconPlant" },
      { name: "Leaf", icon: "IconLeaf" },
      { name: "Flower", icon: "IconFlower" },
      { name: "Trees", icon: "IconTrees" },
      { name: "Beach", icon: "IconBeach" },
      { name: "Sun", icon: "IconSun" },
      { name: "Moon", icon: "IconMoon" },
      { name: "Cloud", icon: "IconCloud" },
      { name: "Umbrella", icon: "IconUmbrella" },
    ],
  },
] as const satisfies TransactionIconCategory[];

export type TransactionIconName = string;

export const transactionIconMap = transactionIconCategories
  .flatMap((category) => category.icons)
  .reduce<Record<string, Icon>>((icons, item) => {
    icons[item.name] = TablerIcons[item.icon] as Icon;
    return icons;
  }, {});

export function getTransactionIcon(icon?: string | null) {
  return transactionIconMap[icon ?? ""] ?? TablerIcons.IconWallet;
}

export function renderTransactionIcon(
  icon: string | null | undefined,
  className?: string,
  style?: CSSProperties
) {
  return createElement(getTransactionIcon(icon), { className, style });
}

export function mapSuggestionIconToTransactionIcon(icon: string) {
  const icons: Record<string, TransactionIconName> = {
    bank: "Bank",
    bill: "Receipt",
    book: "Book",
    bus: "Bus",
    cab: "Taxi",
    card: "Card",
    cash: "Cash",
    charity: "Care",
    doctor: "Doctor",
    education: "School",
    electricity: "Electricity",
    coffee: "Coffee",
    food: "Food",
    fuel: "Fuel",
    gift: "Gift",
    grocery: "Grocery",
    gym: "Gym",
    heart: "Heart",
    home: "Home",
    hotel: "Bed",
    insurance: "Health",
    investment: "Trending Up",
    loan: "Invoice",
    medicine: "Medicine",
    movie: "Movie",
    music: "Music",
    parking: "Parking",
    pet: "Pet Dog",
    phone: "Phone",
    rent: "Home",
    salary: "Cash",
    savings: "Piggy Bank",
    shopping: "Shopping",
    subscription: "TV",
    taxi: "Car",
    travel: "Plane",
    water: "Water",
    wifi: "Wifi",
  };

  return icons[icon] ?? "Wallet";
}
