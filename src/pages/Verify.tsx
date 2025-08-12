/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Dot } from "lucide-react";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

const Verify = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [sendOtp] = useSendOtpMutation()
    const [verifyOtp] = useVerifyOtpMutation()
    const [confirmed, setConfirmed] = useState(false);
    const [timer, setTimer] = useState(120);
    const [email] = useState(location.state);



    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    const handleSendOtp = async () => {

        const toastId = toast.loading("Sending OTP");

        try {
            const response = await sendOtp({ email }).unwrap()
            if (response.success) {
                toast.success("OTP Sent", { id: toastId });
                setConfirmed(true);
                setTimer(120);
            }
        } catch (error: any) {
            toast.error(error.data.message, { id: toastId })
        }
    }

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const toastId = toast.loading("Verifying OTP");

        const verifyInfo = {
            email,
            otp: data.pin
        }
        try {
            const response = await verifyOtp(verifyInfo).unwrap()
            if (response.success) {
                toast.success("OTP Verified", { id: toastId });
                setConfirmed(true);
                navigate("/login")
            }

        } catch (error: any) {
            toast.error(error.data.message, { id: toastId })
        }
    }

    useEffect(() => {
        if (!email || !confirmed) {
            return;
        }

        const timerId = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timerId);
    }, [email, confirmed]);

    return (
        <div className="grid place-content-center h-svh">
            {
                confirmed ? (<Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Verify your email address</CardTitle>
                        <CardDescription>Please enter the 6-digit code we sent to <br /> {email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form id="otp-form" onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="pin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>One-Time Password</FormLabel>
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={1} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={2} />
                                                    </InputOTPGroup>
                                                    <Dot />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={3} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={4} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription>
                                                <Button
                                                    onClick={handleSendOtp}
                                                    type="button"
                                                    variant="link"
                                                    disabled={timer !== 0}
                                                    className={cn("p-0 m-0", {
                                                        "cursor-pointer": timer === 0,
                                                        "text-gray-500": timer !== 0,
                                                    })}
                                                >
                                                    Resent OPT:{" "}
                                                </Button>{" "}
                                                {timer}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>

                    </CardContent>
                    <CardFooter>
                        <Button form="otp-form" type="submit">Submit</Button>

                    </CardFooter>
                </Card>) : (<Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Verify your email address</CardTitle>
                        <CardDescription>
                            We will send you an OTP at <br /> {email}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-end">
                        <Button onClick={handleSendOtp} className="w-[300px]">
                            Confirm
                        </Button>
                    </CardFooter>
                </Card>)
            }
        </div>
    );
};

export default Verify;