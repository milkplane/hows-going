import React from 'react';
import './App.css';
import Map from './features/finding/Map';
import OptionsPanel from './features/finding/OptionsPanel';
import { Layout } from 'antd';

const Sider = Layout.Sider;

function App() {
  return (
    <div>
        <OptionsPanel/>
        <Map/>
    </div>
  );
}

export default App;
