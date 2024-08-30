'use client';

import { useUser, SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useAudio } from '@/providers/AudioProvider';

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { audio } = useAudio();
  const { user } = useUser(); // Get the current user

  return (
    <section
      className={cn('left_sidebar h-[calc(100vh-5px)]', {
        'h-[calc(100vh-140px)]': audio?.audioUrl,
      })}
    >
      <nav className='flex flex-col gap-6'>
        <Link
          href='/'
          className='flex cursor-pointer items-center gap-1 pb-10 max-md:justify-center'
        >
          <Image src='/icons/logo.svg' alt='logo' width={23} height={27} />
          <h1 className='text-24 font-extrabold text-white-1 max-md:hidden'>
            Podcastr
          </h1>
        </Link>

        {sidebarLinks.map(({ route, label, imgUrl }) => {
          // Replace the static profile route with a dynamic one if it's the profile link
          const profileRoute =
            route === '/profile' ? `/profile/${user?.id}` : route;

          const isActive =
            pathname === profileRoute ||
            pathname.startsWith(`${profileRoute}/`);

          return (
            <Link
              href={profileRoute}
              key={label}
              className={cn(
                'flex gap-3 items-center py-4 max-md:px-4 justify-center md:justify-start hover:bg-nav-hover',
                {
                  'bg-nav-focus border-r-4 border-orange-1': isActive,
                }
              )}
            >
              <Image src={imgUrl} alt={label} width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>

      <SignedOut>
        <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
          <Button
            asChild
            className='text-16 w-full bg-orange-1 hover:bg-orange-1/80 font-extrabold'
          >
            <Link href='/sign-in'>Sign in</Link>
          </Button>
        </div>
      </SignedOut>

      <SignedIn>
        <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
          <Button
            className='text-16 w-full bg-orange-1 hover:bg-orange-1/80 font-extrabold'
            onClick={() => signOut(() => router.push('/'))}
          >
            Log Out
          </Button>
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
