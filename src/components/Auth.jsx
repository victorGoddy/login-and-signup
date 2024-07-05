import React, { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { db } from '../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import './AuthForms.css';
import MobileMenu from "./MobileMenu"

const AuthForms = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [activeForm, setActiveForm] = useState('');
    const { firstName, lastName, email, password } = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const login = () => {
        setActiveForm('login');
    };

    const register = () => {
        setActiveForm('register');
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {
                displayName: firstName,
            });

            const user = userCredential.user;

            await sendEmailVerification(user);
            toast.success('Verification email sent!');

            const formDataCopy = { ...formData };
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, 'users', user.uid), formDataCopy);

            toast.success('Sign up was successful!');
            navigate('/');
        } catch (error) {
            toast.error('Something went wrong with the registration');
        }
    };

    return (
        <div>
            <nav className="flex gap-5 md-down:gap-3 md-down:mx-5 items-center justify-between max-w-[1200px] mx-auto mt-5">
                <div className="nav-logo md-down:text-sm">
                    <p>LOGO</p>
                </div>
                <div className="nav-menu md-down:hidden">
                    <ul>
                        <li><a href="/home" className="link active">Home</a></li>
                        <li><a href="/blog" className="link">Blog</a></li>
                        <li><a href="/services" className="link">Services</a></li>
                        <li><a href="/about" className="link">About</a></li>
                    </ul>
                </div>
                <div className="nav-button flex items-center gap-3 md-down:gap-1">
                    <button className=" bg-white px-8 py-2 rounded-full text-black md-down:px-2 md-down:py-1" onClick={login}>Sign In</button>
                    <button className="bg-white px-8 py-2 rounded-full text-black md-down:px-2 md-down:py-1" onClick={register}>Sign Up</button>
                </div>
                <MobileMenu />
            </nav>

            <div className="form-box md-down:!max-w-[100%] md-down:mx-auto">
                {/* Login Form */}
                <div className={`Login-container md-down:max-w-[100%] md-down:mx-auto ${activeForm === 'login' ? 'slide-in-left' : ''}`}>
                    <div className="top">
                        <span>
                            Have an Account? <a href="#" onClick={login}>Login</a>
                        </span>
                        <header>Login</header>
                    </div>
                    <form onSubmit={onSubmit} className='mx-5'>
                        <div className="input-details">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={onChange}
                                placeholder="Email address"
                                className="input-field"
                            />
                            <i className="bx bx-user"></i>
                        </div>
                        <div className="input-details">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={onChange}
                                placeholder="Password"
                                className="input-field"
                            />
                            <i className="bx bx-lock-alt"></i>
                            {showPassword ? (
                                <AiFillEyeInvisible
                                    className="password-toggle"
                                    onClick={() => setShowPassword((prevState) => !prevState)}
                                />
                            ) : (
                                <AiFillEye
                                    className="password-toggle"
                                    onClick={() => setShowPassword((prevState) => !prevState)}
                                />
                            )}
                        </div>
                        <div className="input-details">
                            <input type="submit" className="submit" value="Sign In" />
                        </div>
                        <div className="two-class">
                            <div className="part-one">
                                <input type="checkbox" id="login-check" />
                                <label htmlFor="login-check">Remember Me</label>
                            </div>
                            <div className="part-two">
                                <label>
                                    <a href="#">Forgot Password?</a>
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
                            <p className="text-center text-white font-semibold mx-4">OR</p>
                        </div>
                        <OAuth />
                    </form>
                </div>

                {/* Registration Form */}
                <div className={`register-container ${activeForm === 'register' ? 'slide-in-right' : ''}`}>
                    <div className="top">
                        <span>
                            Don’t have an Account? <a href="#" onClick={register}>Sign Up</a>
                        </span>
                        <header>Sign Up</header>
                    </div>
                    <form onSubmit={onSubmit} className='mx-5'>
                        <div className='flex justify-between'>
                            <div className="input-details">
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={onChange}
                                    placeholder="First Name"
                                    className="input-field"
                                />
                                <i className="bx bx-user"></i>
                            </div>
                            <div className="input-details">
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={onChange}
                                    placeholder="Last Name"
                                    className="input-field"
                                />
                                <i className="bx bx-user"></i>
                            </div>
                        </div>
                        <div className="input-details">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={onChange}
                                placeholder="Email address"
                                className="input-field"
                            />
                            <i className="bx bx-envelope"></i>
                        </div>
                        <div className="input-details">
                            <input
                                // type={showPassword ? 'text' : 'password'}
                                type='password'
                                id="password"
                                value={password}
                                onChange={onChange}
                                placeholder="Password"
                                className="input-field"
                            />
                            <i className="bx bx-lock-alt"></i>
                            {/* {showPassword ? (
                                <AiFillEyeInvisible
                                    className="password-toggle text-white"
                                    onClick={() => setShowPassword((prevState) => !prevState)}
                                />
                            ) : (
                                <AiFillEye
                                    className="password-toggle text-white"
                                    onClick={() => setShowPassword((prevState) => !prevState)}
                                />
                            )} */}
                        </div>
                        <div className="input-details">
                            <input type="submit" className="submit" value="Register" />
                        </div>
                        <div className="two-class">
                            <div className="part-one">
                                <input type="checkbox" id="register-check" />
                                <label htmlFor="register-check">Remember Me</label>
                            </div>
                            <div className="part-two">
                                <label>
                                    <a href="#">Terms & Conditions</a>
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
                            <p className="text-center text-white font-semibold mx-4">OR</p>
                        </div>
                        <OAuth />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthForms;
