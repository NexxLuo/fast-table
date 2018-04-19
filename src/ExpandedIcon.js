import React from 'react';
import classNames from 'classnames';

type Props = {
  expanded: boolean,
  prefixCls: string,
  rowKey: string,
  onClick: Function
}

export default function ExpandedIcon(props: Props) {
  const {expanded, prefixCls, rowKey, onClick} = props;
  const className = classNames(`${prefixCls}-expanded-icon`, {
    expanded: expanded
  });
  const eProps = {
    className,
    onClick
  };
  return (
    <span {...eProps} data-index={rowKey} data-value={expanded ? 1 : 0} />
  );
}
