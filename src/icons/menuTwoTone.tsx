import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function MenuTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
      </Fragment>
    </SvgIcon>
  );
}
