import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function DashboardTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
      </Fragment>
    </SvgIcon>
  );
}
