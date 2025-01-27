import Button from '@ui/Button';
import React, { useState, useRef, useEffect } from 'react';
import Modal from '@ui/Modal';
import DynamicInput from '../about/dynamic-input';
import axios from 'axios';
import { toast } from 'react-toastify';

interface formData {
  referer: string;
  company: string;
  position: string;
  email: string;
  phoneNumber: string;
  userId: string;
  sectionid: number;
}
interface fetchedArrData {
  referer: string;
  company: string;
  email: string;
  id: number;
  phone_number: string;
  position: string;
}

interface Errors {
  referer?: string;
  company?: string;
  email?: string;
  phone?: string;
}

type referenceModalProps = {
  onCloseModal: () => void;
  onSaveModal: () => void;
  isOpen: boolean;
  userId: string;
};
interface Reference {
  referer: string;
  company: string;
  email: string;
  position: string;
  phone_number: string;
  id: number;
}
interface EditFormData {
  referer?: string;
  company?: string;
  email?: string;
  phone_number?: string;
  position?: string;
}

const API_BASE_URL = 'https://hng6-r5y3.onrender.com';

const PortfolioReference: React.FC<referenceModalProps> = ({ isOpen, onCloseModal, onSaveModal, userId }) => {
  const initialFormData: formData = {
    referer: '',
    company: '',
    position: '',
    email: '',
    phoneNumber: '',
    userId: userId,
    sectionid: 25,
  };

  const [formData, setFormData] = useState<formData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [arrData, setArrData] = useState<fetchedArrData[] | any>([]);
  const [editArrData, setEditArrData] = useState<fetchedArrData[] | any>([]);
  const [isData, setIsData] = useState(false);
  const [isEditData, setIsEditData] = useState(false);
  const [refId, setRefId] = useState(Number);

  function validatePhoneNumber(phoneNumber: string): boolean {
    return /^[0-9]{8,11}$/.test(phoneNumber);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // If the changed input is the phone number field, validate it
    if (name === 'phoneNumber') {
      // Check if the value contains non-numeric characters
      if (value.match(/[^0-9]/)) {
        // If non-numeric characters are present, prevent the change
        event.preventDefault();
        return;
      }

      // Clear the phone number error when it's valid
      setErrors({ ...errors, phone: '' });
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateAllFieldsNotEmpty = () => {
    let hasEmptyField = false;
    const fieldsToValidate = ['referer', 'email', 'company'];

    Object.entries(formData).forEach(([inputName, inputValue]) => {
      // Check if inputName is one of the fields to validate
      if (fieldsToValidate.includes(inputName)) {
        if (!inputValue.trim()) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [inputName]: `${inputName} is required`.charAt(0).toUpperCase() + `${inputName} is required`.slice(1),
          }));
          hasEmptyField = true;
        } else if (inputName === 'email' && !isValidEmail(inputValue)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [inputName]: 'Invalid email format'.charAt(0).toUpperCase() + 'Invalid email format'.slice(1),
          }));
          hasEmptyField = true;
        }
      }
    });

    console.log(hasEmptyField);
    return !hasEmptyField;
  };

  // Function to validate email format
  const isValidEmail = (email: string) => {
    // Regular expression pattern for a typical email address format
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
  };

  function handleSubmit() {
    if (!validateAllFieldsNotEmpty()) {
      // Handle case when fields are not all filled in
      validateAllFieldsNotEmpty();
    } else {
      setErrors({ ...errors, referer: '', email: '', company: '' });
      if (formData.phoneNumber !== '' && !validatePhoneNumber(formData.phoneNumber)) {
        // Handle case when the phone number is invalid
        setErrors({ ...errors, phone: 'Invalid phone number' });
      } else {
        if (!loading) {
          setErrors({ ...errors, phone: '' });
          if (isEditData) {
            handleEdit(refId);
          } else {
            response();
          }
        }
      }
    }
  }

  useEffect(() => {
    const callGet = () => {
      setIsData(false);
      const response = async () => {
        const axiosConfig = {
          method: 'get',
          url: `${API_BASE_URL}/api/references/${userId}`,
        };

        const response = await axios(axiosConfig);

        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // console.log(response.data.data);
        const fetchedArrData = response.data.data;

        setArrData((prevArray: fetchedArrData[]) => [...fetchedArrData]);
        // onSaveModal();
        setIsData(true);
      };
      response();
    };
    callGet();
  }, [userId]);

  const response = async () => {
    setLoading(true);
    console.log(formData);
    const correctData = {
      ...formData,
      phoneNumber: `0${formData.phoneNumber}`,
    };
    try {
      const axiosConfig = {
        method: 'post',
        url: `${API_BASE_URL}/api/references/${userId}`,
        data: correctData,
      };

      const response = await axios(axiosConfig);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setLoading(false);
      toast.success(`${response.data.message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      console.log(response.data);
      setEditing(false);
      callGet();
    } catch (error) {
      if (error instanceof Error) {
        console.error('An error occurred:', error);
        toast.error(`${error.message}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        setLoading(false);
      }
    }
  };

  const callGet = () => {
    setIsData(false);
    const response = async () => {
      const axiosConfig = {
        method: 'get',
        url: `${API_BASE_URL}/api/references/${userId}`,
      };

      const response = await axios(axiosConfig);

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // console.log(response.data.data);
      const fetchedArrData = response.data.data;

      setArrData((prevArray: fetchedArrData[]) => [...fetchedArrData]);
      // onSaveModal();
      setIsData(true);
    };
    response();
  };
  // console.log(arrData)
  const handleDelete = (id: number) => {
    setIsData(false);
    const response = async () => {
      const axiosConfig = {
        method: 'delete',
        url: `${API_BASE_URL}/api/references/${id}`,
      };

      const response = await axios(axiosConfig);

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response.data);
      setIsData(true);
      callGet();
    };
    response();
  };
  const handleEdit = (id: number) => {
    const editObjData: EditFormData = {
      referer: formData.referer,
      company: formData.company,
      position: formData.position,
      email: formData.email,
      phone_number: `0${formData.phoneNumber}`,
    };
    // console.log('Edited Data: ' + editObjData);
    const response = async () => {
      setLoading(true);
      console.log(formData);
      try {
        const axiosConfig = {
          method: 'put',
          url: `${API_BASE_URL}/api/references/${id}`,
          data: editObjData,
        };

        const response = await axios(axiosConfig);

        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setLoading(false);
        toast.success(`${response.data.message}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        console.log(response.data);
        setEditing(false);
        callGet();
      } catch (error) {
        if (error instanceof Error) {
          console.error('An error occurred:', error);
          toast.error(`${error.message}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
          setLoading(false);
        }
      }
    };
    response();
  };
  const editData = (id: number) => {
    arrData.forEach((data: any) => {
      if (id === data.id) {
        setIsEditData(true);
        setFormData({
          ...formData,
          referer: data.referer,
          email: data.email,
          phoneNumber: data.phone_number.slice(1),
          company: data.company,
          position: data.position,
        });
      }
    });
  };

  return (
    <Modal isOpen={isOpen} closeModal={onCloseModal} size="lg" isCloseIconPresent={false}>
      <div className="mx-auto bg-white-100 rounded-md p-3 py-5">
        <div className="flex justify-between items-center border-b-[3.6px]  border-brand-green-primary pb-1">
          <div className="flex gap-4 items-center">
            <div
              onClick={() => {
                editing ? setEditing(false) : onCloseModal();
              }}
              className="cursor-pointer hover:bg-brand-green-shade95 p-3 rounded-full"
            >
              <svg width="9" height="18" viewBox="0 0 9 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.99984 16.9201L1.47984 10.4001C0.709844 9.63008 0.709844 8.37008 1.47984 7.60008L7.99984 1.08008"
                  stroke="#464646"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span className="font-semibold text-lg">References</span>
          </div>
          <div
            className="flex item-center justify-center rounded-lg w-6 h-6 bg-brand-green-primary text-white-100 font-semibold cursor-pointer"
            onClick={onCloseModal}
          >
            x
          </div>
        </div>
        {editing ? (
          <form
            onSubmit={handleSubmit}
            className="p-4 mt-10 border-[.4px] flex transition-all flex-col gap-2 rounded-lg border-brand-disabled"
          >
            <div className="flex flex-col gap-2">
              <DynamicInput
                onChange={handleInputChange}
                type="text"
                placeholder="Let’s meet your referee"
                InputId="ptfl-fullname"
                name="referer"
                label="Name*"
                labelFor="referer"
                value={formData.referer}
                required={true}
                error={errors.referer}
              />
              <div className="w-full flex flex-col md:flex-row gap-2 justify-between">
                <div className="w-full md:w-[47%]">
                  <DynamicInput
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Google"
                    InputId="ptfl-company"
                    name="company"
                    label="Company*"
                    labelFor="company"
                    value={formData.company}
                    required={true}
                    error={errors.company}
                  />
                </div>
                <div className="w-full md:w-[47%]">
                  <DynamicInput
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Product Manager"
                    InputId="ptfl-position"
                    name="position"
                    label="Position"
                    labelFor="position"
                    value={formData.position}
                    required={false}
                  />
                </div>
              </div>
              <DynamicInput
                onChange={handleInputChange}
                type="email"
                placeholder="example@gmail.com"
                InputId="ptfl-email"
                name="email"
                label="Email*"
                labelFor="email"
                value={formData.email}
                required={true}
                error={errors.email}
              />
              <DynamicInput
                onChange={handleInputChange}
                type="text"
                placeholder=""
                InputId="ptfl-phone"
                name="phoneNumber"
                label="Phone Number"
                labelFor="phoneNumber"
                value={formData.phoneNumber}
                error={errors.phone}
                required={false}
                leftIcon={<span>+234</span>}
                pattern={'[0-9]{3}-[0-9]{2}-[0-9]{3}'}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                intent={'secondary'}
                size={'sm'}
                className="w-24 rounded-2xl"
                type="button"
                onClick={onCloseModal}
              >
                Close
              </Button>
              <Button intent={'primary'} size={'sm'} className="w-24 rounded-2xl" type="button" onClick={handleSubmit}>
                {loading ? (
                  <div className="block w-5 h-5">
                    <svg
                      aria-hidden="true"
                      className="text-brand-green-hover animate-spin fill-white-100"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                ) : (
                  `Save`
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="md:pe-4 mt-5 ">
            {isData ? (
              <div className="mb-10  flex flex-col gap-2">
                {arrData.map((reference: Reference) => (
                  <div className="card md:ms-4 bg-gray-50 p-2 rounded-md" key={reference.id}>
                    <div className="text-base font-semibold text-dark-800 flex gap-3 capitalize">
                      Name
                      <p className="text-base font-normal capitalize">{reference.referer}</p>
                    </div>
                    <div className="text-base font-semibold text-dark-800 flex gap-3">
                      Company
                      <p className="text-base font-normal">{reference.company}</p>
                    </div>
                    <div className="text-base font-semibold text-dark-800 flex gap-3">
                      Email
                      <p className="text-base font-normal">{reference.email}</p>
                    </div>
                    <div
                      className={`${
                        reference.position === '' ? 'hidden' : 'block'
                      } text-base font-semibold text-dark-800 flex gap-3`}
                    >
                      Position
                      <p className={`text-base font-normal capitalize`}>{reference.position}</p>
                    </div>
                    <div
                      className={`text-base font-semibold text-dark-800 flex gap-3 ${
                        reference.phone_number === '' ? 'hidden' : 'block'
                      }`}
                    >
                      Phone
                      <p className={`text-base font-normal`}>+234 {reference.phone_number.slice(1)}</p>
                    </div>

                    <div>
                      <div className="flex gap-3 justify-end px-2 mt-2 font-medium">
                        <p
                          onClick={() => {
                            setEditing(true);
                            editData(reference.id);
                            setIsEditData(true);
                            setRefId(reference.id);
                          }}
                          className="text-blue-300 cursor-pointer"
                        >
                          Edit
                        </p>
                        <p
                          className={`text-brand-red-primary cursor-pointer`}
                          onClick={() => {
                            handleDelete(reference.id);
                          }}
                        >
                          Delete
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="block w-[10%] mx-auto my-32">
                <svg
                  aria-hidden="true"
                  className="text-brand-green-hover animate-spin fill-white-100"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            )}
            <div className="w-full flex justify-between items-center">
              <div
                onClick={() => {
                  setEditing(true);
                  setFormData(initialFormData);
                  setIsEditData(false);
                }}
                className="text-[1.05rem] text-brand-green-primary font-normal px-3 transition cursor-pointer py-1 rounded-full hover:bg-brand-green-primary hover:text-white-100"
              >
                + Add <span className="hidden md:inline">reference</span>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  intent={'secondary'}
                  size={'sm'}
                  className="md:w-24 rounded-2xl"
                  type="button"
                  onClick={onCloseModal}
                >
                  Close
                </Button>
                <Button
                  intent={'primary'}
                  size={'sm'}
                  className="md:w-24 rounded-2xl"
                  type="button"
                  onClick={onSaveModal}
                >
                  {loading ? (
                    <div className="block w-5 h-5">
                      <svg
                        aria-hidden="true"
                        className="text-brand-green-hover animate-spin fill-white-100"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  ) : (
                    `Save`
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PortfolioReference;
