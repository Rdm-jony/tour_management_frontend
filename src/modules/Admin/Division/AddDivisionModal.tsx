/* eslint-disable @typescript-eslint/no-explicit-any */
import SingleImageUploader from "@/components/SingleImageUploader";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddDivisionMutation } from "@/redux/features/division/divisionApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const divisionSchema = z.object({
    name: z
        .string("Name must be a string")
        .min(2, "Name must be at least 2 characters long"),
    description: z
        .string( "Description must be a string")
        .min(10, "Description must be at least 10 characters long")
        .optional(),

})
export function AddDivisionModal() {
    const [open,setOpen]=useState(false)
    const [image, setImage] = useState<File | null>(null);
    const [addDivision] = useAddDivisionMutation();

    const form = useForm<z.infer<typeof divisionSchema>>(
        {
            resolver: zodResolver(divisionSchema),
            defaultValues: {
                name: "",
                description: undefined
            }

        }
    );

    const onSubmit = async (data: z.infer<typeof divisionSchema>) => {
        const toastId=toast.loading("creating...")
        try {
            const formData = new FormData()
            formData.append("data", JSON.stringify(data))
            formData.append("file", image as File)

            const response = await addDivision(formData).unwrap()
            if (response.success) {
                toast.success(response?.message,{id:toastId});
                setOpen(false)
            }

        } catch (error: any) {
            console.log(error)
            toast.error(error?.data?.message,{id:toastId});
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button>Add Tour Type</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Tour Type</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form id="add-tour-type" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tour Type Name"
                                                {...field}
                                               
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us a little bit about yourself"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                        <SingleImageUploader onChange={setImage} />

                    </Form>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="add-tour-type">
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}