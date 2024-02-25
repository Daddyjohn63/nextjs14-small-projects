import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId
      },
      data: {
        ...values
      }
    });
    //('[COURSE FROM api route]', course);

    return NextResponse.json(course);
  } catch (error) {
    console.log('[Internal Error]', { status: 500 });
  }
}
