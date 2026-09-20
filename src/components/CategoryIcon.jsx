import { Car, Home, Shirt, Smartphone, Sofa, Briefcase, Wrench, Store, PawPrint, Package } from "lucide-react";

export const categoryIcons = {
  Car,
  Home,
  Shirt,
  Smartphone,
  Sofa,
  Briefcase,
  Wrench,
  Store,
  PawPrint,
  Package,
};

export default function CategoryIcon({ name, className }) {
  const Icon = categoryIcons[name] || Package;
  return <Icon className={className} />;
}
