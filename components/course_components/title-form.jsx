'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required'
  })
});

export const Titleform = ({ initialData, courseId }) => {
  // Define useForm here where initialData is accessible
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  //console.log('[FORMDATA]', form);

  const { isSubmitting, isValid } = form.formState;

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const onSubmit = async values => {
    try {
      console.log('[COURSE PATCH REQUEST]', values);
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error('Error updating course:', error.response?.data || error.message);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <p className="text-blue-500"> Course name</p>
        <Button className="mb-2" onClick={toggleEdit} variant="default">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit course name
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-blue-500 text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-43">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. Music lessons"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2 mt-3">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
