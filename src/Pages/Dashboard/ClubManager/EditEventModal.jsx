import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import toast from 'react-hot-toast';

const EditEventModal = ({ event, clubId, onClose }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosInstance = useAxiosSecurity();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (event) {
            reset({
                eventTitle: event.eventTitle,
                date: event.date?.split('T')[0], // Format date for input
                location: event.location,
                description: event.description,
                isPaid: event.isPaid,
                eventFee: event.eventFee
            });
        }
    }, [event, reset]);

    const updateEventMutation = useMutation({
        mutationFn: async ({ eventId, data }) => await axiosInstance.put(`/events/${eventId}`, { ...data, clubId }),
        onSuccess: () => {
            toast.success("Event updated!");
            queryClient.invalidateQueries(['club-events', clubId]);
            document.getElementById('edit_event_modal').close();
            if (onClose) onClose();
        },
        onError: (err) => toast.error("Failed to update event")
    });

    const onSubmit = (data) => {
        const updatedData = {
            ...data,
            isPaid: data.isPaid, // Checkbox returns boolean
            eventFee: data.isPaid ? data.eventFee : 0
        };
        updateEventMutation.mutate({ eventId: event._id, data: updatedData });
    };

    return (
        <dialog id="edit_event_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Edit Event</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="py-4 flex flex-col gap-3">
                    <input 
                        {...register('eventTitle', { required: "Event Title is required" })} 
                        placeholder="Event Title" 
                        className="input input-bordered w-full" 
                    />
                    {errors.eventTitle && <span className="text-error text-sm">{errors.eventTitle.message}</span>}

                    <input 
                        type="date" 
                        {...register('date', { required: "Date is required" })} 
                        className="input input-bordered w-full" 
                    />
                    {errors.date && <span className="text-error text-sm">{errors.date.message}</span>}

                    <input 
                        {...register('location', { required: "Location is required" })} 
                        placeholder="Location" 
                        className="input input-bordered w-full" 
                    />
                    {errors.location && <span className="text-error text-sm">{errors.location.message}</span>}

                    <textarea 
                        {...register('description')} 
                        placeholder="Description" 
                        className="textarea textarea-bordered"
                    ></textarea>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                            <span className="label-text">Paid Event?</span>
                            <input 
                                type="checkbox" 
                                {...register('isPaid')} 
                                className="checkbox" 
                            />
                        </label>
                    </div>

                    <input 
                        type="number" 
                        placeholder="Fee Amount (if paid)" 
                        className="input input-bordered w-full"
                        {...register('eventFee')} 
                    />

                    <div className="modal-action">
                        <button className="btn btn-primary" type="submit" disabled={updateEventMutation.isPending}>
                            {updateEventMutation.isPending ? 'Updating...' : 'Update'}
                        </button>
                        <button className="btn" type="button" onClick={() => {
                            document.getElementById('edit_event_modal').close();
                            if (onClose) onClose();
                        }}>Cancel</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default EditEventModal;
