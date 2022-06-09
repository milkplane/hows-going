import React from 'react';
import Map from './features/finding/Map';
import OptionsPanel from './features/finding/OptionsPanel';
import { Col, Row, Space } from 'antd';
import MapChanger from './features/finding/MapChanger';
import GreedSlider from './features/finding/GreedSlider';
import ToolSelect from './features/finding/ToolSelect';
import SearchButton from './features/finding/SearchButton';
import styled from 'styled-components';
import PathfinderInfo from './features/finding/PathfinderInfo';

const AppName = styled.h1`
    font-size: 36px;
    font-family: sans-serif;
`

function App() {
  return (
    <Row align='middle'>
      <Col span={24} lg={9}>
        <Row align='middle' justify='center' style={{ height: '100vh' }}>
          <OptionsPanel>
            <AppName>How's it going</AppName>
            <MapChanger />
            <Space direction="vertical" style={{ width: "80%" }}>
              <p>Жадность поиска</p>
              <GreedSlider />
            </Space>
            <PathfinderInfo/>
            <ToolSelect/>
            <SearchButton />
          </OptionsPanel>
        </Row>
      </Col>
      <Col span={24} lg={15}>
        <Map />
      </Col>
    </Row>
  );
}

export default App;
