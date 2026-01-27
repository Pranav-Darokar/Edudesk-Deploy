import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Table = ({ columns, data, onEdit, onDelete, renderActions, actions = true, showDelete = true, showEdit = true }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                                {col.header}
                            </th>
                        ))}
                        {actions && (
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Actions</span>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="py-4 text-center text-sm text-gray-500">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item.id}>
                                {columns.map((col) => (
                                    <td
                                        key={`${item.id}-${col.key}`}
                                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                    >
                                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex justify-end space-x-2">
                                            {renderActions ? (
                                                renderActions(item)
                                            ) : (
                                                <>
                                                    {showEdit && (
                                                        <button
                                                            onClick={() => onEdit(item)}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    {showDelete && (
                                                        <button
                                                            onClick={() => onDelete(item.id)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
