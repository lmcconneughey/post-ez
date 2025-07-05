'use client';

import ImageComponent from '../../../components/image';
import Image from 'next/image';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import Link from 'next/link';

const SignUpPage = () => {
    return (
        <div className='h-screen flex items-center justify-between p-8'>
            <div className='hidden lg:flex w-1/2 items-center justify-center'>
                <ImageComponent
                    path='posts/e-z%20(1).png'
                    alt='logo'
                    w={600}
                    h={600}
                    tr={true}
                />
            </div>
            <div className=' w-full lg:w-1/2 flex flex-col gap-4'>
                <h1 className='text-2xl xsm:text-4xl md:text-6xl font-bold'>
                    Happening Now
                </h1>
                <h1 className='text-2xl'>Join today</h1>
                <SignUp.Root>
                    <SignUp.Step name='start' className='flex flex-col gap-4'>
                        <Clerk.Connection
                            name='google'
                            className='bg-white rounded-full text-black p-2 w-72 flex items-center justify-center gap-2 font-bold'
                        >
                            <Image
                                src='/icons/icons8-google.svg'
                                alt='google logo'
                                width={24}
                                height={24}
                                priority
                            />
                            Sign up with Google
                        </Clerk.Connection>
                        <Clerk.Connection
                            name='apple'
                            className='bg-white rounded-full text-black p-2 w-72 flex items-center justify-center gap-2 font-bold'
                        >
                            <Image
                                src='/icons/icons8-apple-inc-50.png'
                                alt='apple logo'
                                width={24}
                                height={24}
                                priority
                            />
                            Sign up with Apple
                        </Clerk.Connection>
                        <div className='flex flex-col gap-4'>
                            Sign up with credentials
                            <Clerk.Field
                                name='username'
                                className='flex flex-col gap-2'
                            >
                                <Clerk.Input
                                    placeholder='Username'
                                    className='py-2 px-6 rounded-full bg-white text-black w-72 placeholder:text-sm'
                                />
                                <Clerk.FieldError className='text-red-300 text-sm' />
                            </Clerk.Field>
                            <Clerk.Field
                                name='emailAddress'
                                className='flex flex-col gap-2'
                            >
                                <Clerk.Input
                                    placeholder='example@gmail.com'
                                    className='py-2 px-6 rounded-full bg-white text-black w-72 placeholder:text-sm'
                                />
                                <Clerk.FieldError className='text-red-300 text-sm' />
                            </Clerk.Field>
                            <Clerk.Field
                                name='password'
                                className='flex flex-col gap-2'
                            >
                                <Clerk.Input
                                    placeholder='password'
                                    className='py-2 px-6 rounded-full bg-white text-black w-72 placeholder:text-sm'
                                />
                                <Clerk.FieldError className='text-red-300 text-sm' />
                            </Clerk.Field>
                            <SignUp.Captcha />
                            <SignUp.Action
                                submit
                                className='bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center cursor-pointer'
                            >
                                Sign Up
                            </SignUp.Action>
                        </div>
                    </SignUp.Step>
                    <SignUp.Step
                        name='continue'
                        className='flex flex-col gap-4'
                    >
                        <Clerk.Field name='username'>
                            <Clerk.Input
                                placeholder='Username'
                                className='py-2 px-6 rounded-full bg-white text-black w-72 placeholder:text-sm'
                            />
                            <Clerk.FieldError className='text-red-300 text-sm' />
                        </Clerk.Field>

                        <SignUp.Action
                            className='w-72 text center text-iconBlue underline'
                            submit
                        >
                            Continue
                        </SignUp.Action>
                    </SignUp.Step>
                    <SignUp.Step name='verifications'>
                        <SignUp.Strategy name='email_code'>
                            <h1 className='text-sm mb-2'>Check your email</h1>
                            <Clerk.Field
                                name='code'
                                className='flex flex-col gap-4'
                            >
                                <Clerk.Input
                                    placeholder='Verifcation code'
                                    className='py-2 px-6 rounded-full bg-white text-black w-72 placeholder:text-sm'
                                />
                                <Clerk.FieldError className='text-red-300 text-sm' />
                            </Clerk.Field>
                            <SignUp.Action
                                submit
                                className='mt-2 underline text-iconBlue text-sm'
                            >
                                Verify
                            </SignUp.Action>
                        </SignUp.Strategy>
                    </SignUp.Step>
                    {/* or sign up */}
                    <div className='w-72 flex items-center gap-4'>
                        <div className='h-px bg-borderGray flex-grow'></div>
                        <span className='text-textGraylight'>or</span>
                        <div className='h-px bg-borderGray flex-grow'></div>
                    </div>
                    <Link
                        href='/sign-in'
                        className='bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center'
                    >
                        Already have an accout?
                    </Link>
                    <p className='w-72 text-xs text-muted-foreground text-center mt-4 px-6'>
                        By signing up, you agree that you&apos;re awesome and
                        patient! This platform is a work-in-progress demo for
                        showcasing full-stack development skills. Feedback and
                        good vibes welcome!
                    </p>
                </SignUp.Root>
            </div>
        </div>
    );
};

export default SignUpPage;
