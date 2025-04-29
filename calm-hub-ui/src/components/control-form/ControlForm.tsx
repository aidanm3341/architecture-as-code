import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import './ControlForm.css';
import { useState } from 'react';

type Inputs = {
    [key: string]: unknown;
};

export type Row = {
    label: string;
    valueType: 'const' | 'var';
    value: string;
    required: boolean;
};

const numberOfFields = 4;

function createInput(
    fieldName: string,
    index: number,
    register: UseFormRegister<Inputs>,
    defaultValue: string,
    errors: FieldErrors<Inputs>
) {
    return (
        <div className="w-full">
            <input
                className="input input-primary input-md"
                {...register(`row-${index}-${fieldName}`, { required: false })}
                defaultValue={defaultValue}
            />
            {errors[`row-${index}-${fieldName}`] && <span>This field is required</span>}
        </div>
    );
}

function createDropDownInput(
    fieldName: string,
    index: number,
    register: UseFormRegister<Inputs>,
    defaultValue: string,
    errors: FieldErrors<Inputs>
) {
    return (
        <div className="w-full">
            <select
                className="select select-primary"
                {...register(`row-${index}-${fieldName}`, { required: false })}
                defaultValue={defaultValue}
            >
                <option value="const">const</option>
                <option value="var">variable</option>
            </select>
            {errors[`row-${index}-${fieldName}`] && <span>This field is required</span>}
        </div>
    );
}

function parseFormData(data: Inputs): Row[] {
    const rows: Row[] = [];
    const numberOfRows = Object.keys(data).length / numberOfFields;

    for (let i = 0; i < numberOfRows; i++) {
        const label = data[`row-${i}-label`] as string;
        const valueType = data[`row-${i}-valuetype`] as 'const' | 'var';
        const value = data[`row-${i}-value`] as string;
        const required = data[`row-${i}-required`] as boolean;

        rows.push({
            label,
            valueType,
            value,
            required,
        });
    }
    return rows;
}

type ControlFormProps = {
    onSubmit: (data: Row[]) => void;
    onChange: (data: Row[]) => void;
};

export function ControlForm({ onSubmit, onChange }: ControlFormProps) {
    const [rows, setRows] = useState<Row[]>([
        {
            label: 'control-id',
            valueType: 'const',
            value: '',
            required: true,
        },
    ]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<Inputs>();
    const addNewRowButton = (
        <button
            className="btn btn-neutral"
            onClick={() => {
                setRows([
                    ...rows,
                    {
                        label: 'New Row',
                        valueType: 'const',
                        value: '',
                        required: true,
                    },
                ]);
            }}
        >
            Add new row
        </button>
    );

    watch((data) => {
        const newRows = parseFormData(data);
        setRows(newRows);
        onChange(newRows);
    });

    return (
        <>
            <form
                className="flex flex-col"
                onSubmit={handleSubmit((data) => onSubmit(parseFormData(data)))}
            >
                <table>
                    <thead>
                        <tr>
                            <th>Label</th>
                            <th>Value Type</th>
                            <th>Value</th>
                            <th>Required</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        {createInput('label', index, register, row.label, errors)}
                                    </td>
                                    <td className="max-w-32">
                                        {createDropDownInput(
                                            'valuetype',
                                            index,
                                            register,
                                            row.valueType,
                                            errors
                                        )}
                                    </td>
                                    <td className="min-w-96">
                                        {createInput('value', index, register, row.value, errors)}
                                    </td>

                                    <td>
                                        {/* REQUIRED */}
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            {...register(`row-${index}-required`)}
                                            defaultChecked={row.required}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="flex flex-row justify-between">
                    {addNewRowButton}
                    <input className="btn btn-primary" type="submit" value="Create Control" />
                </div>
            </form>
        </>
    );
}
