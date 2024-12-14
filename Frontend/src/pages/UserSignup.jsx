import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {UserDataContext} from '../context/UserContext';

const UserSignup = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const {user , setUser} = useContext(UserDataContext);

  const submitHandler= async (e)=>{
    e.preventDefault();
    
    const newUser = {
      fullname:{
        firstname:firstName,
        lastname:lastName
      },
      email:email,
      password:password
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser)
    
    if(response.status === 201){
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token',data.token)
      navigate('/home')
    }

    // console.log(userData);
    // console.log('hello');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div>
      <div className=' h-screen flex flex-col justify-between'>
      <div>
      <Link to='/'>
        <img className='w-28 mb-10' src="https://cdn-assets-us.frontify.com/s3/frontify-enterprise-files-us/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8yN1wvYXNzZXRzXC9lZFwvNTUwOVwvNmNmOGVmM2YzMjFkMTA3YThmZGVjNjY1NjJlMmVmMzctMTYyMDM3Nzc0OC5haSJ9:postmates:9KZWqmYNXpeGs6pQy4UCsx5EL3qq29lhFS6e4ZVfQrs?width=2400" alt="" />
      </Link>
        <div className='px-6'>

        <form 
          onSubmit={(e)=>{
            submitHandler(e)
          }}>
          <h3 className='text-lg font-medium mb-2'>What's your name</h3>
          <div className='flex gap-4 mb-5'>          
            <input className='bg-[#eeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              type="text"
              placeholder='First name'
              value={firstName}
              onChange={(e)=>{
                setFirstName(e.target.value);
              }}
              required/>
            <input className='bg-[#eeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              type="text"
              placeholder='Last name'
              value={lastName}
              onChange={(e)=>{
                setLastName(e.target.value)
              }}
              required/>
          </div>

          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input className='bg-[#eeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
          type="email"
          value={email}
          onChange={(e)=>{
            setEmail(e.target.value);
          }}
          placeholder='email@example.com'
          required/>

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
           className='bg-[#eeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
           type="password"
           value={password}
           onChange={(e)=>{
             setPassword(e.target.value);
            }}
            placeholder='Password' 
           required
          />
          <button className='bg-black flex text-center font-bold w-full items-center justify-center text-[#eeee] mb-5 rounded px-4 py-2 text-lg'>
            Create account
          </button>
        </form>
        <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
      </div>
      </div>
      <p className='text-[10px] leading-3 p-3'>privacy & policy Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum assumenda fugiat laboriosam deserunt dicta eius doloribus aliquid id cum repudiandae suscipit officia ! Aperiam deleniti facilis rerum cupiditate quae excepturi labore?</p>
    </div>
    </div>
  )
}

export default UserSignup