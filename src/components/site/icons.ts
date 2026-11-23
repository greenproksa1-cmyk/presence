import {
  BookOpen,
  Briefcase,
  Building2,
  ChefHat,
  CupSoda,
  Factory,
  Handshake,
  Hotel,
  Landmark,
  Lightbulb,
  Sparkles,
  Store,
  TrendingUp,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ContentIcon } from "@/lib/types";

const ICONS: Record<ContentIcon, LucideIcon> = {
  catering: UtensilsCrossed,
  beverage: CupSoda,
  hotel: Hotel,
  restaurant: Store,
  logistics: Truck,
  factory: Factory,
  government: Landmark,
  investment: TrendingUp,
  expertise: Briefcase,
  partnership: Handshake,
  knowledge: BookOpen,
  opportunity: Lightbulb,
};

export function contentIcon(icon: ContentIcon): LucideIcon {
  return ICONS[icon] ?? Sparkles;
}

export { ChefHat, Building2 };
