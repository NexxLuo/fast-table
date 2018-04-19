import React from 'react';

type Props = {
  className: string,
  key: string,
  components: Object,
  columns: Array,
  record: Object,
  onHover: Function,
  onMouseEnter: Function,
  onMouseLeave: Function,
  onClick: Function,
  renderCell: Function
}

function Row(props: Props) {
  const {
    className,
    key,
    components,
    columns,
    record,
    onMouseEnter,
    onMouseLeave,
    onClick,
    renderCell
  } = props;
  const Tr = components.body.row;
  const trProps = {
    key,
    className,
    style: {
      position: 'absolute',
      height: record._height,
      top: record._top
    },
    onMouseEnter,
    onMouseLeave,
    onClick
  };
  return (
    <Tr {...trProps} data-index={record.key}>
      {columns.map((column, index) =>
        renderCell({
          key: `${key}-Col${index}`,
          column,
          columnIndex: index,
          record,
          components
        })
      )}
    </Tr>
  );
}

export default Row;
