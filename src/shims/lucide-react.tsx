import React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement> & { size?: number | string };

function makeIcon(name: string) {
  return function Icon({ size = 20, className, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-label={name}
        {...props}
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8" />
      </svg>
    );
  };
}

export const AlertCircle = makeIcon('AlertCircle');
export const ArrowDownCircle = makeIcon('ArrowDownCircle');
export const ArrowRight = makeIcon('ArrowRight');
export const ArrowUpCircle = makeIcon('ArrowUpCircle');
export const BarChart3 = makeIcon('BarChart3');
export const Bot = makeIcon('Bot');
export const CalendarDays = makeIcon('CalendarDays');
export const CheckCircle = makeIcon('CheckCircle');
export const CheckCircle2 = makeIcon('CheckCircle2');
export const ChevronLeft = makeIcon('ChevronLeft');
export const ChevronRight = makeIcon('ChevronRight');
export const Clock = makeIcon('Clock');
export const Coins = makeIcon('Coins');
export const Copy = makeIcon('Copy');
export const DollarSign = makeIcon('DollarSign');
export const Eye = makeIcon('Eye');
export const EyeOff = makeIcon('EyeOff');
export const Gift = makeIcon('Gift');
export const Globe = makeIcon('Globe');
export const Globe2 = makeIcon('Globe2');
export const Headphones = makeIcon('Headphones');
export const House = makeIcon('House');
export const Info = makeIcon('Info');
export const Lock = makeIcon('Lock');
export const LogOut = makeIcon('LogOut');
export const Megaphone = makeIcon('Megaphone');
export const MessageSquare = makeIcon('MessageSquare');
export const Moon = makeIcon('Moon');
export const Package = makeIcon('Package');
export const Paperclip = makeIcon('Paperclip');
export const Radio = makeIcon('Radio');
export const RefreshCcw = makeIcon('RefreshCcw');
export const Rocket = makeIcon('Rocket');
export const Search = makeIcon('Search');
export const Send = makeIcon('Send');
export const Settings = makeIcon('Settings');
export const Share2 = makeIcon('Share2');
export const Shield = makeIcon('Shield');
export const ShieldCheck = makeIcon('ShieldCheck');
export const ShoppingCart = makeIcon('ShoppingCart');
export const Sparkles = makeIcon('Sparkles');
export const Tag = makeIcon('Tag');
export const TrendingUp = makeIcon('TrendingUp');
export const Type = makeIcon('Type');
export const UserPlus = makeIcon('UserPlus');
export const UserRound = makeIcon('UserRound');
export const Users = makeIcon('Users');
export const Wallet = makeIcon('Wallet');
export const Wifi = makeIcon('Wifi');
export const Wrench = makeIcon('Wrench');
export const Activity = makeIcon('Activity');
export const Server = makeIcon('Server');
export const Zap = makeIcon('Zap');
export const Trash2 = makeIcon('Trash2');
export const FileText = makeIcon('FileText');
export const RefreshCw = makeIcon('RefreshCw');
export const List = makeIcon('List');
export const Star = makeIcon('Star');
export const AlarmClock = makeIcon('AlarmClock');
