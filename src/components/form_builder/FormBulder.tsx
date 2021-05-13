import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import type { IForm, Option } from '.';
import { ErrorMessage } from '@hookform/error-message';

export function FormBuilder<T>(props: IForm<T>) {
  const defaultValues = props.defaultValues
    ? { ...JSON.parse(JSON.stringify(props.defaultValues)) }
    : undefined; //deep merge
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<T>({ defaultValues: defaultValues, criteriaMode: 'all' }); // set as defaultValues for edit operation
  // useHooks
  const location = useLocation();
  const params: { id: string } = useParams();
  const isEditOperation = location.pathname.includes('/edit/') && params.id;

  // TODO: Reset Scroll Position using React Router or manually with useEffect
  // TODO: Adapt the Alert to used for Errors returned from the Server
  // TODO: Reuse this Form for Edit operations
  // TODO: Pass in the old data to the Form as the default values
  let interval: NodeJS.Timeout;
  const [alert, setAlert] = useState(false);
  useEffect(() => {
    if (interval) clearTimeout(interval);
    if (isSubmitSuccessful) setAlert(true);
    interval = setTimeout(() => {
      setAlert(false);
      reset();
    }, 5000);
  }, [isSubmitSuccessful]);

  function isStringOptions(array: unknown): array is string[] {
    return (
      Array.isArray(array) &&
      typeof array[0] === 'string' &&
      array.every((el: string | Option) => typeof el === 'string')
    );
  }

  return (
    <>
      <form id={props.id} onSubmit={handleSubmit(props.onSubmit)}>
        {/* Form Content */}
        <div className="flex flex-col w-full px-8 md:px-32">
          {/* Alert Position */}
          {alert && (
            <ul className="relative w-full px-8 py-4 text-base font-medium text-green-800 bg-green-100 rounded-md">
              <li key="sdfs">
                {isEditOperation
                  ? 'Record has been updated successfully'
                  : 'New Record has been created successfully'}
              </li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="absolute fill-current top-4 right-5"
              >
                <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
              </svg>
            </ul>
          )}
          {props.sections.map((section, i) => {
            return (
              <div
                key={`section-${i}`}
                className={`w-full grid grid-cols-1 gap-5 md:gap-10 md:grid-cols-6  ${
                  i > 0 && 'mt-20'
                } ${section.className}`}
              >
                {/* SectionTitle*/}
                {section.title && (
                  <p className="font-semibold text-gray-400 uppercase col-span-full">
                    {section.title}
                  </p>
                )}
                {/* section Fields */}
                {section.fields.map(
                  (
                    {
                      name,
                      error,
                      label,
                      component,
                      fieldOptions,
                      selectOptions,
                      /* fileLabelIcon, */ labelClassName,
                      className,
                      wrapperclassName,
                      optionClassName,
                      errorClassName,
                      ...attributes
                    },
                    index,
                  ) => {
                    return (
                      <div
                        key={`field-${index}`}
                        className={`flex flex-col col-span-full md:col-span-2 ${wrapperclassName}`}
                      >
                        <label
                          htmlFor={attributes.id}
                          className={labelClassName}
                        >
                          {' '}
                          {label}{' '}
                          {fieldOptions?.required && (
                            <span className="text-red-600">*</span>
                          )}{' '}
                        </label>
                        {component === 'input' ? (
                          <input
                            {...attributes}
                            {...register(name, { ...fieldOptions })}
                            className={className}
                          />
                        ) : component === 'textarea' ? (
                          <textarea
                            {...attributes}
                            {...register(name, { ...fieldOptions })}
                            className={className}
                          />
                        ) : component === 'select' ? (
                          <select
                            aria-multiselectable={attributes.multiple}
                            {...attributes}
                            {...register(name, {
                              required: 'This field is required',
                            })}
                            className={className}
                          >
                            <option disabled>Select One</option>
                            {selectOptions ? (
                              isStringOptions(selectOptions) ? (
                                selectOptions?.map((option, i: number) => {
                                  return (
                                    <option
                                      key={`option-${i}-${option}`}
                                      value={option}
                                      className={optionClassName}
                                    >
                                      {option}
                                    </option>
                                  );
                                })
                              ) : (
                                selectOptions?.map((option, i: number) => {
                                  return (
                                    <option
                                      key={`option-${i}-${option.value}`}
                                      value={option.value}
                                      className={optionClassName}
                                    >
                                      {option.label ||
                                        option.name ||
                                        option.value ||
                                        option.id ||
                                        `Option-${i}`}
                                    </option>
                                  );
                                })
                              )
                            ) : (
                              <option
                                disabled
                                selected={false}
                                value={undefined}
                              >
                                No Options Provided
                              </option>
                            )}
                          </select>
                        ) : component === 'file' ? (
                          <>
                            <input {...attributes} className="hidden" />
                            <label
                              htmlFor={attributes.id}
                              className="mt-2 mb-8 text-center cursor-pointer md:mb-0"
                            >
                              {label}{' '}
                              {fieldOptions?.required && (
                                <span className="text-red-600">*</span>
                              )}
                            </label>
                          </>
                        ) : (
                          <></>
                        )}
                        <ErrorMessage
                          errors={errors}
                          name={error}
                          render={({ message }) => (
                            <span
                              className={`text-sm font-medium text-red-600 ${errorClassName}`}
                            >
                              {message}
                            </span>
                          )}
                        />
                      </div>
                    );
                  },
                )}
              </div>
            );
          })}
          {/* Submit Button */}
          <input
            type="submit"
            value={props.submitButtonValue ?? 'Submit'}
            className={`btn py-4 md:py-6 md:text-lg md:mt-20 md:mb-10 col-span-full ${props.submitButtonClassName}`}
          />
        </div>
      </form>
    </>
  );
}
