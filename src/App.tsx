import React from 'react';
import './App.css';
import Map from './features/finding/Map';
import OptionsPanel from './features/finding/OptionsPanel';
import { Col, Layout, Row } from 'antd';

const Sider = Layout.Sider;

function App() {
  return (
    <Row align='middle'>
      <Col span={24} lg={9}>
        <Row align='middle' justify='center' style={{height: '100vh'}}>
          <OptionsPanel />
        </Row>
      </Col>
      <Col span={24} lg={15}>
        <Map />
      </Col>
    </Row>
  );
}

export default App;
