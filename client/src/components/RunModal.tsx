import { Fragment } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import CopyButton from './CopyButton';

interface RunModalProps {
  imageUuid: string;
  prompt: string;
  createdAt: Date;
  isOpen: boolean;
  onClose: () => void;
}

const RunModal = ({
  imageUuid,
  prompt,
  createdAt,
  isOpen,
  onClose,
}: RunModalProps) => {
  const formattedDate = createdAt.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = createdAt.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-2xl transform overflow-hidden rounded-3xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  {prompt}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-gray-400">
                  Created at {formattedDate}, {formattedTime}
                </Dialog.Description>
                <div className="mt-4">
                  <Image
                    src={`http://localhost:8000/static/images/${imageUuid}.png`}
                    alt="Generated image"
                    width={1024}
                    height={1024}
                    className="rounded-xl object-cover" // Ensure the image covers the area well
                    // Tell Next.js to not mess with the URL so we can
                    // properly load from the server
                    unoptimized={true}
                    priority={true}
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <CopyButton prompt={prompt} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default RunModal;
