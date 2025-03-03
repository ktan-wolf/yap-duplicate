import React, { useState } from "react"
import XSvg from "../../components/X";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/logo.jpg";


interface FormInputs {
  username: string;
  password: string;
}
function Login() {
  const [formData, setFormData] = useState<FormInputs>({
    username: "",
    password: "",
  })

  const queryClient = useQueryClient();
  const {mutate: loginMutation, isError, isPending, error} = useMutation({
    mutationFn: async ({username, password} : FormInputs) => {
      try {
        const res = await axios.post("https://yap-duplicate-1.onrender.com/api/auth/login",{
          username,
          password
        },{
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials : true
        })

        // toast.success("Account created successfully");
        //re fetch data for updating 
        queryClient.invalidateQueries({queryKey: ["authUser"]});
        return res.data;
      } catch (error) {
        console.log(error);
        
        if (axios.isAxiosError(error)) {
          const errorMsg = isAxiosError(error)? error.response?.data?.message : "Server is not responding";
          toast.error(errorMsg);
        } else {
          console.error(error);
          toast.error("An unexpected error occurred");

        }
        return;
      }
    },
  });

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
	loginMutation(formData);
  }

  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
    const {name , value} = e.target;
    setFormData(prevState =>({
      ...prevState, 
      [name]:  value
    })
  )}

  return (
      <div className='max-w-screen-xl mx-auto flex justify-center h-screen place-content-center pr-36'>
			<div className='flex-1 hidden lg:flex items-center justify-center'>
        <img className='-mr-24 -mt-20 fill-white' src={logo}/>
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? 'Loading ...' : 'Login'}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
  )
}

export default Login