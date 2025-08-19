/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { file, z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetDivisionQuery } from "@/redux/features/division/divisionApi"
import { useAddTourMutation, useGetTourTypesQuery } from "@/redux/features/tour/tourApi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MultiImageUploader from "@/components/MultiImageUploader"
import { useState } from "react"
import type { FileMetadata } from "@/hooks/use-file-upload"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { formatISO } from "date-fns"
import { CalendarIcon, MinusCircle, PlusCircle, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const FormSchema = z.object({
    title: z
        .string("Title must be a string")
        .min(3, "Title must be at least 3 characters long"),
    description: z
        .string("Description must be a string")
        .min(10, "Description must be at least 10 characters")
        .optional(),
    images: z
        .array(z.string().url("Each image must be a valid URL"))
        .optional(),

    // amenities: z
    //     .array(z.string())
    //     .optional(),

    included: z
        .array(z.object({ value: z.string() }))
    ,

    excluded: z
        .array(z.object({ value: z.string() }))
    ,

    // tourPlan: z
    //     .array(z.string())
    //     .optional(),

    // costForm: z
    //     .number("Cost must be a number")
    //     .positive("Cost must be greater than 0").optional(),

    startDate: z
        .string("Start date must be a string")
        .refine(val => !isNaN(Date.parse(val)), {
            message: "Start date must be a valid ISO date string",
        }).optional(),

    endDate: z
        .string("End date must be a string")
        .refine(val => !isNaN(Date.parse(val)), {
            message: "End date must be a valid ISO date string",
        }).optional(),

    // location: z
    //     .string("Location must be a string")
    //     .min(3, "Location must be at least 3 characters").optional(),

    // maxGuest: z
    //     .number("Max guest must be a number")
    //     .int()
    //     .positive().optional(),

    // minAge: z
    //     .number("Min age must be a number")
    //     .int()
    //     .positive().optional(),
    division: z.string().min(1, "Division is required"),
    tourType: z.string().min(1, "Tour type is required"),

})

export function AddTour() {
    const [images, setImages] = useState<File[] | (File | FileMetadata)[]>([])
    const { data: divisionData, isLoading: divisionLoading } =
        useGetDivisionQuery(undefined);
    const { data: tourTypeData, isLoading: tourTypeLoading } = useGetTourTypesQuery(undefined);
    const [addTour] = useAddTourMutation()

    const divisionOptions = divisionData?.map(
        (item: { _id: string; name: string }) => ({
            value: item._id,
            label: item.name,
        })
    );

    const tourTypeOptions = tourTypeData?.map(
        (tourType: { _id: string; name: string }) => ({
            value: tourType._id,
            label: tourType.name,
        })
    );


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            // amenities: [],
            // costForm: undefined,
            description: "",
            endDate: "",
            excluded: [{ value: "" }],
            images: [],
            included: [{ value: "" }],
            // location: "",
            // maxGuest: undefined,
            // minAge: undefined,
            startDate: "",
            // tourPlan: [],
            division: "",
            tourType: "",
        },
    })

    const { fields: includedFields, append: includedAppend, remove: includedRemove } = useFieldArray({
        control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "included", // unique name for your Field Array
    });
    const { fields: excludedFields, append: excludedAppend, remove: excludedRemove } = useFieldArray({
        control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "excluded", // unique name for your Field Array
    });
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        // const toastId = toast.loading("creating....")
        const tourData = {
            ...data,
            included: data.included[0].value === ""
                ? []
                : data.included.map((item: { value: string }) => item.value),
            excluded: data.excluded[0].value === ""
                ? []
                : data.excluded.map((item: { value: string }) => item.value),


        }
        console.log(tourData)
        const formData = new FormData()

        formData.append("data", JSON.stringify(data))
        images.forEach(image => formData.append("files", image as File))
        // try {
        //     const response = await addTour(formData).unwrap()
        //     if (response.success) {
        //         toast.success(response?.message, { id: toastId })
        //     }

        // } catch (error: any) {
        //     console.log(error)
        //     toast.error(error?.data.message, { id: toastId })
        // }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Tour</CardTitle>
                <CardDescription>
                    Add a new tour to the system
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form id="tourForm" onSubmit={form.handleSubmit(onSubmit)} className="w-full grid grid-cols-2 space-y-6 gap-5">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Tour Title</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="division"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Division</FormLabel>
                                    <Select disabled={divisionLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a division" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                divisionOptions?.map((item: { value: string; label: string }) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tourType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>TourType</FormLabel>
                                    <Select disabled={tourTypeLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a tour type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                tourTypeOptions?.map((item: { value: string; label: string }) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Start Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        formatISO(field.value)
                                                    ) : (
                                                        <span>Pick a start date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? date.toISOString() : undefined)}
                                                disabled={(date) =>
                                                    date < new Date(new Date().setDate(new Date().getDate() - 1))
                                                }
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>End Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        formatISO(field.value)
                                                    ) : (
                                                        <span>Pick a end date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? date.toISOString() : undefined)}
                                                disabled={(date) => {
                                                    const start = form.getValues("startDate");
                                                    console.log(start)
                                                    if (start) {
                                                        return date < new Date(start); // disable all before startDate
                                                    }
                                                    return date < new Date(new Date().setDate(new Date().getDate() - 1)); // fallback: disable past dates
                                                }}
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about tour"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <div className="flex justify-between items-center">
                                <Label>Included</Label>
                                <Button onClick={() => includedAppend({ value: "" })} variant="outline" type="button" size="icon">
                                    <PlusCircle />
                                </Button>
                            </div>
                            {includedFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`included.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Tour Included {index + 1}</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        onClick={() => includedRemove(index)}
                                        variant="outline"
                                        className="mt-6"
                                        size="icon"
                                        type="button"
                                    >
                                        <MinusCircle />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <Label>Exncluded</Label>
                                <Button onClick={() => excludedAppend({ value: "" })} variant="outline" type="button" size="icon">
                                    <PlusCircle />
                                </Button>
                            </div>
                            {excludedFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`excluded.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Tour Excluded {index + 1}</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        onClick={() => excludedRemove(index)}
                                        variant="outline"
                                        className="mt-6"
                                        size="icon"
                                        type="button"
                                    >
                                        <MinusCircle />
                                    </Button>
                                </div>
                            ))}
                        </div>

                    </form>
                    <MultiImageUploader onChange={setImages} />
                </Form>
            </CardContent>
            <CardFooter>
                <Button form="tourForm" type="submit">Submit</Button>
            </CardFooter>
        </Card>
    )
}
