/* eslint-disable react/no-unknown-property */

import { COLORS } from '@/constants';
import { Icon } from '@/shared/Icon';
import { fontStyle } from '../util';

export const PoweredBy = () => {
  return (
    <div tw="flex items-center">
      <span {...fontStyle('TITLE', '6', COLORS.TEXT.ALT, 'mr-[4px]')}>Powered By</span>
      <Icon name="Logo" size={18} color="#ACACAC" />
    </div>
  );
};
