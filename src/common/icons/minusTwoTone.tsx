import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function MinusTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M19,13H5V11H19V13Z" />
      </Fragment>
    </SvgIcon>
  );
}
