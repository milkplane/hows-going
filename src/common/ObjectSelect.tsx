import { Select } from 'antd';
const Option = Select.Option;

export type Selectable = {
    id: number;
    toString: () => string;
    value: any; // )
}

type OnSelect = (selected: Selectable) => any;

type ObjectSelectProps = {
    objects: Selectable[];
    onSelect: OnSelect;
    value: Selectable;
}

const ObjectSelect = (props: ObjectSelectProps) => {
    const onSelect = (selectedId: number) => {
        props.onSelect(props.objects.find(object => object.id == selectedId) as Selectable);
        console.log(selectedId);
    }

    const options = props.objects.map(object => {
        return <Option value={object.id} key={object.id}>
            {object.toString()}
        </Option>
    });

    return <Select value={props.value.id} onChange={onSelect} style={{ width: '100%' }}>
        {options}
    </Select>
}

export default ObjectSelect;