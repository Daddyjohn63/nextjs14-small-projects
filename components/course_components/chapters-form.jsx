'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pencil, PlusCircle } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '../ui/input';
import { ChaptersList } from './chapters-list';

const formSchema = z.object({
  title: z.string().min(1)
});

export const Chaptersform = ({ initialData, courseId }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => setIsCreating(current => !current);

  const router = useRouter();

  // Define useForm here where initialData is accessible
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ''
    }
  });

  //console.log('[FORMDATA]', form);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async values => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success('Chapter created');
      toggleCreating();
      router.refresh();
    } catch (error) {
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      console.error('Error updating chapter:', error.response?.data || error.message);
      toast.error('Something went wrong!');
    }
  };

  const onReorder = async updateData => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      });
      toast.success('Chapters reordered');
      router.refresh();
    } catch {
      toast.error('Something went wrong from reorder');
    } finally {
      setIsUpdating(false);
    }
  };

  // const onEdit = id => {
  //   router.push(`/create-course/${courseId}/chapters/${id}`);
  // };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <p className="text-blue-500">Course Chapter</p>
        <Button className="mb-2" onClick={toggleCreating} variant="default">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
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
                      placeholder="e.g. Introduction to the course."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.chapters.length && 'text-slate-500 italic'
          )}
        >
          {!initialData.chapters.length && 'No chapters'}
          {/* TODO: Add a list of chapters */}
          <ChaptersList
            onEdit={() => {}}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <div>
          <p className="text-slate-400 text-xs mt-4">
            Drag and drop to reorder the chapters
          </p>
        </div>
      )}
    </div>
  );
};
