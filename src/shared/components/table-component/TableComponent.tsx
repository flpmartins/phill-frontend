import React, { useState } from 'react'
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  useTheme,
  TablePagination,
  useMediaQuery,
  Typography,
} from '@mui/material'
import SyncIcon from '@mui/icons-material/Sync'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import DescriptionIcon from '@mui/icons-material/Description'

export interface IColumn {
  key: string
  label: string
  renderCell: (row: any) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

interface ITableComponentProps {
  columns: IColumn[]
  rows: any[]
  renderRowDetails?: (row: any) => React.ReactNode
  maxHeight?: string
  onRefresh: () => void
  page: number
  rowsPerPage: number
  onPageChange: (newPage: number) => void
  onRowsPerPageChange: (newRowsPerPage: number) => void
  totalRows: number
}

const TableComponent: React.FC<ITableComponentProps> = ({
  columns,
  rows,
  renderRowDetails,
  maxHeight,
  onRefresh,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalRows,
}) => {
  const theme = useTheme()
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index)
  }

  const handleRefresh = () => {
    if (!isRefreshing) {
      setIsRefreshing(true)
      onRefresh()
      setTimeout(() => setIsRefreshing(false), 1000)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer
        sx={{
          maxHeight: maxHeight || '80vh',
          overflowX: 'hidden',
          position: 'relative',
          paddingTop: '-100px',
          '&::-webkit-scrollbar': {
            width: isMobile ? '4px' : '4px',
            height: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.background.paper,
            height: '20px !important',
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell align={col.align || 'left'} key={col.key}>
                  {col.label}
                </TableCell>
              ))}
              <TableCell
                align="left"
                sx={{
                  width: '15px',
                }}
              >
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    padding: '0px',
                    color: theme.palette.primary.main,
                    animation: isRefreshing
                      ? 'spin 1s linear infinite'
                      : 'none', // Aplica animação
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                >
                  <SyncIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} width="100%">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    padding: 2,
                    flexDirection: 'column',
                  }}
                >
                  <DescriptionIcon
                    sx={{
                      width: '50px',
                      height: 'auto',
                      color: theme.palette.text.secondary,
                    }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    Sem dados disponíveis.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            <TableBody>
              {rows.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell align={col.align || 'left'} key={col.key}>
                        {col.renderCell(row)}
                      </TableCell>
                    ))}
                    {renderRowDetails ? (
                      <TableCell align="left">
                        <IconButton
                          size="small"
                          sx={{
                            color: theme.palette.primary.main,
                          }}
                          onClick={() => toggleRow(rowIndex)}
                        >
                          {expandedRow === rowIndex ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                    ) : (
                      <TableCell></TableCell>
                    )}
                  </TableRow>
                  {renderRowDetails && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + 1}
                        sx={{
                          padding: 0,
                        }}
                      >
                        <Collapse
                          in={expandedRow === rowIndex}
                          timeout={300}
                          unmountOnExit
                        >
                          <Box sx={{ padding: 1 }}>{renderRowDetails(row)}</Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) =>
          onRowsPerPageChange(parseInt(event.target.value, 10))
        }
        labelDisplayedRows={() => ''}
      />
    </Box>
  )
}

export default TableComponent
