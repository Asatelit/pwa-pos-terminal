import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function ChevronUpTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
      </Fragment>
    </SvgIcon>
  );
}
