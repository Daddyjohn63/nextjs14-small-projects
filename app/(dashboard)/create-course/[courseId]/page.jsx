import { Chaptersform } from '@/components/course_components/chapters-form';
import { Descriptionform } from '@/components/course_components/description-form';
import { Titleform } from '@/components/course_components/title-form';
import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { LayoutDashboard, ListChecks } from 'lucide-react';

const CourseIdPage = async ({ params }) => {
  console.log('[PAGE PARAMS]', params);
  //[PAGE PARAMS] { courseId: 'ef579098-dfe6-4c07-8fc5-b23ee34abd47' }
  // 'courseId', comes from the way the routes folder is structured. [courseId].
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }
  //Get all the data we have about this course using the params.
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc'
        }
      }
    }
  });

  //array of required fields
  const requiredFields = [
    course.title,
    course.description,
    course.chapters.some(chapter => chapter.isPublished)
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  if (!course) {
    return redirect('/');
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customise your course</h2>
          </div>
          {/* pass in the initial data we have from this course based on the db query we make earlier. */}
          <Titleform initialData={course} courseId={course.id} />
          <Descriptionform initialData={course} courseId={course.id} />
          {/* <Sectorform
            initialData={course}
            companyId={course.id}
            //do not understand this..why we map over?
            options={sectors.map(sector => ({
              label: sector.name,
              value: sector.id
            }))}
          /> */}
        </div>

        {/* new */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course chapters</h2>
            </div>
            <Chaptersform initialData={course} courseId={course.id} />
          </div>
          {/* <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div> */}
        </div>

        {/* new end */}
      </div>
    </div>
  );
};

export default CourseIdPage;
