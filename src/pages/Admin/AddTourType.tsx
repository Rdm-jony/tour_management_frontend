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
import { useGetTourTypesQuery } from "@/redux/features/tour/tourApi";
import { Trash2 } from "lucide-react";

export default function AddTourType() {
    const { data,isLoading } = useGetTourTypesQuery(undefined);
    if(isLoading){
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
                        {data?.map((item: { name: string }) => (
                            <TableRow>
                                <TableCell className="font-medium w-full">
                                    {item?.name}
                                </TableCell>
                                <TableCell>
                                    <Button size="sm">
                                        <Trash2 />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}