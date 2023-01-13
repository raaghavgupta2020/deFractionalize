import React from 'react'
import { Link } from 'react-router-dom'

function Login() {
    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <h1 className='text-3xl pt-4 font-bold'>Welcome</h1>
            </div>
            <div className="flex items-center justify-center h-screen">

                <button className="bg-blue-500 w-60 h-60 text-2xl hover:bg-blue-700 text-white mx-5 font-bold py-2 px-4 rounded">

                    <Link to="/loginuser">
                        User

                    </Link>
                </button>
                <Link to="/logindesigner">
                    <button className="bg-blue-500 h-60	w-60  text-2xl  hover:bg-blue-700 text-white mx-5 font-bold py-2 px-4 rounded">
                        Designer
                    </button>
                </Link>
            </div>
        </>
    )
}

export default Login