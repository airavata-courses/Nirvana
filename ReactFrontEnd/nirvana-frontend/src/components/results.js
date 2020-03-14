import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import {WeatherContext} from '../Contexts/weather_context';
const styles = theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0px !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});
class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };
  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;
    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };
  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };
  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };
  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}
MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};
const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);
// ---

// const [dailyWeather, setWeather] = useContext(WeatherContext);


export default function ReactVirtualizedTable() {
  const rows = [];
  function createData(id, day, temprature, precipitation, humidity, windSpeed,visibility) {
    return { id, day, temprature, precipitation, humidity, windSpeed, visibility };
  }
  const [dailyWeather, setWeather] = useContext(WeatherContext);
  // console.log(dailyWeather.weather)


  //iterate through json
  let i = 0
  Object.keys(dailyWeather.weather).forEach(function(key) {
    rows.push(createData(i, key,
    dailyWeather.weather[key]["temperature"],
    dailyWeather.weather[key]["precipitation_intensity"],
    dailyWeather.weather[key]["humidity"],
    dailyWeather.weather[key]["wind_speed"],
    dailyWeather.weather[key]["visibility"]
    ))
    // console.log("my printing", dailyWeather.weather[key]["temperature"]);
    i+=1
  });
  // const weather = dailyWeather.weather;

  // const days = Object.keys(dailyWeather.weather);
  

  // for (let i = 0; i < 200; i += 1) {
  //   const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  //   rows.push(createData(i, ...randomSelection));
  // }
  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <VirtualizedTable
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        columns={[
          {
            width: 200,
            label: 'Day',
            dataKey: 'day',
          },
          {
            width: 120,
            label: 'Temprature',
            dataKey: 'temprature',
            numeric: true,
          },
          {
            width: 120,
            label: 'Precipitation',
            dataKey: 'precipitation',
            numeric: true,
          },
          {
            width: 120,
            label: 'Humidity',
            dataKey: 'humidity',
            numeric: true,
          },
          {
            width: 120,
            label: 'WindSpeed',
            dataKey: 'windSpeed',
            numeric: true,
          },
          {
            width: 120,
            label: 'Visibility',
            dataKey: 'visibility',
            numeric: true,
          }
        ]}
      />
    </Paper>
  );
}