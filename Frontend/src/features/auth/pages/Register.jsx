import React from 'react'
import { NavLink } from 'react-router-dom'

const Register = () => {
    const handleSubmite = (e) => {
        e.preventDefault();
    }   
    return (
        <main className='form-container bg-gray-700 min-h-screen flex items-center justify-center'>
            <div className='text-white   shadow-lg   p-[10vw]  flex flex-col gap-4'>


                <h1 className='text-4xl font-bold text-gray-100'>
                    Regsiter
                </h1>
                <form className=' flex flex-col gap-4'>

                   
                    <div className='input-grp flex gap-2 flex-col text-xl '>
                        <label htmlFor="username">Username :</label>
                        <input type="text" name='username' id='username' className='outline-none   p-2 rounded-2xl   border-2' placeholder='Enter your username' />
                    </div>
                    <div className='input-grp flex gap-2 flex-col text-xl '>
                        <label htmlFor="email">Email :</label>
                        <input type="text" name='email' id='email' className='outline-none   p-2 rounded-2xl   border-2' placeholder='Enter your email' />
                    </div>

                    <div className='input-grp flex gap-2 flex-col text-xl '>
                        <label htmlFor="password">Password :</label>
                        <input type="password" name='password' id='password' className='outline-none   p-2 rounded-2xl   border-2' placeholder='Enter your password' />
                    </div>


                    <button onClick={handleSubmite} className='w-full bg-gray-900  text-white p-2 rounded-2xl hover:bg-blue-600' type='submit'>register</button>

                </form>

                <div> 
                    Already have an account? 
                    <NavLink to="/login" className='text-blue-600 hover:text-gray-100'>Login</NavLink>
                </div>
            </div>

        </main>
    )
}

export default Register
