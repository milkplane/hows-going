import { Col, Row, Space } from 'antd';
import { Children } from 'react';
import { ReactNode } from "react";

type OptionsPanelProps = {
    children?: ReactNode
}

const OptionsPanel = (props: OptionsPanelProps) => {
    const rows = Children.map(props.children,
        (child) => {
            return <Row justify="center">
                {child}
            </Row>
        });

    return <Row justify="center" align="middle">
        <Col span={16} style={{ justifyContent: 'center' }}>
            <Space direction="vertical" size={50}>
                {rows}
            </Space>
        </Col>
    </Row>
}

export default OptionsPanel;