import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import './ControlForm.css';
import { useState } from 'react';
import { Property } from './json-schema-builder.js';

type Inputs = {
    [key: string]: unknown;
};

const numberOfFields = 5;

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
                className="input input-primary input-sm"
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
    values: string[],
    defaultValue: string,
    errors: FieldErrors<Inputs>
) {
    return (
        <div className="w-full">
            <select
                className="select select-primary select-sm w-full"
                {...register(`row-${index}-${fieldName}`, { required: false })}
                defaultValue={defaultValue}
            >
                {values.map((value, index) => (
                    <option key={index} value={value}>
                        {value}
                    </option>
                ))}
            </select>
            {errors[`row-${index}-${fieldName}`] && <span>This field is required</span>}
        </div>
    );
}

function parseFormData(data: Inputs): Property[] {
    const rows: Property[] = [];
    const numberOfRows = Object.keys(data).length / numberOfFields;

    for (let i = 0; i < numberOfRows; i++) {
        const label = data[`row-${i}-label`] as string;
        const variability = data[`row-${i}-variability`] as 'const' | 'variable';
        const value = data[`row-${i}-value`] as string;
        const valueType = data[`row-${i}-valueType`] as
            | 'boolean'
            | 'string'
            | 'number'
            | 'object'
            | 'array';
        const required = data[`row-${i}-required`] as boolean;

        rows.push({
            label,
            variability,
            valueType,
            value,
            required,
        });
    }
    return rows;
}

type ControlFormProps = {
    onSubmit: (data: Property[]) => void;
    onChange: (data: Property[]) => void;
};

export function ControlForm({ onSubmit, onChange }: ControlFormProps) {
    const [properties, setProperties] = useState<Property[]>([
        {
            label: 'control-property-1',
            variability: 'const',
            valueType: 'string',
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
            className="btn btn-neutral btn-sm"
            onClick={() => {
                setProperties([
                    ...properties,
                    {
                        label: `control-property-${properties.length + 1}`,
                        variability: 'const',
                        valueType: 'string',
                        value: '',
                        required: true,
                    },
                ]);
            }}
        >
            Add new property
        </button>
    );

    watch((data) => {
        const newRows = parseFormData(data);
        setProperties(newRows);
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
                            <th>Variability</th>
                            <th>Value Type</th>
                            <th>Value</th>
                            <th>Required</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((row, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        {createInput('label', index, register, row.label, errors)}
                                    </td>
                                    <td className="max-w-32">
                                        {createDropDownInput(
                                            'variability',
                                            index,
                                            register,
                                            ['const', 'variable'],
                                            row.variability,
                                            errors
                                        )}
                                    </td>
                                    <td>
                                        {createDropDownInput(
                                            'valueType',
                                            index,
                                            register,
                                            ['string', 'boolean', 'number', 'object', 'array'],
                                            row.valueType,
                                            errors
                                        )}
                                    </td>
                                    <td className="min-w-96">
                                        {row.variability === 'const'
                                            ? createInput(
                                                  'value',
                                                  index,
                                                  register,
                                                  row.value,
                                                  errors
                                              )
                                            : createDropDownInput(
                                                  'value',
                                                  index,
                                                  register,
                                                  ['string', 'boolean', 'number'],
                                                  'string',
                                                  errors
                                              )}
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
                    <input
                        className="btn btn-primary btn-sm"
                        type="submit"
                        value="Create Control"
                    />
                </div>
            </form>
        </>
    );
}
