import { JSXElementConstructor, SVGProps } from 'react';
import * as Icons from './icons';

export type NameType = keyof typeof Icons;
type iconType = Record<
  NameType,
  JSXElementConstructor<SVGProps<SVGSVGElement>>
>;

interface IProp extends SVGProps<SVGSVGElement> {
  name: NameType;
  size?: number;
  color?: string;
  rotate?: keyof typeof rotates;
}

const rotates = {
  up: 'rotate-[0deg]',
  down: 'rotate-[180deg]',
  right: 'rotate-[90deg]',
  left: 'rotate-[-90deg]',
};

export const Icon = ({
  name,
  size,
  color = '#ACACAC',
  rotate = 'up',
  ...rest
}: IProp) => {
  const Comp = (Icons as iconType)[name];

  return (
    <Comp
      {...rest}
      style={{ color }}
      width={size ? size : 'auto'}
      height={size ? size : 'auto'}
      className={`${rotates[rotate]} transition-all duration-300 shrink-0 ${rest.className}`}
    />
  );
};
