import React from 'react';
import Map from './features/finding/Map';
import OptionsPanel from './features/finding/OptionsPanel';
import { Col, Row } from 'antd';
import ToolSelect from './features/finding/ToolSelect';
import SearchButton from './features/finding/SearchButton';
import styled from 'styled-components';
import PathfinderInfo from './features/finding/PathfinderInfo';
import GreedSlot from './features/finding/GreedSlot';

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
            <GreedSlot/>
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
