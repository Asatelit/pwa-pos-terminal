import React, { Fragment } from 'react';
import { SvgIcon, SvgIconProps } from 'common/components';

export default function ChevronRightTwoTone(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <Fragment>
        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
      </Fragment>
    </SvgIcon>
  );
}
