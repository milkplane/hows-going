import { Select } from 'antd';

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

const Option = Select.Option;

const ObjectSelect = (props: ObjectSelectProps) => {
    console.log('value ', props.value.id);
    const onSelect = (selectedId: number) => {
        props.onSelect(props.objects.find(object => object.id == selectedId) as Selectable);
        console.log(selectedId);
    }

    return <Select value={props.value.id} onChange={onSelect}>
        {props.objects.map(object => {
            return <Option value={object.id} key={object.id}>
                {object.toString()}
            </Option>
        })}
    </Select>
}

export default ObjectSelect;