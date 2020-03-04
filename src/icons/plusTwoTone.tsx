import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function PlusTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
      </Fragment>
    </SvgIcon>
  );
}
