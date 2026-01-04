import {
    GripVertical,
    X,
} from "lucide-react";
import {
    useSortable,
} from '@dnd-kit/sortable';
import {
    CSS,
} from '@dnd-kit/utilities';
import { Training } from "../types";

interface SortableTrainingItemProps {
    training: Training;
    onRemove: (assignmentId: string) => void;
}

export function SortableTrainingItem({
    training,
    onRemove,
}: SortableTrainingItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: training.assignmentId || training._id || '' });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all group cursor-move ${isDragging ? 'ring-2 ring-teal-500 shadow-lg scale-105 z-50' : ''
                }`}
        >
            <div
                className="drag-handle cursor-move p-1 hover:bg-gray-100 rounded transition-colors"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 w-6">
                        {(training.order || 0) + 1}.
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900">
                        {training.programTitle}
                    </h4>
                </div>
            </div>
            <button
                onClick={() => onRemove(training.assignmentId!)}
                className="p-1.5 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
                <X className="w-4 h-4 text-red-500" />
            </button>
        </div>
    );
}
