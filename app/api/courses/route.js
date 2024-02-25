import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title
      }
    });
    console.log('[COURSE API]', course); //Prisma sends back the whole table object for the course.See below. To fine tune this we could use the select option. This would mean less data transferred back from the db. see below.
    return NextResponse.json(course); //returned back to /create-course/page.jsx
  } catch (error) {
    console.log('[COURSES API]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// [COURSE API] {
//   id: '3e0f5064-ad04-4cef-b123-ad711bda383d',
//   userId: 'user_2ZnaczcAGvvz7g2T0PIKLHXolOF',
//   title: 'test',
//   description: null,
//   imageUrl: null,
//   price: null,
//   isPublished: false,
//   categoryId: null,
//   createdAt: 2024-02-21T16:34:59.994Z,
//   updatedAt: 2024-02-21T16:34:59.994Z
// }

// const course = await db.course.create({
//   data: {
//     userId,
//     title
//   },
//   select: {
//     id: true,
//     userId: true,
//     title: true
//// Specify other fields you want to return here
//// Fields not listed here will not be included in the output
//   }
// });
