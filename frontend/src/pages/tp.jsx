import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];

export default function tp() {
  if (navigator.geolocation.watchPosition) {
    navigator.geolocation.watchPosition((position) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
    },
    (error) => {
      console.error('Error getting location:', error);
    });
  }
  return (
    <div style={{ height: 300, width: '100%' }}>
      <h1>Tracking Page</h1>
    </div>
  );
}