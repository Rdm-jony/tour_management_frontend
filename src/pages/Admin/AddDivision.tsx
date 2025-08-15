/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddDivisionModal } from "@/modules/Admin/Division/AddDivisionModal";
import { useGetDivisionQuery, useRemoveDivisionMutation } from "@/redux/features/division/divisionApi";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AddDivision() {
    const { data, isLoading } = useGetDivisionQuery(undefined);

    const [removeDivision] = useRemoveDivisionMutation()

    const handleRemoveDivision = async (divisionId: string) => {
        const toastId = toast.loading("Removing...")
        try {
            const response = await removeDivision(divisionId).unwrap()
            if (response.success) {
                toast.success(response.message, { id: toastId })
            }
        } catch (error: any) {
            toast.error(error.data.message, { id: toastId })
        }
    }
    if (isLoading) {
        return <p>loading...</p>
    }

    return (
        <div>
            <h1> This is AddDivision component </h1>
            <AddDivisionModal />
            <div className="border border-muted rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((item: { _id: string, name: string }) => (
                            <TableRow>
                                <TableCell className="font-medium w-full">
                                    {item?.name}
                                </TableCell>
                                <TableCell>

                                    <DeleteConfirmation onConfirm={() => handleRemoveDivision(item._id)}>
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