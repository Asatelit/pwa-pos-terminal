import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function ChevronDownTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
      </Fragment>
    </SvgIcon>
  );
}
