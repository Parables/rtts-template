// TODO: Install @hookform/error-message
import type { FieldValuesFromFieldErrors } from '@hookform/error-message';
import type {
    DetailedHTMLProps,
    InputHTMLAttributes,
    SelectHTMLAttributes,
} from 'react';
import type {
    DeepMap,
    FieldError,
    FieldName,
    Path,
    PathValue,
    UnpackNestedValue,
    Validate,
    ValidationRule,
    ValidationValueMessage,
} from 'react-hook-form';

export interface IForm<T> {
    id: string;
    className?: string;
    submitButtonClassName?: string;
    submitButtonValue?: string;
    sections: {
        title?: string;
        className?: string;
        fields: IField<T>[];
    }[];
    defaultValues?: T;
    onSubmit: (data: UnpackNestedValue<T>) => void;
}

export interface Field<T> {
    id?: string;
    label?: string;
    /** className for the div which wraps the label and the input and the error text. use this to specify width, colspans margins etc */
    wrapperclassName?: string;
    /**specific classes to be applied to the label of the input */
    labelClassName?: string;
    /**specific classes to be applied to the input */
    className?: string;
    errorClassName?: string;
    component: 'input' | 'select' | 'textarea' | 'file';
    error: FieldName<FieldValuesFromFieldErrors<DeepMap<T, FieldError>>>;
    fieldOptions?: Partial<{
        required:
        | string
        | ValidationRule<boolean> /* { value: boolean; message: string | ReactElement } */;
        maxLength: ValidationRule<string | number>;
        minLength: ValidationRule<string | number>;
        max: ValidationValueMessage<string | number>;
        min: ValidationValueMessage<string | number>;
        pattern: ValidationRule<RegExp>;
        validate:
        | Validate<PathValue<T, Path<T>>>
        | Record<string, Validate<PathValue<T, Path<T>>>>;
        valueAsNumber: boolean;
        valueAsDate: boolean;
        setValueAs: <T>(value: any) => T;
        shouldUnregister: boolean;
    }>;
}

export interface IInputField<T>
    extends Field<T>,
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    name: Path<T>;
    // fileLabelIcon?: IconName;
}

export interface ITextAreaField<T>
    extends Field<T>,
    React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
    > {
    name: Path<T>;
}

export interface ISelectField<T>
    extends Field<T>,
    DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
    > {
    name: Path<T>;
    optionClassName?: string;
    selectOptions?: Option[] | string[];
}

export type Option = {
    id?: string;
    name?: string;
    label?: string;
    value: string;
};

export type IField<T> = IInputField<T> & ITextAreaField<T> & ISelectField<T>;

export class Form<T> implements IForm<T> {
    id!: string;
    className?: string | undefined;
    submitButtonClassName?: string | undefined;
    submitButtonValue?: string | undefined;
    sections!: {
        title?: string;
        className?: string | undefined;
        fields: IField<T>[];
    }[];
    defaultValues?: T | undefined;
    onSubmit!: (data: UnpackNestedValue<T>) => void;


    constructor(form: IForm<T>) {
        Object.assign(this, form)
    }

    printForm() {
        const output = JSON.parse(JSON.stringify(this, null, 2))
        console.log("Form output", output);
        return output
    }

    addSections(sections: IForm<T>["sections"], position: number) {
        this.sections.splice(position, 0, ...sections);
    }
    removeSections(sectionIndex: number, position: number, removeCount: number) {
        this.sections.splice(position, removeCount);
    }
    addFields(fields: IField<T>[], sectionIndex: number, position: number) {
        this.sections[sectionIndex].fields.splice(position, 0, ...fields);
    }
    removeFields(sectionIndex: number, position: number, removeCount: number) {
        this.sections[sectionIndex].fields.splice(position, removeCount);
    }
}




