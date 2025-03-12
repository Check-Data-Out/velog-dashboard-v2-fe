import * as Icons from './icons';
export { default as SvgrMock } from './SvgrMock';

export type NameType = keyof typeof Icons;
type iconType = Record<
  NameType,
  React.JSXElementConstructor<React.SVGProps<SVGSVGElement>>
>;

interface IProp extends React.SVGProps<SVGSVGElement> {
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
  size = 30,
  color = '#ACACAC',
  rotate = 'up',
  ...rest
}: IProp) => {
  const Comp = (Icons as iconType)[name];

  if ((Comp as unknown as { src: string })?.src) {
    return <svg></svg>;
  }
  return (
    <Comp
      {...rest}
      style={{ color }}
      width={size}
      height={size}
      className={`transition-all duration-300 shrink-0 ${rotates[rotate]} ${rest.className}`}
    />
  );
};
