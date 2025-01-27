import Button from '@ui/Button';
import { useState } from 'react';
import axios from 'axios';
import { Input } from '@ui/Input';
import { useAuth } from '../../../../context/AuthContext';
import { notify } from '@ui/Toast';

interface userDetailsI {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
interface showHintsI {
  emailHint: boolean;
  currentPasswordHint: boolean;
  newPasswordHint: boolean;
  confirmNewPasswordHint: boolean;
}
function AccountManagementMobile() {
  const [userDetails, setUserDetails] = useState<userDetailsI>({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showHint, setShowHint] = useState<showHintsI>({
    emailHint: false,
    currentPasswordHint: false,
    newPasswordHint: false,
    confirmNewPasswordHint: false,
  });
  const { auth } = useAuth();
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [isPending, setIspending] = useState<boolean>(false);
  const onInputChange = (event: React.ChangeEvent) => {
    let { name, value } = event.target as any;
    setUserDetails((prevVals) => ({ ...prevVals, [name]: value }));
  };
  let errors: any = {};
  const handleUpdateAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formValidate = validateForm();
    setErrorMsg(errors);
    if (Object.keys(formValidate).length === 0) {
      setIspending(true);
      axios
        .post(`https://staging.zuri.team/api/auth/api/auth/reset-password/change`, {
          token: auth?.token,
          oldPassword: userDetails?.currentPassword,
          newPassword: userDetails?.newPassword,
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            notify({
              message: 'Account Update Successful',
              type: 'success',
            });
            setIspending(false);
            setUserDetails((prevVals) => ({
              ...prevVals,
              email: '',
              currentPassword: '',
              newPassword: '',
              confirmNewPassword: '',
            }));
          }
        })
        .catch((error) => {
          console.log(error);
          setIspending(false);
          notify({
            message: `Error: ${error?.response?.data?.message || error?.message}`,
            type: 'error',
          });
        });
    }
  };
  const validateForm = () => {
    if (!userDetails.email) {
      errors.email = 'Email cannot be empty';
    }
    if (!userDetails.currentPassword) {
      errors.password = 'Password cannot be empty';
    }
    if (!userDetails.newPassword) {
      errors.newPassword = 'Enter new password';
    }
    if (!userDetails.confirmNewPassword) {
      errors.confirmNewPassword = 'Enter new password again';
    }
    if (userDetails.confirmNewPassword !== userDetails.newPassword) {
      errors.match = 'Password do not match';
    }
    console.log(errors);
    return errors;
  };
  return (
    <div className="sm:w-[465px] flex flex-col mt-[1rem] sm:mt-[2rem] sm:ml-[18px] gap-y-[1rem] mb-[37px]">
      <form onSubmit={handleUpdateAccount} className="flex flex-col gap-y-[2rem]">
        <div className="flex flex-col gap-y-[0.5rem]">
          <label
            htmlFor="email"
            className=" font-manropeEB text-[0.875rem] sm:text-[1rem] leading-[1.5rem] text-[#344054]"
          >
            Email
          </label>
          <div className="flex flex-col gap-y-[0.375rem]">
            <p className=" font-manropeB text-[0.875rem] leading-[1.25rem] text-[#344054]">Current Email Address</p>
            <div className="relative flex flex-row">
              <Input
                name="email"
                type="email"
                value={userDetails.email}
                onChange={onInputChange}
                placeholder="Enter email"
                className="w-full border py-[0.625rem] px-[0.875rem] pr-7 rounded-[0.5rem] font-manropeL text-[0.875rem] lg:text-[1rem] leading-[1.5rem] text-[#667085]"
              />
              <svg
                className="absolute bottom-3 right-3"
                onClick={() => setShowHint((prevVal) => ({ ...prevVal, emailHint: true }))}
                onMouseOver={() => setShowHint((prevVal) => ({ ...prevVal, emailHint: true }))}
                onMouseOut={() => setShowHint((prevVal) => ({ ...prevVal, emailHint: false }))}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2386_11946)">
                  <path
                    d="M6.06016 5.9987C6.2169 5.55314 6.52626 5.17744 6.93347 4.93812C7.34067 4.6988 7.81943 4.61132 8.28495 4.69117C8.75047 4.77102 9.17271 5.01305 9.47688 5.37438C9.78106 5.73572 9.94753 6.19305 9.94683 6.66536C9.94683 7.9987 7.94683 8.66536 7.94683 8.66536M8.00016 11.332H8.00683M14.6668 7.9987C14.6668 11.6806 11.6821 14.6654 8.00016 14.6654C4.31826 14.6654 1.3335 11.6806 1.3335 7.9987C1.3335 4.3168 4.31826 1.33203 8.00016 1.33203C11.6821 1.33203 14.6668 4.3168 14.6668 7.9987Z"
                    stroke="#98A2B3"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2386_11946">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p
                className={`${
                  showHint.emailHint
                    ? 'absolute -bottom-5 right-0 text-[9px] text-[#667085] p-2 font-manropeL'
                    : 'hidden'
                }`}
              >
                Enter email address
              </p>
            </div>
            <p className="text-red-300 text-xs">{errorMsg?.email && errorMsg.email}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-[0.9rem]">
          <label htmlFor="currentPassword" className=" font-manropeEB text-[0.875rem] leading-[1.5rem] text-[#344054]">
            Change Password
          </label>
          <div className="flex flex-col gap-y-[0.375rem]">
            <p className=" font-manropeB text-[0.875rem] leading-[1.25rem] text-[#344054]">Current Passowrd</p>
            <div className="relative flex flex-row">
              <Input
                name="currentPassword"
                type="password"
                value={userDetails.currentPassword}
                onChange={onInputChange}
                minLength={5}
                maxLength={18}
                placeholder="Enter password"
                className="w-full border py-[0.625rem] px-[0.875rem] pr-7 rounded-[0.5rem] font-manropeL text-[0.875rem] lg:text-[1rem] leading-[1.5rem] text-[#667085]"
              />
              <svg
                className="absolute bottom-3 right-3"
                onClick={() => setShowHint((prevVal) => ({ ...prevVal, currentPasswordHint: true }))}
                onMouseOver={() => setShowHint((prevVal) => ({ ...prevVal, currentPasswordHint: true }))}
                onMouseOut={() => setShowHint((prevVal) => ({ ...prevVal, currentPasswordHint: false }))}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2386_11946)">
                  <path
                    d="M6.06016 5.9987C6.2169 5.55314 6.52626 5.17744 6.93347 4.93812C7.34067 4.6988 7.81943 4.61132 8.28495 4.69117C8.75047 4.77102 9.17271 5.01305 9.47688 5.37438C9.78106 5.73572 9.94753 6.19305 9.94683 6.66536C9.94683 7.9987 7.94683 8.66536 7.94683 8.66536M8.00016 11.332H8.00683M14.6668 7.9987C14.6668 11.6806 11.6821 14.6654 8.00016 14.6654C4.31826 14.6654 1.3335 11.6806 1.3335 7.9987C1.3335 4.3168 4.31826 1.33203 8.00016 1.33203C11.6821 1.33203 14.6668 4.3168 14.6668 7.9987Z"
                    stroke="#98A2B3"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2386_11946">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p
                className={`${
                  showHint.currentPasswordHint
                    ? 'absolute -bottom-5 right-0 text-[9px] text-[#667085] p-2 font-manropeL'
                    : 'hidden'
                }`}
              >
                Enter your current password
              </p>
            </div>
            <p className="text-red-300 text-xs">{errorMsg?.password && errorMsg.password}</p>
          </div>
          <div className="flex flex-col gap-y-[0.375rem]">
            <label htmlFor="newPassword" className=" font-manropeB text-[0.875rem] leading-[1.25rem] text-[#344054]">
              New Password
            </label>
            <div className="relative flex flex-row">
              <Input
                name="newPassword"
                type="password"
                value={userDetails.newPassword}
                onChange={onInputChange}
                minLength={5}
                maxLength={18}
                placeholder="Enter new password"
                className="w-full border py-[0.625rem] px-[0.875rem] pr-7 rounded-[0.5rem] font-manropeL text-[0.875rem] lg:text-[1rem] leading-[1.5rem] text-[#667085]"
              />
              <svg
                className="absolute bottom-3 right-3"
                onClick={() => setShowHint((prevVal) => ({ ...prevVal, newPasswordHint: true }))}
                onMouseOver={() => setShowHint((prevVal) => ({ ...prevVal, newPasswordHint: true }))}
                onMouseOut={() => setShowHint((prevVal) => ({ ...prevVal, newPasswordHint: false }))}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2386_11946)">
                  <path
                    d="M6.06016 5.9987C6.2169 5.55314 6.52626 5.17744 6.93347 4.93812C7.34067 4.6988 7.81943 4.61132 8.28495 4.69117C8.75047 4.77102 9.17271 5.01305 9.47688 5.37438C9.78106 5.73572 9.94753 6.19305 9.94683 6.66536C9.94683 7.9987 7.94683 8.66536 7.94683 8.66536M8.00016 11.332H8.00683M14.6668 7.9987C14.6668 11.6806 11.6821 14.6654 8.00016 14.6654C4.31826 14.6654 1.3335 11.6806 1.3335 7.9987C1.3335 4.3168 4.31826 1.33203 8.00016 1.33203C11.6821 1.33203 14.6668 4.3168 14.6668 7.9987Z"
                    stroke="#98A2B3"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2386_11946">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p
                className={`${
                  showHint.newPasswordHint
                    ? 'absolute -bottom-5 right-0 text-[9px] text-[#667085] p-2 font-manropeL'
                    : 'hidden'
                }`}
              >
                Enter your new password. Minimum of 5 characters
              </p>
            </div>
            <p className="text-red-300 text-xs">{errorMsg?.newPassword && errorMsg.newPassword}</p>
          </div>
          <div className="flex flex-col gap-y-[0.375rem]">
            <p className=" font-manropeB text-[0.875rem] leading-[1.25rem] text-[#344054]">Confirm New Password</p>
            <div className="relative flex flex-row">
              <Input
                name="confirmNewPassword"
                type="password"
                value={userDetails.confirmNewPassword}
                onChange={onInputChange}
                minLength={5}
                maxLength={18}
                placeholder="Enter new password"
                className="w-full border py-[0.625rem] px-[0.875rem] pr-7 rounded-[0.5rem] font-manropeL text-[0.875rem] lg:text-[1rem] leading-[1.5rem] text-[#667085]"
              />
              <svg
                className="absolute bottom-3 right-3"
                onClick={() => setShowHint((prevVal) => ({ ...prevVal, confirmNewPasswordHint: true }))}
                onMouseOver={() => setShowHint((prevVal) => ({ ...prevVal, confirmNewPasswordHint: true }))}
                onMouseOut={() => setShowHint((prevVal) => ({ ...prevVal, confirmNewPasswordHint: false }))}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2386_11946)">
                  <path
                    d="M6.06016 5.9987C6.2169 5.55314 6.52626 5.17744 6.93347 4.93812C7.34067 4.6988 7.81943 4.61132 8.28495 4.69117C8.75047 4.77102 9.17271 5.01305 9.47688 5.37438C9.78106 5.73572 9.94753 6.19305 9.94683 6.66536C9.94683 7.9987 7.94683 8.66536 7.94683 8.66536M8.00016 11.332H8.00683M14.6668 7.9987C14.6668 11.6806 11.6821 14.6654 8.00016 14.6654C4.31826 14.6654 1.3335 11.6806 1.3335 7.9987C1.3335 4.3168 4.31826 1.33203 8.00016 1.33203C11.6821 1.33203 14.6668 4.3168 14.6668 7.9987Z"
                    stroke="#98A2B3"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2386_11946">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p
                className={`${
                  showHint.confirmNewPasswordHint
                    ? 'absolute -bottom-5 right-0 text-[9px] text-[#667085] p-2 font-manropeL'
                    : 'hidden'
                }`}
              >
                Enter new password again. Must match new password
              </p>
            </div>
            <p className="text-red-300 text-xs">
              {errorMsg?.confirmNewPassword ? errorMsg.confirmNewPassword : errorMsg?.match && errorMsg.match}
            </p>
          </div>
        </div>
        <Button
          disabled={isPending}
          type="submit"
          size="lg"
          intent="primary"
          className="sm:w-fit w-full rounded-[0.5rem] py-[0.5rem] px-[1.25rem] mt-[1rem]"
        >
          Confirm Changes
        </Button>
      </form>
    </div>
  );
}

export default AccountManagementMobile;
