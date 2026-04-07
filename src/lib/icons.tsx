import {
  DollarSign, Megaphone, ShoppingCart, Settings, MessageCircle,
  TrendingUp, Target, Users, ShoppingBag, BarChart3,
  Camera, Package, Handshake, Volume2, Brain,
  Truck, AlertTriangle, CheckCircle, CreditCard, Search,
  ClipboardList, Star, PenLine, RefreshCw, Tag, Wrench,
  Link2, Radio,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  "dollar-sign": DollarSign,
  "megaphone": Megaphone,
  "shopping-cart": ShoppingCart,
  "settings": Settings,
  "message-circle": MessageCircle,
  "trending-up": TrendingUp,
  "target": Target,
  "users": Users,
  "shopping-bag": ShoppingBag,
  "bar-chart": BarChart3,
  "camera": Camera,
  "package": Package,
  "handshake": Handshake,
  "volume": Volume2,
  "brain": Brain,
  "truck": Truck,
  "alert": AlertTriangle,
  "check": CheckCircle,
  "credit-card": CreditCard,
  "search": Search,
  "clipboard": ClipboardList,
  "star": Star,
  "pen-line": PenLine,
  "refresh": RefreshCw,
  "tag": Tag,
  "wrench": Wrench,
  "link": Link2,
  "radio": Radio,
};

export function IconByName({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <span className={className}>{name}</span>;
  return <Icon size={size} className={className} />;
}

export { ICON_MAP };
