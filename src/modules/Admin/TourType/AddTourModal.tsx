/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useAddTourTypeMutation } from "@/redux/features/tour/tourApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const tourTypeSchema = z.object({
    name: z.string().nonempty("tour type is required")
})
export function AddTourTypeModal() {
    const form = useForm<z.infer<typeof tourTypeSchema>>(
        {
            resolver: zodResolver(tourTypeSchema),
            defaultValues:{
                name:""
            }

        }
    );
    const [addTourType] = useAddTourTypeMutation();

    const onSubmit = async (data: z.infer<typeof tourTypeSchema>) => {
        try {
            const response = await addTourType({ name: data.name }).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (error: any) {

            toast.error(error?.data?.message);

        }
    };

    return (
        <Dialog>
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
                                        <FormLabel>Tour Type Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tour Type Name"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
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