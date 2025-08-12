/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Password from "@/components/ui/Password"
import { useLoginMutation } from "@/redux/features/auth/authApi"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router"

    ;

export function LoginForm({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const navigate = useNavigate()
    const [login] = useLoginMutation()
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",

        },
    })

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {

        try {
            const response = await login(data).unwrap()
            toast.success(response.message)
            console.log(response)
            navigate("/")
        } catch (error: any) {
            toast.error(error?.data?.message || "Network error")
            if (error.status === 401) {
                navigate("/verify", { state: data.email })
            }
        }
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-xl font-bold">Login your account</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details to create an account
                </p>
            </div>
            <div className="grid gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="jony@company.com" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Password {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </Form>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                        Or continue with
                    </span>
                </div>
                <Button
                    type="button"

                    className="w-full cursor-pointer text-white"
                >
                    Login with Google
                </Button>
            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="underline underline-offset-4">
                    Sign up
                </Link>
            </div>
        </div>
    )
}
