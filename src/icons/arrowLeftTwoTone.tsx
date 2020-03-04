import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function ArrowLeftTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
      </Fragment>
    </SvgIcon>
  );
}
