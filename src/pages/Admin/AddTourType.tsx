/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AddTourTypeModal } from "@/modules/Admin/TourType/AddTourModal";
import { useGetTourTypesQuery, useRemoveTourTypeMutation } from "@/redux/features/tour/tourApi";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AddTourType() {
    const { data, isLoading } = useGetTourTypesQuery(undefined);
    const [removeTourType] = useRemoveTourTypeMutation()

    const handleRemoveTourType = async (tourTypeId: string) => {
        const toastId=toast.loading("Removing...")
        try {
            const response = await removeTourType(tourTypeId).unwrap()
            if (response.success) {
                toast.success(response.message,{id:toastId})
            }
        } catch (error: any) {
            toast.error(error.data.message,{id:toastId})
        }
    }
    if (isLoading) {
        return <p>loading...</p>
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-5">
            <div className="flex justify-between my-8">
                <h1 className="text-xl font-semibold">Tour Types</h1>
                <AddTourTypeModal />
            </div>
            <div className="border border-muted rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((item: {_id:string, name: string }) => (
                            <TableRow>
                                <TableCell className="font-medium w-full">
                                    {item?.name}
                                </TableCell>
                                <TableCell>

                                    <DeleteConfirmation onConfirm={()=>handleRemoveTourType(item._id)}>
                                        <Button size="sm">
                                            <Trash2 />
                                        </Button>
                                    </DeleteConfirmation>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}