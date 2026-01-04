import {
    GripVertical,
    ChevronRight,
    Pencil,
    Trash2
} from "lucide-react";
import {
    useSortable,
} from '@dnd-kit/sortable';
import {
    CSS,
} from '@dnd-kit/utilities';
import { Designation } from "../types";

interface SortableDesignationItemProps {
    designation: Designation;
    searchQuery: string;
    onSelect: (designation: Designation) => void;
    onEdit: (designation: Designation) => void;
    onDelete: (id: string | undefined) => void;
}

export function SortableDesignationItem({
    designation,
    searchQuery,
    onSelect,
    onEdit,
    onDelete
}: SortableDesignationItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: designation._id || designation.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 ease-out group cursor-pointer ${isDragging ? 'ring-2 ring-teal-500 shadow-lg scale-105 z-50' : ''
                }`}
            onClick={(e) => {
                if ((e.target as HTMLElement).closest('.drag-handle-designation')) {
                    e.stopPropagation();
                    return;
                }
                onSelect(designation);
            }}
        >
            <div className="flex items-start gap-3">
                {!searchQuery && (
                    <div
                        className="drag-handle-designation cursor-grab active:cursor-grabbing p-2 hover:bg-teal-50 rounded transition-colors shrink-0 touch-none"
                        {...attributes}
                        {...listeners}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        title="Drag to reorder"
                    >
                        <GripVertical className="w-5 h-5 text-gray-500 hover:text-teal-600" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">
                            {designation.title}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 ml-2" />
                    </div>
                </div>
                {!searchQuery && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(designation);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(designation._id);
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
