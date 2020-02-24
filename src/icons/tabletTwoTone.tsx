import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function TabletTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M19,18H5V6H19M21,4H3C1.89,4 1,4.89 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18V6C23,4.89 22.1,4 21,4Z" />
      </Fragment>
    </SvgIcon>
  );
}
