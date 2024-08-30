'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <section className='left_sidebar'>
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
          const isActive = pathname === route || pathname.startsWith(`${route}/`);

          return (
            <Link href={route} key={label} className={cn('flex gap-3 items-center py-4 max-md:px-4 justify-center md:justify-start hover:bg-nav-hover', {
              'bg-nav-focus border-r-4 border-orange-1' : isActive
            })}>
              <Image src={imgUrl} alt={label} width={24} height={24} />
              <p>{label}</p>
            </Link>
          )
        })}
      </nav>
    </section>
  );
}

export default LeftSidebar