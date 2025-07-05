'use client';

import ImageComponent from '../../../components/image';
import Image from 'next/image';
import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import Link from 'next/link';

const SignInPage = () => {
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
                <SignIn.Root>
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
                        Sign in with Google
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
                        Sign in with Apple
                    </Clerk.Connection>
                    {/* credentials login */}
                    <SignIn.Step name='start'>
                        <Clerk.Field
                            name='identifier'
                            className='flex flex-col gap-2'
                        >
                            <Clerk.Input
                                placeholder='example@gmail.com'
                                className='py-2 px-6 rounded-full bg-white text-black w-72 placeholder:text-sm'
                            />
                            <Clerk.FieldError className='text-red-300 text-sm' />
                        </Clerk.Field>
                        <SignIn.Action
                            submit
                            className='mt-2 text-sm underline w-72 text-center text-iconBlue'
                        >
                            Continue
                        </SignIn.Action>
                    </SignIn.Step>
                    <SignIn.Step name='verifications'>
                        <SignIn.Strategy name='password'>
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
                            <div className='flex flex-col gap-2'>
                                <SignIn.Action
                                    submit
                                    className='mt-2 text-sm underline w-72 text-center text-iconBlue'
                                >
                                    Continue
                                </SignIn.Action>
                                <SignIn.Action
                                    navigate='forgot-password'
                                    className='mt-2 text-sm underline w-72 text-center'
                                >
                                    Forgot Password!
                                </SignIn.Action>
                            </div>
                        </SignIn.Strategy>
                        <SignIn.Strategy name='reset_password_email_code'>
                            <p className='text-sm mb-2'>
                                We sent a code to <SignIn.SafeIdentifier />.
                            </p>

                            <Clerk.Field
                                name='code'
                                className='flex flex-col gap-2'
                            >
                                <Clerk.Input
                                    className='py-2 px-6 rounded-full bg-white text-black w-72 placeholder:text-sm'
                                    placeholder='Varification Code'
                                />
                                <Clerk.FieldError className='text-red-300 text-sm' />
                            </Clerk.Field>

                            <SignIn.Action
                                submit
                                className='mt-2 text-sm underline w-72 text-center text-iconBlue'
                            >
                                Continue
                            </SignIn.Action>
                        </SignIn.Strategy>
                    </SignIn.Step>
                    <SignIn.Step
                        name='forgot-password'
                        className='flex justify-between w-72 text-sm'
                    >
                        <SignIn.SupportedStrategy name='reset_password_email_code'>
                            <span className='underline text-iconBlue'>
                                Reset password
                            </span>
                        </SignIn.SupportedStrategy>
                        <SignIn.Action
                            navigate='previous'
                            className='underline'
                        >
                            Go back
                        </SignIn.Action>
                    </SignIn.Step>
                    <SignIn.Step name='reset-password'>
                        <h1>Reset your password</h1>

                        <Clerk.Field name='password'>
                            <Clerk.Label>New password</Clerk.Label>
                            <Clerk.Input />
                            <Clerk.FieldError />
                        </Clerk.Field>

                        <Clerk.Field name='confirmPassword'>
                            <Clerk.Label>Confirm password</Clerk.Label>
                            <Clerk.Input />
                            <Clerk.FieldError />
                        </Clerk.Field>

                        <SignIn.Action submit>Reset password</SignIn.Action>
                    </SignIn.Step>
                    {/* or sign up */}
                    <div className='w-72 flex items-center gap-4'>
                        <div className='h-px bg-borderGray flex-grow'></div>
                        <span className='text-textGraylight'>or</span>
                        <div className='h-px bg-borderGray flex-grow'></div>
                    </div>
                    <Link
                        href='/sign-up'
                        className='bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center'
                    >
                        Create Account
                    </Link>
                    <p className='w-72 text-xs text-muted-foreground text-center mt-4 px-6'>
                        By signing up, you agree that you&apos;re awesome and
                        patient! This platform is a work-in-progress demo for
                        showcasing full-stack development skills. Feedback and
                        good vibes welcome!
                    </p>
                </SignIn.Root>
            </div>
        </div>
    );
};

export default SignInPage;
