import React from 'react';
import { Dumbbell, Gamepad2, Footprints, Flower2, Waves, Armchair, HelpCircle } from 'lucide-react';

export const IconMap: Record<string, React.FC<any>> = {
  'Dumbbell': Dumbbell,
  'Gamepad2': Gamepad2,
  'Footprints': Footprints,
  'Flower2': Flower2,
  'Waves': Waves,
  'Armchair': Armchair,
};

interface IconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className }) => {
  const IconComponent = IconMap[name] || HelpCircle;
  return <IconComponent className={className} />;
};
