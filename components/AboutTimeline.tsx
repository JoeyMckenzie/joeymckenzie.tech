import { VFC } from 'react';
import { classNames } from '@/lib/utilities';
import {
  AcademicCapIcon,
  CodeIcon,
  DatabaseIcon,
  TerminalIcon,
} from '@heroicons/react/solid';

const eventTypes = {
  academicCap: {
    icon: AcademicCapIcon,
    bgColorClass: 'bg-red-500 dark:bg-red-700',
  },
  database: {
    icon: DatabaseIcon,
    bgColorClass: 'bg-teal-500 dark:bg-teal-700',
  },
  code: { icon: CodeIcon, bgColorClass: 'bg-indigo-500 dark:bg-indigo-700' },
};

const timeline = [
  {
    type: eventTypes.code,
    content: 'Software Engineer at',
    target: 'National Funding',
    date: 'Jan 2022',
    datetime: '2022-01-17',
    link: 'https://www.nationalfunding.com/',
  },
  {
    type: eventTypes.code,
    content: 'Software Engineer at',
    target: 'MediKeeper',
    date: 'Dec 2020',
    datetime: '2020-12-07',
    link: 'https://medikeeper.com/',
  },
  {
    type: eventTypes.code,
    content: 'Software Developer at',
    target: 'Sierra Pacific Industries',
    date: 'Jan 2020',
    datetime: '2020-01-04',
    link: 'https://www.spi-ind.com/',
  },
  {
    type: eventTypes.code,
    content: 'Software Engineer at',
    target: 'VSP Global',
    date: 'Jun 2018',
    datetime: '2018-06-18',
    link: 'https://vspglobal.com/',
  },
  {
    type: eventTypes.database,
    content: 'Operations Research Analyst at',
    target: 'Engility/SAIC',
    date: 'Sep 2016',
    datetime: '2016-09-23',
    link: 'https://www.saic.com/',
  },
  {
    type: eventTypes.academicCap,
    content: 'Graduated from',
    target: 'San Diego State University, B.S. Astrophysics',
    date: 'May 2016',
    datetime: '2016-05-16',
    link: 'https://astronomy.sdsu.edu/',
  },
];

const AboutTimeline: VFC = () => (
  <section
    aria-labelledby="timeline-title"
    className="lg:col-span-1 lg:col-start-3"
  >
    <div className="bg-white px-4 py-5 shadow dark:bg-stone-800 sm:rounded-lg sm:px-6">
      {/* Activity Feed */}
      <div className="mt-6 flow-root">
        <ul role="list" className="-mb-8">
          {timeline.map((item, itemIdx) => (
            <li key={itemIdx}>
              <div className="relative pb-8">
                {itemIdx !== timeline.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-stone-700"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={classNames(
                        item.type.bgColorClass,
                        'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white dark:ring-stone-800'
                      )}
                    >
                      <item.type.icon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.content}{' '}
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-medium text-gray-900 dark:text-gray-300"
                        >
                          {item.target}
                        </a>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={item.datetime}>{item.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default AboutTimeline;
