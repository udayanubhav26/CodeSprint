import { useForm } from "react-hook-form" 
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { loginUser } from '../authSlice.js'

//Schema Validation for sign up form 

const signupSchema = z.object({
    emailId: z.string().email(),
    password:z.string().min(8, "Password should be at least 8 digits Long!")
})

function Login(){

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { isAuthenticated, loading, error } = useSelector((state)=> state.auth);

    const {register, handleSubmit, formState: { errors },} = useForm({resolver:zodResolver(signupSchema)});

    const submittedData = (data) => {
        dispatch(loginUser(data));   
    }

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/');
        }
    }, [isAuthenticated, navigate]);



    return(
        <div className="min-h-screen w-full flex justify-center items-center bg-base-200">
          <form onSubmit={handleSubmit(submittedData)} className="bg-base-100 shadow-2xl rounded-xl p-8 w-full max-w-md flex flex-col gap-6">

            <h1 className="text-3xl font-bold text-center mb-2">CodeSprint</h1>

            <div>
                <input className="input input-bordered w-full" {...register("emailId")} placeholder="anubhav@gmail.com"/>
                {errors.emailId && (<span className="text-red-500 text-sm">{errors.emailId.message}</span>)}
            </div>

            <div className="relative">
                <input type={showPassword ? "text" : "password"} className="input input-bordered w-full" {...register("password")} placeholder="********"/>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >

                {showPassword ? (

                // Eye Off Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18M10.477 10.489A3 3 0 0012 15a3 3 0 002.516-1.363M9.88 4.697A10.97 10.97 0 0112 4.5c5.523 0 10 4.477 10 7.5 0 1.657-1.343 3.182-3.515 4.365M6.228 6.228C3.64 7.743 2 9.757 2 12c0 1.136.42 2.215 1.172 3.182"
                />
                </svg>

                ) : (

               // Eye Icon
               <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
               >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12 18 19.5 12 19.5 2.25 12 2.25 12z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                />
               </svg>
           
               )}

               </button>

            {errors.password && (
                <span className="text-red-500 text-sm">
                {errors.password.message}
                </span>
            )}

</div>
            
            <button type='submit' className="btn btn-primary w-full  bg-purple-600 border border-purple-700">Login</button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <span onClick={() => navigate('/signup')} className="text-primary cursor-pointer hover:underline">
               Sign Up
              </span>
            </p>
    
         
          </form>
        </div>
    )
}

export default Login;

