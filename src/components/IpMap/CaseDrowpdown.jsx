import { Fragment, useEffect, useLayoutEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useGetCasesQuery } from '@/api/cortexApi'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CaseDropdown({ activeCase, setActiveCase }) {
  const { data: cases, error, isLoading } = useGetCasesQuery()

  useLayoutEffect(() => {
    if (cases) {
      console.log('allCases', cases)
    }
  }, [cases])

  return (
    <Listbox
      onChange={setActiveCase}
      as="div"
      className="relative flex w-fit justify-start text-left"
    >
      <div className="inline-flex w-fit justify-start px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:text-zinc-100">
        Select your case:
      </div>
      <div>
        <Listbox.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-zinc-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 dark:border-none dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-gray-600">
          {activeCase?.description || 'no case selected'}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Listbox.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Listbox.Options className="absolute right-0 z-10 mt-11 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-zinc-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-gray-600 dark:bg-zinc-800  dark:text-zinc-300 ">
          <div className="px-4 py-3">
            {/* <p className="text-sm">Select your case</p> */}
            <p className="truncate text-sm font-medium text-gray-700  dark:text-zinc-300 ">
              Soo many cases ...
            </p>
          </div>
          {cases &&
            cases
              .map((a) => a)
              .sort((a, b) => a.caseId - b.caseId)
              .map((caseData) => {
                if (caseData) {
                  return (
                    <div
                      className="py-1"
                      key={caseData.caseId + 'caseDropdown'}
                    >
                      <Listbox.Option value={caseData}>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-zinc-200'
                                : 'text-gray-700 dark:text-zinc-300',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            {caseData.caseId + ' : ' + caseData.description}
                          </a>
                        )}
                      </Listbox.Option>
                    </div>
                  )
                }
              })}
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}
