import {
  ChangeEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
  VFC,
} from 'react';
import { useForm } from '@formspree/react';
import { CgSpinnerTwoAlt } from 'react-icons/cg';
import { AlertContext } from '@/lib/contexts/alert.context';

const ContactForm: VFC = () => {
  const { setOpenModal, setOpenNotification } = useContext(AlertContext);
  const [{ submitting, succeeded, errors }, handleSubmit] = useForm(
    process.env.NEXT_PUBLIC_FORMSPREE_API_KEY ?? ''
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string>();

  const onNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setName(e.target.value),
    [setName]
  );

  const onEmailChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setEmail(e.target.value),
    [setEmail]
  );

  const onMessageChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => setMessage(e.target.value),
    [setMessage]
  );

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
  };

  useEffect(() => {
    if (!submitting) {
      if (succeeded) {
        setOpenModal(true);
        resetForm();
      } else if (errors && errors.length > 0) {
        console.error(errors);
        setOpenNotification(true);
      }
    }
  }, [submitting, succeeded, errors, setOpenNotification, setOpenModal]);

  return (
    <div className="relative">
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/2" />
      </div>
      <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-5">
        <div className="px-4 sm:px-6 lg:col-span-2 lg:px-8 xl:pr-12">
          <div className="mx-auto max-w-lg">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-3xl">
              Get in touch
            </h2>
            <p className="mt-3 leading-6 text-gray-500 dark:text-gray-400">
              Gotta question for me? Shoot me a message! I&apos;m happy to help
              the developer community however I can, I&apos;ll do my best to get
              back to you in a timely fashion.
            </p>
            <p className="mt-3 pb-6 leading-6 text-gray-500 dark:text-gray-400">
              Interesting in <span className="font-bold">working</span> with me?
              Let me know in the comment!
            </p>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:col-span-3 lg:px-8 xl:pl-12">
          <div className="mx-auto max-w-lg lg:max-w-none">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6">
              <div>
                <label htmlFor="full-name" className="sr-only">
                  Name
                </label>
                <input
                  type="text"
                  name="full-name"
                  id="full-name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={onNameChange}
                  className="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                  placeholder="Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={onEmailChange}
                  autoComplete="email"
                  className="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={message}
                  onChange={onMessageChange}
                  className="block w-full rounded-md border border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-stone-500 focus:ring-stone-500"
                  placeholder="Message"
                  defaultValue={''}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex flex-row items-center justify-center gap-x-2 rounded-md border border-transparent bg-stone-800 py-3 px-6 text-base font-medium text-white shadow-sm hover:bg-stone-700 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-800 focus:ring-offset-2"
                >
                  {submitting && <CgSpinnerTwoAlt className="animate-spin" />}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
