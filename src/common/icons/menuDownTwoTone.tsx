import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function MenuDownTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M7,10L12,15L17,10H7Z" />
      </Fragment>
    </SvgIcon>
  );
}
