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
    const onSelect = (selectedId: number) => {
        props.onSelect(props.objects.find(object => object.id == selectedId)?.value);
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