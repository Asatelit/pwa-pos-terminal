import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function ChevronLeftTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
      </Fragment>
    </SvgIcon>
  );
}
