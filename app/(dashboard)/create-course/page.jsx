'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required'
  })
});

export default function CreateCourse() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ''
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async values => {
    try {
      const response = await axios.post('api/courses', values);
      console.log('[AXIOS RESPONSE]', response);
      router.push(`/create-course/${response.data.id}`);
      toast.success('Course Created');
    } catch {
      toast.error('something went wrong');
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="space-y-4">
        <h1 className="text-4xl">Create a Course</h1>
        <p>
          A simple form to create a course name. On submit, it will take you to the course
          page where you can edit the name and create a description.
        </p>
        {/* the form */}
        <div className="mt-5">
          <h1 className="text-2xl">Name your course</h1>
          <p className="text-sm text-slate-600">
            Name your course? Don&apos;t worry, you can change this later.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Advanced web development"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>What will you teach in this course?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Link href="/">
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
        {/* the form end */}
      </div>
    </div>
  );
}
