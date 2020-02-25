import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function MenuSwapTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M12,6L7,11H17L12,6M7,13L12,18L17,13H7Z" />
      </Fragment>
    </SvgIcon>
  );
}
