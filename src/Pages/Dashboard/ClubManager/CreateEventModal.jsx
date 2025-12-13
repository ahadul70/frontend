import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import toast from 'react-hot-toast';

const CreateEventModal = ({ clubId }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosInstance = useAxiosSecurity();
    const queryClient = useQueryClient();

    const createEventMutation = useMutation({
        mutationFn: async (newEvent) => await axiosInstance.post('/events', { ...newEvent, clubId }),
        onSuccess: () => {
            toast.success("Event created!");
            queryClient.invalidateQueries(['club-events', clubId]);
            queryClient.invalidateQueries(['manager-stats', clubId]); // Update stats too
            reset();
            document.getElementById('create_event_modal').close();
        },
        onError: (err) => toast.error("Failed to create event")
    });

    const onSubmit = (data) => {
        const newEvent = {
            eventTitle: data.eventTitle,
            date: data.date,
            location: data.location,
            description: data.description,
            isPaid: data.isPaid,
            eventFee: data.isPaid ? data.eventFee : 0
        };
        createEventMutation.mutate(newEvent);
    };

    return (
        <dialog id="create_event_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Create New Event</h3>
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
                        <button className="btn btn-primary" type="submit" disabled={createEventMutation.isPending}>
                            {createEventMutation.isPending ? 'Creating...' : 'Create'}
                        </button>
                        <button className="btn" type="button" onClick={() => document.getElementById('create_event_modal').close()}>Cancel</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default CreateEventModal;
