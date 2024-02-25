import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorised', { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      }
    });

    if (!courseOwner) {
      console.log('[course owner]', 'no course owner');
      return new NextResponse('Unathorised', { status: 401 });
    }

    //find the last chapter created and it's position, so we know the position of any new chapter.
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId
      },
      orderBy: {
        position: 'desc'
      }
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition
      }
    });
    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[CHAPTERS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
