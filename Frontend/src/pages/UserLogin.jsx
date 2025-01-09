import React, { useState , useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});

  const {user,setUser}= useContext(UserDataContext);

  const navigate = useNavigate()

  const submitHandler= async (e)=>{
    e.preventDefault();
    // console.log(email,password);
    const userData ={
      email:email,
      password:password
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/login`,userData);

    if(response.status === 200){
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token',data.token)
      navigate('/home')
    };
    // console.log(userData);
    // console.log('hello');
    setEmail('');
    setPassword('');
  };

  return (
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
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
          className='bg-[#eeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
          type="email"
          value={email}
          onChange={(e)=>{
            setEmail(e.target.value);
          }}
          placeholder='email@example.com'
          required
         />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
           className='bg-[#eeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
           type="password"
           value={password}
           onChange={(e)=>{
             setPassword(e.target.value);
            }}
            placeholder='Password' 
           required
          />
          <button className='bg-black flex text-center font-bold w-full items-center justify-center text-[#eeee] mb-7 rounded px-4 py-2 text-lg'>
            Login
          </button>
        </form>
        <p className='text-center'>New here ? <Link to='/signup' className='text-blue-600'>Create new account</Link></p>
      </div>
      </div>
      <div className='px-6 '>
        <Link 
        to= '/captain-login'
        className='bg-[#429e17ee] flex justify-center items-center text-white font-semibold mb-7 rounded w-full px-4 py-2 text-lg'>
          Sign in as captain
        </Link>
      </div>
    </div>
    
  )
}

export default UserLogin