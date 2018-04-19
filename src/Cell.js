import React from 'react';

type Props = {
  key: string,
  className: string,
  column: Object,
  record: Object,
  components: Object,
  style: Object,
  ExpandedIcon: React.Element<*>
};

function Cell(props: Props) {
  const {
    key,
    column,
    record,
    components,
    style,
    ExpandedIcon
  } = props;
  const {render, dataIndex} = column;
  const Td = components.body.cell;
  const tdProps = {
    key,
    className: 'td',
    style,
    children: record[dataIndex]
  };
  let children = record[dataIndex];
  if (render) {
    children = render(record[dataIndex], record, record._index);
  }
  return (
    <Td {...tdProps} >
      {ExpandedIcon}
      {children}
    </Td>
  );
}

export default Cell;
