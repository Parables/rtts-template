import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
// import type { IDriver as Driver, IVehicle } from '../../utils/interfaces'
import { AppContext } from '../../utils/global_states/AppContext'
import { FormBuilder, IForm,} from '../../components'

interface ISample {
  // TODO: Add this to all base interfaces
  [key: string]: unknown;

}

export function DriverFormPage({ endpoint = "https://taxi-check-engine.herokuapp.com/api" }: { endpoint: string }) {
  // useHooks
  const location = useLocation()
  const history = useHistory()
  const params: { id: string } = useParams();
  const isEditOperation = location.pathname.includes('/edit/') && params.id;
  // const { useCurrentDriverState } = useContext(AppContext);
  // const [currentDriver, setCurrentDriver] = useCurrentDriverState; // get the currentDriver from the AppContext 


  // Handle onSubmit
  function onSubmit(data: ISample) {
    console.log('Logging Data', data)
    const { vehicle_number_plate, ...driverInfo } = data
    // TODO: Modify endpoint based on isEditOperation
    // set the endpoint depending on whether it is a create or edit operation
    endpoint = isEditOperation ? `${endpoint}/driver/edit/${params.id}` : `${endpoint}/driver/create`
    console.log("endpoint", endpoint)
    isEditOperation ? axios.patch : axios.post(endpoint, driverInfo).then((d_res) => {
      // log the result of the driver operation 
      console.log("Result", d_res)
      // perform another request to get the vehicle by number plate
      //passing the plate_nummber and driverId as params
      axios.get(`${endpoint}/vehicle/getByNumberPlate/${vehicle_number_plate}`).then((v_res) => {
        // if the vehicle does not exist, redirect to vehicles/create page 
        console.log("getByNumberPlate", v_res.data)
        if (!v_res.data.data) history.push(`/vehicles/create/${v_res.data.data.plate_number}/${d_res.data.data._id}`)
      })
    }).catch((error) => {
      console.error('Bad Results', error)
      throw error
    })
  }

  const driverForm: IForm<ISample> = {
    id: "driver-form",
    // defaultValues: currentDriver ? { ...JSON.parse(JSON.stringify(currentDriver)) } : undefined, //deep merge
    onSubmit: onSubmit,
    sections: [
      // Personal Information 
      {
        title: "Personal Information",
        fields: [
          {
            id: "first_name",
            name: "first_name",
            error: "first_name",
            label: "First Name",
            component: "input",
            type: "text",
            fieldOptions: {
              required: 'This field is required'
            }
          },
          {
            id: "last_name",
            name: "last_name",
            error: "last_name",
            label: "Last Name",
            component: "input",
            type: "text",
            fieldOptions: {
              required: 'This field is required',
            }
          },
          {
            id: "other_names",
            name: "other_names",
            error: "other_names",
            label: "Other Names",
            component: "input",
            type: "text",
            fieldOptions: {
              required: 'This field is required',
            }
          },
          {
            id: "dob",
            name: "dob",
            error: "dob",
            label: "Date of Birth ( MM/DD/YYYY )",
            component: "input",
            type: "text",
            fieldOptions: {
              required: 'This field is required',
            }
          },
          {
            id: "gender",
            name: "gender",
            error: "gender",
            label: "Gender",
            component: "select",
            selectOptions: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
            fieldOptions: {
              required: 'This field is required',
            }
          },
        ]
      },
      // Identity Information 
      {
        title: "Identity Information",
        fields: [
          {
            id: "license.class",
            name: "license.class",
            error: "license.class",
            label: "License Class",
            component: "select",
            selectOptions: ["A", "B", "C", "D", "E", "F"],
            fieldOptions: {
              required: 'This field is required',
            }
          },
          {
            id: "license.number",
            name: "license.number",
            error: "license.number",
            label: "License Number",
            component: "input",
            type: "text",
            fieldOptions: {
              required: 'This field is required',
              pattern: RegExp("") 
            }
          },
          {
            id: "vehicle_number_plate",
            name: "vehicle_number_plate",
            error: "vehicle_number_plate",
            label: "Vehicle Number Plate",
            component: "input",
            type: "text",
            fieldOptions: {
              required: 'This field is required'
            }
          },
          {
            id: "identification.id_type",
            name: "identification.id_type",
            error: "identification.id_type",
            label: "ID Type",
            component: "select",
            selectOptions: ["Ghana Card", "Voter ID", "Passport", "NHIS"],
            fieldOptions: {
              required: 'This field is required',
            }
          },
          {
            id: "identification.number",
            name: "identification.number",
            error: "identification.number",
            label: "Identification Number",
            component: "input",
            type: "text",
            fieldOptions: {
              required: 'This field is required'
            }
          },
          {
            id: "tin",
            name: "tin",
            error: "tin",
            label: "TIN",
            component: "input",
            type: "text",
            fieldOptions: {
              required: 'This field is required'
            }
          },
        ]
      },
      // Contact Information 
      {
        title: "Contact Information",
        fields: [
          {
            id: "contact.phone_number",
            name: "contact.phone_number",
            error: "contact.phone_number",
            label: "Phone Number",
            component: "input",
            selectOptions: ["A", "B", "C", "D", "E", "F"],
            type: "text",
            fieldOptions: {
              required: 'This field is required',
            }
          },
          {
            id: "contact.email",
            name: "contact.email",
            error: "contact.email",
            label: "Email",
            component: "input",
            type: "text",
            fieldOptions: {
              required: 'This field is required'
            }
          },
          {
            id: "address.ghana_post",
            name: "address.ghana_post",
            error: "address.ghana_post",
            label: "Digital Address",
            component: "input",
            type: "text",
            fieldOptions: {
              required: 'This field is required'
            }
          },
          {
            id: "address.postal_address",
            name: "address.postal_address",
            error: "address.postal_address",
            label: "Postal Address",
            component: "textarea",
            wrapperclassName: "md:col-span-full",
            fieldOptions: {
              required: 'This field is required',
            }
          },
          {
            id: "address.residential_address",
            name: "address.residential_address",
            error: "address.residential_address",
            label: "Residential Address",
            component: "textarea",
            wrapperclassName: "md:col-span-full",
            fieldOptions: {
              required: 'This field is required',
            }
          },
        ]
      },
      {
        title: "Attachments",
        fields: [
          {
            id: "attachments.driverImage",
            name: "attachments.driverImage",
            error: "attachments.driverImage",
            label: "Upload Driver's Image",
            component: "file",
            // fileLabelIcon: "user",
            fieldOptions: {
              required: 'This field is required',
            }
          },
        ]
      }
    ]

  }

  return (

    <div className="flex flex-col w-full h-screen pb-20 overflow-y-auto bg-white ">
      {/* Modal Title and Back Btn */}
      <div className="px-8 md:px-32">
      </div>
      <FormBuilder {...driverForm} />
    </div>

  )
}
