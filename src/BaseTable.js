import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableHeader from './TableHeader';
import {connect} from './mini-store';
import {cellAlignStyle} from './Utils';
import Row from './Row';
import Cell from './Cell';
import ExpandedIcon from './ExpandedIcon';

class BaseTable extends React.PureComponent {
  static contextTypes = {
    table: PropTypes.any
  };

  _children = [];

  componentWillMount() {
    this._children = this._calculateChildren(this.props);
  }

  componentWillUpdate(nextProps) {
    this._children = this._calculateChildren(nextProps);
  }

  handleSort = (key, order) => {
    const {sortManager, props} = this.context.table;
    const onSort = props.onSort;
    sortManager.setOrder(key, order, (orders) => {
      this.props.store.setState({orders});
      if (typeof onSort === 'function') {
        onSort(orders);
      }
    });
  };

  handleExpanded = (event) => {
    event.stopPropagation();
    const table = this.context.table;
    const key = event.target.getAttribute('data-index');
    const expanded = event.target.getAttribute('data-value') === '1';
    table.resetExpandedRowKeys(key, !expanded);
  };

  handleRowHover = (isHover, key) => {
    this.props.store.setState({
      currentHoverKey: isHover ? key : null
    });
  };

  handleMouseEnter = record => {
    this.handleRowHover(true, record.key);
  };

  handleMouseLeave = record => {
    this.handleRowHover(false, record.key);
  };

  handleRowClick = record => {
    const table = this.context.table;
    const dataManager = table.dataManager;
    table.resetExpandedRowKeys(record.key, !dataManager.rowIsExpanded(record));
  };

  _createExpandedIcon = (props) => {
    const table = this.context.table;
    const {
      prefixCls,
      indentSize,
    } = table.props;
    const dataManager = table.dataManager;
    const {fixed} = this.props;
    const {record, columnIndex} = props;
    if (!dataManager._hasExpanded) {
      return null;
    }
    if (record._expandedEnable && columnIndex === 0 && fixed !== 'right') {
      return ExpandedIcon({
        prefixCls,
        rowKey: record.key,
        expanded: dataManager.rowIsExpanded(record),
        onClick: this.handleExpanded
      });

    } else if (dataManager._hasExpanded && !record._expandedEnable && columnIndex === 0) {
      return (<span style={{width: 17}} />);
    } else if (columnIndex === 0) {
      return (<span style={{width: record._expandedLevel * indentSize}} />);
    }
  };

  _createColumn = (props) => {
    const {column, bodyStyle, align = 'left'} = props;
    props.style = {
      ...props.style,
      width: column._width,
      ...cellAlignStyle(align),
      ...bodyStyle
    };
    props.ExpandedIcon = this._createExpandedIcon(props);
    return Cell(props);
  };

  _calculateChildren = (props) => {
    const {
      fixed,
      startIndex,
      stopIndex,
      currentHoverKey
    } = props;
    const table = this.context.table;
    const rowKey = table.rowKey;
    const {
      prefixCls,
      rowClassName,
      expandedRowByClick
    } = table.props;
    const dataManager = table.dataManager;
    const columns = table.columnManager.bodyColumns(fixed);
    const dataSource = dataManager.showData();
    const rows = [];
    for (let i = startIndex; i <= stopIndex; i++) {
      const record = dataSource[i];
      if (!record) {
        continue;
      }
      const className = typeof rowClassName === 'function'
        ? rowClassName(record, record._index)
        : rowClassName;
      const key = rowKey(record, record._index);
      const rowClass = classNames(
        'tr',
        `${prefixCls}-row`,
        `${prefixCls}-row-${record._showIndex % 2}`,
        className,
        {
          [`${prefixCls}-hover`]: currentHoverKey === record.key,
          [`${prefixCls}-expanded-row-${record._expandedLevel}`]: record._hasExpanded
        });
      const props = {
        key: `Row${i}`,
        rowKey: key,
        className: rowClass,
        components: table.components,
        columns,
        record,
        hovered: record.key === currentHoverKey,
        renderCell: this._createColumn,
        onMouseEnter: this.handleMouseEnter.bind(this, record),
        onMouseLeave: this.handleMouseLeave.bind(this, record),
      };
      if (expandedRowByClick) {
        props.onClick = this.handleRowClick.bind(this, record);
      }
      rows.push(Row(props));
    }
    return rows;
  };

  render() {
    const {hasHead, hasBody, fixed, bodyHeight, orders} = this.props;
    const table = this.context.table;
    const components = table.components;
    const columnManager = table.columnManager;
    let body;
    const Table = components.table;
    const BodyWrapper = components.body.wrapper;
    if (hasBody) {
      body = (
        <BodyWrapper className='tbody' style={{height: bodyHeight, minHeight: table.props.rowHeight}}>
          {this._children}
        </BodyWrapper>
      );
    }

    const width = columnManager.getWidth(fixed) || '100%';
    const style = {width};
    if (!fixed) {
      style.minWidth = '100%';
    }
    return (
      <Table className='table' style={style}>
        {hasHead && (
          <TableHeader
            columns={columnManager.headColumns(fixed)}
            fixed={fixed}
            onSort={this.handleSort}
            orders={orders || {}}
          />
        )}
        {body}
      </Table>
    );
  }
}

export default connect((state) => {
  const {
    currentHoverKey,
    hasScroll,
    bodyHeight,
    startIndex,
    stopIndex,
    orders,
    bodyWidth
  } = state;
  return {
    currentHoverKey,
    hasScroll,
    bodyHeight,
    startIndex,
    stopIndex,
    orders,
    bodyWidth
  };
})(BaseTable);

